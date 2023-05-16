import React, { useState } from "react";
import "./popup.css";

const Sell = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const { ticker, name } = props;

  return (
    <div>
      <button
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-3"
        onClick={() => setShowPopup(true)}
      >
        Sell
      </button>
      <div>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Sell {ticker}</h2>
              <div>Current Price:</div>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sell;
