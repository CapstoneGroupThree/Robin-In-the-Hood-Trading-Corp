import React from "react";

import Navbar from "../features/navbar/Navbar";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <div className="h-screen max-w-full w-full overflow-hidden flex">
      <nav className="w-1/5 bg-gray-800 h-screen p-4">
        <Navbar />
      </nav>
      <main className="w-full p-4">
        <AppRoutes />
      </main>
      {/* <h1>Yolo</h1> */}
    </div>
  );
};

export default App;
