import React from "react";
import { useSelector } from "react-redux";

import Navbar from "../features/navbar/Navbar";
import AppRoutes from "./AppRoutes";

const App = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  return (
    <div>
      {isLoggedIn ? (
        <div className="h-screen w-screen overflow-hidden flex">
          <nav className="w-1/6  h-screen p-4 NAV-bg ">
            <Navbar />
          </nav>
          <main className="w-5/6">
            <AppRoutes />
          </main>
          {/* <h1>Yolo</h1> */}
        </div>
      ) : (
        <main className="">
          <AppRoutes />
        </main>
      )}
    </div>
  );
};

export default App;
