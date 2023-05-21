import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime/runtime";

import "./chatBot.css";

const Chatbot = ({ ticker }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const chatContainerRef = useRef();
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [editedTranscript, setEditedTranscript] = useState("");
  // const [transcriptMessage, setTranscriptMessage] = useState("");
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false);
  const [micPermissionAllowed, setMicPermissionAllowed] = useState(true);

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pitch, setPitch] = useState(1);

  const handleVoiceChange = (event) => {
    const voiceName = event.target.value;
    const selectedVoice = speechSynthesis
      .getVoices()
      .find((voice) => voice.name === voiceName);
    setSelectedVoice(selectedVoice);
  };

  const handlePitchChange = (event) => {
    const pitch = parseFloat(event.target.value);
    setPitch(pitch);
  };

  const speakText = (text) => {
    if (selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.pitch = pitch;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setSelectedVoice(voices[0]); // Set the default voice
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const { state } = await navigator.permissions.query({
          name: "microphone",
        });
        setMicPermissionAllowed(state === "granted");
      } catch (error) {
        console.error("Error checking microphone permission:", error);
        setMicPermissionAllowed(false);
      }
    };

    checkMicPermission();
  }, []);

  const startListening = () => {
    resetTranscript();
    setEditedTranscript("");
    setVoiceRecognitionActive(true);
    if (micPermissionAllowed) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      // Show a message to the user that microphone permission is required
      alert("Microphone permission is required to use voice recognition.");
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setVoiceRecognitionActive(false);
    setNewMessage(transcript);
    resetTranscript();
  };

  useEffect(() => {
    // Update the edited transcript when the transcript changes
    if (listening) {
      setEditedTranscript(transcript);
    }
  }, [listening, transcript]);

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

    const messageContent = voiceRecognitionActive
      ? editedTranscript
      : newMessage;

    const userMessage = {
      id: generateUniqueId(),
      role: "user",
      content: messageContent,
    };
    const aiMessage = {
      id: generateUniqueId(),
      role: "assistant",
      content: "Robin is thinking...",
    };

    setMessages((oldMessages) => [...oldMessages, userMessage, aiMessage]);
    setNewMessage("");
    setEditedTranscript("");
    resetTranscript();

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
        speakText(parsedData);
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
              // //todo added speak text optimize it
              // speakText(parsedData[index]);
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
      speakText(parsedData);
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
            // //todo added speak text optimize it
            // speakText(parsedData[index]);
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
      <div
        className={`chatBotContainer`}
        style={ticker ? { bottom: "168px" } : { botton: "79px" }}
      >
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
        <div className="buttonContainer">
          {/* Voice selection */}
          <select
            value={selectedVoice ? selectedVoice.name : ""}
            onChange={handleVoiceChange}
          >
            {speechSynthesis.getVoices().map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name}
              </option>
            ))}
          </select>

          {/* Pitch adjustment */}
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={handlePitchChange}
          />
          {ticker ? (
            <div style={{ color: "black" }}>
              <button onClick={() => handleAdvancedPrompt("type1")}>
                {ticker} Backstory
              </button>
              <button onClick={() => handleAdvancedPrompt("type2")}>
                {ticker} Risk Category Analysis
              </button>
              <button onClick={() => handleAdvancedPrompt("type3")}>
                Buy, Hold, Or Sell?
              </button>
              <button onClick={() => handleAdvancedPrompt("default")}>
                Deep Analysis on {ticker}
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <button type="submit">
            <img src="/send.svg" />
          </button>
          {/* <div>{listening ? "Talking" : "Muted"}</div> */}
          <textarea
            name="prompt"
            rows="1"
            cols="1"
            placeholder="Ask Robin"
            value={voiceRecognitionActive ? editedTranscript : newMessage}
            onChange={(e) => {
              if (voiceRecognitionActive) {
                setEditedTranscript(e.target.value);
              } else {
                setNewMessage(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          ></textarea>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (micPermissionAllowed) {
                setVoiceRecognitionActive(!voiceRecognitionActive);
                if (!voiceRecognitionActive) {
                  startListening();
                } else {
                  stopListening();
                }
              } else {
                // Display a message to the user about microphone permission not allowed
                alert(
                  "Please turn on microphone permissions so Robin can better assist you :)"
                );
                return;
              }
            }}
          >
            {voiceRecognitionActive ? (
              <>
                <i
                  className="fa-solid fa-microphone"
                  style={{ color: "green" }}
                ></i>
              </>
            ) : (
              <>
                <i
                  className="fa-solid fa-microphone-slash"
                  style={{ color: "red" }}
                ></i>
              </>
            )}
          </button>
          <img
            onClick={() => setShowChat(false)}
            src="/aiChatRB.png"
            alt="your AI chat assistant "
            className="w-20 h-20"
          ></img>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
