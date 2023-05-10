import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../app/store";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutAndRedirectHome = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex flex-col max-h-screen items-center space-y-4 text-white font-semibold">
      <div className="flex items-center border-b w-full border-purple-500 pb-4">
        <img src="/RITHLogo.png" alt="logo" className="w-10 h-10"></img>

        <h1 className="ml-4">Robin In the Hood {"(RITH)"}</h1>
      </div>
      <nav>
        {isLoggedIn ? (
          <div className="flex flex-col items-center ">
            {/* The navbar will show these links after you log in */}
            <Link to="/home" className="hover:text-blue-500 block">
              Home
            </Link>
            <Link to="/allStocks" className="hover:text-blue-500 block">
              All Stocks
            </Link>
            <button
              type="button"
              className="hover:text-blue-500 "
              onClick={logoutAndRedirectHome}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center ">
            {/* The navbar will show these links before you log in */}
            <Link to="/login" className="hover:text-blue-500 block">
              Login
            </Link>
            <Link to="/signup" className="hover:text-blue-500 block">
              Sign Up
            </Link>
          </div>
        )}
      </nav>
      <hr className="w-full mt-4 border-purple-500" />
    </div>
  );
};

export default Navbar;
