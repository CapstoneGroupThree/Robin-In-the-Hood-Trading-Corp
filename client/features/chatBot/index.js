import React, { useState, useEffect, useRef } from "react";
import bot from "/assets/bot.svg";
import user from "/assets/user.svg";
import "./chatBot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef();

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const oldMessages = [...messages];
    const userMessage = { isAi: false, value: newMessage };
    const aiMessage = { isAi: true, value: " ", id: generateUniqueId() };
    setMessages([...oldMessages, userMessage, aiMessage]);
    setNewMessage("");

    try {
      const response = await fetch(
        "https://fun-chatgpt-clone-with-a-twist.onrender.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: newMessage,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        const updatedMessages = messages.map((message) =>
          message.id === aiMessage.id
            ? { ...message, value: parsedData }
            : message
        );
        setMessages(updatedMessages);
      } else {
        throw new Error(await response.text());
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div id="app">
      <div id="chat_container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div className={`wrapper ${message.isAi ? "ai" : ""}`} key={index}>
            <div className="chat">
              <div className="profile">
                <img
                  src={message.isAi ? bot : user}
                  alt={message.isAi ? "bot" : "user"}
                ></img>
              </div>
              <div className="message">{message.value}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          rows="1"
          cols="1"
          placeholder="Ask AI Chatbot"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>
        <button type="submit">
          <img src="/assets/send.svg" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
