import React from "react";

import Navbar from "../features/navbar/Navbar";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex">
      <nav className="w-1/6  h-screen p-4 NAV-bg ">
        <Navbar />
      </nav>
      <main className="w-5/6">
        <AppRoutes />
      </main>
      {/* <h1>Yolo</h1> */}
    </div>
  );
};

export default App;
