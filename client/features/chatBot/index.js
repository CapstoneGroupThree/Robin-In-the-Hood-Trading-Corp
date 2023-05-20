import React, { useState, useEffect, useRef } from "react";

import "./chatBot.css";

const Chatbot = ({ ticker }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const chatContainerRef = useRef();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  const prepareMessagesForAPI = (messages) => {
    return messages.map(({ id, ...rest }) => rest);
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = {
      id: generateUniqueId(),
      role: "user",
      content: newMessage,
    };
    const aiMessage = {
      id: generateUniqueId(),
      role: "assistant",
      content: "Robin is thinking...",
    };

    setMessages((oldMessages) => [...oldMessages, userMessage, aiMessage]);
    setNewMessage("");

    const messagesForAPI = prepareMessagesForAPI([
      ...messages,
      userMessage,
      aiMessage,
    ]);

    const loadingDots = setInterval(() => {
      setMessages((currentMessages) => {
        return currentMessages.map((message) => {
          if (message.id === aiMessage.id) {
            if (message.content.endsWith("...")) {
              return { ...message, content: "Robin is thinking." };
            } else if (message.content.endsWith("..")) {
              return { ...message, content: "Robin is thinking..." };
            } else if (message.content.endsWith(".")) {
              return { ...message, content: "Robin is thinking.." };
            }
          }
          return message;
        });
      });
    }, 500);

    try {
      const response = await fetch("http://localhost:8080/openAi/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesForAPI,
        }),
      });

      clearInterval(loadingDots);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const parsedData = data.assistant;
        console.log(parsedData);

        if (parsedData) {
          let index = -1;
          const interval = setInterval(() => {
            if (index < parsedData.length - 1) {
              setMessages((currentMessages) => {
                const updatedMessages = currentMessages.map((message) =>
                  message.id === aiMessage.id
                    ? {
                        ...message,
                        content:
                          index === 0
                            ? parsedData[index]
                            : message.content + parsedData[index],
                      }
                    : message
                );
                console.log(updatedMessages);
                return updatedMessages;
              });
              index++;
            } else {
              clearInterval(interval);
            }
          }, 10);
        }
      } else {
        throw new Error(await response.text());
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleAdvancedPrompt = async (promptType) => {
    const symbol = ticker;

    // Create the AI's thinking message
    const aiThinkingMessage = {
      id: generateUniqueId(),
      role: "assistant",
      content: "Robin is thinking very hard...",
    };

    // Add the thinking very hard message to the messages array
    setMessages((oldMessages) => [...oldMessages, aiThinkingMessage]);

    // Set up the transition dots and typing effect
    const loadingDots = setInterval(() => {
      setMessages((currentMessages) => {
        return currentMessages.map((message) => {
          if (message.id === aiThinkingMessage.id) {
            if (message.content.endsWith("...")) {
              return { ...message, content: "Robin is thinking very hard." };
            } else if (message.content.endsWith("..")) {
              return { ...message, content: "Robin is thinking very hard..." };
            } else if (message.content.endsWith(".")) {
              return { ...message, content: "Robin is thinking very hard.." };
            }
          }
          return message;
        });
      });
    }, 500);

    const response = await fetch(
      `http://localhost:8080/polygon/summary/${symbol}?promptType=${promptType}`
    );

    clearInterval(loadingDots);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const parsedData = data.assistant;
      console.log(parsedData);

      if (parsedData) {
        let index = -1;
        const interval = setInterval(() => {
          if (index < parsedData.length - 1) {
            setMessages((currentMessages) => {
              const updatedMessages = currentMessages.map((message) =>
                message.id === aiThinkingMessage.id
                  ? {
                      ...message,
                      content:
                        index === 0
                          ? parsedData[index]
                          : message.content + parsedData[index],
                    }
                  : message
              );
              console.log(updatedMessages);
              return updatedMessages;
            });
            index++;
          } else {
            clearInterval(interval);
          }
        }, 10);
      }
    }
  };

  if (!showChat) {
    return (
      <div>
        <img
          onClick={() => setShowChat(true)}
          src="/aiChatRB.png"
          alt="your AI chat assistant "
          className="w-20 h-20"
        ></img>
      </div>
    );
  }

  return (
    <div>
      <div className="chatBotContainer">
        <div>
          <div id="chat_container" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div
                ref={index === messages.length - 1 ? chatContainerRef : null}
                className={`wrapper ${
                  message.role === "assistant" ? "ai" : ""
                }`}
                key={message.id}
              >
                <div className="chat">
                  <div className="profile">
                    <img
                      src={
                        message.role === "assistant"
                          ? "/RITHLogo.svg"
                          : "/user.svg"
                      }
                      alt={message.role === "assistant" ? "bot" : "user"}
                    ></img>
                  </div>
                  {console.log(message.content)}
                  <div className="message">{message.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chatArea">
        {ticker ? (
          <div style={{ color: "black" }} className="buttonContainer">
            <button onClick={() => handleAdvancedPrompt("type1")}>
              {ticker} Backstory {" |* "}
            </button>
            <button onClick={() => handleAdvancedPrompt("type2")}>
              Risk Category{" |* "}
            </button>
            <button onClick={() => handleAdvancedPrompt("type3")}>
              Buy, Hold, Or Sell?
            </button>
            <button onClick={() => handleAdvancedPrompt("default")}>
              Thorough Analysis on {ticker}
            </button>
          </div>
        ) : (
          ""
        )}
        <form onSubmit={handleSubmit}>
          <textarea
            name="prompt"
            rows="1"
            cols="1"
            placeholder="Ask Robin"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          ></textarea>
          <button type="submit">
            <img src="/send.svg" />
          </button>
        </form>
        <img
          onClick={() => setShowChat(false)}
          src="/aiChatRB.png"
          alt="your AI chat assistant "
          className="w-20 h-20"
        ></img>
      </div>
    </div>
  );
};

export default Chatbot;
