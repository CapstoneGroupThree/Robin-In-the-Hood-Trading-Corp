import React from "react";

import Navbar from "../features/navbar/Navbar";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex">
      <nav className="w-1/5  h-screen p-4 bg-gradient-to-bl from-slate-950 to-gray-800">
        <Navbar />
      </nav>
      <main className="w-4/5">
        <AppRoutes />
      </main>
      {/* <h1>Yolo</h1> */}
    </div>
  );
};

export default App;
