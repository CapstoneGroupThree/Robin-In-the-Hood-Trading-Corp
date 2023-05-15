import React from "react";

import Navbar from "../features/navbar/Navbar";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <div className="h-screen max-w-full w-full overflow-hidden flex">
      <nav className="w-2/5  h-screen p-4 bg-gradient-to-bl from-slate-950 to-gray-800">
        <Navbar />
      </nav>
      <main className="w-full ">
        <AppRoutes />
      </main>
      {/* <h1>Yolo</h1> */}
    </div>
  );
};

export default App;
