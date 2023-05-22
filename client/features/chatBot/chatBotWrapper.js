import React, { useState, useEffect } from "react";
import Chatbot from "./index";

const ChatbotWrapper = ({ location, ticker }) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Update the key whenever the location changes
    setKey((prevKey) => prevKey + 1);
  }, [location]);

  return <Chatbot key={key} ticker={ticker} />;
};

export default ChatbotWrapper;
