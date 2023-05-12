import React, { useState, useEffect, useRef } from "react";

import "./chatBot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const chatContainerRef = useRef();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const oldMessages = [...messages];
  //   const userMessage = { isAi: false, value: newMessage };
  //   const aiMessage = { isAi: true, value: " ", id: generateUniqueId() };
  //   setMessages([...oldMessages, userMessage, aiMessage]);
  //   setNewMessage("");

  //   try {
  //     const response = await fetch("http://localhost:8080/openAi/chat", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         prompt: newMessage,
  //       }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       const parsedData = data.bot.trim();
  //       setMessages((currentMessages) => {
  //         const updatedMessages = currentMessages.map((message) =>
  //           message.id === aiMessage.id
  //             ? { ...message, value: parsedData }
  //             : message
  //         );
  //         return updatedMessages;
  //       });
  //     } else {
  //       throw new Error(await response.text());
  //     }
  //   } catch (err) {
  //     alert(err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const oldMessages = [...messages];
    const userMessage = { isAi: false, value: newMessage };
    const aiMessage = {
      isAi: true,
      value: "AI thinking.",
      id: generateUniqueId(),
    };
    setMessages([...oldMessages, userMessage, aiMessage]);
    setNewMessage("");

    // Loading dots simulation
    const loadingDots = setInterval(() => {
      setMessages((currentMessages) => {
        return currentMessages.map((message) => {
          if (message.id === aiMessage.id) {
            if (message.value.endsWith("...")) {
              return { ...message, value: "AI thinking." };
            } else if (message.value.endsWith("..")) {
              return { ...message, value: "AI thinking..." };
            } else if (message.value.endsWith(".")) {
              return { ...message, value: "AI thinking.." };
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
          prompt: newMessage,
        }),
      });

      clearInterval(loadingDots);

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        setMessages((currentMessages) => {
          const updatedMessages = currentMessages.map((message) =>
            message.id === aiMessage.id ? { ...message, value: "" } : message
          );
          return updatedMessages;
        });

        // Slowly type out the AI's response
        let index = -1;
        const interval = setInterval(() => {
          if (index < parsedData.length) {
            setMessages((currentMessages) => {
              const updatedMessages = currentMessages.map((message) =>
                message.id === aiMessage.id
                  ? {
                      ...message,
                      value:
                        index === 0
                          ? parsedData.charAt(index)
                          : message.value + parsedData.charAt(index),
                    }
                  : message
              );
              return updatedMessages;
            });
            index++;
          } else {
            clearInterval(interval);
          }
        }, 20);
      } else {
        throw new Error(await response.text());
      }
    } catch (err) {
      alert(err);
    }
  };

  // Reset the AI message value to an empty string

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
    <div className="chatBotContainer">
      <div>
        <div id="chat_container" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div className={`wrapper ${message.isAi ? "ai" : ""}`} key={index}>
              <div className="chat">
                <div className="profile">
                  <img
                    src={message.isAi ? "/bot.svg" : "/user.svg"}
                    alt={message.isAi ? "bot" : "user"}
                  ></img>
                </div>
                <div className="message">{message.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="chatArea">
          <form onSubmit={handleSubmit}>
            <textarea
              name="prompt"
              rows="1"
              cols="1"
              placeholder="Ask AI Chatbot"
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
    </div>
  );
};

export default Chatbot;
