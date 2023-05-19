import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import AuthForm from "../features/auth/AuthForm";
import Home from "../features/home/Home";
import AllStocksView from "../features/allStocks/allStocksView";
import SingleStockView from "../features/singleStock/singleStockView";
import { me } from "./store";
import EditUserInfo from "../features/editUserInfo";
import Chatbot from "../features/chatBot";
import Portfolio from "../features/portfolio/portfolioView";
import AnimationComponent from "../images/animeTest";

/**
 * COMPONENT
 */

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(me());
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route to="/home" element={<Home />} />
          <Route path="/allStocks" element={<AllStocksView />} />
          <Route path="/singleStock/:ticker" element={<SingleStockView />} />
          <Route path="/user/edit" element={<EditUserInfo />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/animeTest" element={<AnimationComponent />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/*"
            element={<AuthForm name="login" displayName="Login" />}
          />
          <Route
            path="/login"
            element={<AuthForm name="login" displayName="Login" />}
          />
          <Route
            path="/signup"
            element={<AuthForm name="signup" displayName="Sign Up" />}
          />
        </Routes>
      )}
    </div>
  );
};

export default AppRoutes;
