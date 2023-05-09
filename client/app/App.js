import React from "react";

import Navbar from "../features/navbar/Navbar";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <div className="h-screen flex">
      <nav className="w-2/12 bg-gray-800 p-4">
        <Navbar />
      </nav>
      <main className="w-4/5 p-4">
        <AppRoutes />
      </main>
      {/* <h1>Yolo</h1> */}
    </div>
  );
};

export default App;
