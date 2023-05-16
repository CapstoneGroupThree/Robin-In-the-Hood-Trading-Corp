import React from "react";

import Navbar from "../features/navbar/Navbar";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <div className="h-screen max-w-full w-screen overflow-hidden flex">
      <nav className="w-1/5  h-screen p-4 bg-gradient-to-bl from-slate-950 to-gray-800">
        <Navbar />
      </nav>
      <main className="w-screen">
        <AppRoutes />
      </main>
      {/* <h1>Yolo</h1> */}
    </div>
  );
};

export default App;
