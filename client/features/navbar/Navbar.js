import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../app/store";
import AuthForm from "../auth/AuthForm";
import { resetPortfolio } from "../portfolio/portfolioSlice";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutAndRedirectHome = () => {
    dispatch(logout());
    dispatch(resetPortfolio());
    navigate("/login");
  };

  const isActiveLink = (pathname) => {
    return location.pathname === pathname;
  };

  return (
    <div className="flex justify-center flex-col max-h-screen items-center w-full font-body text-white font-normal ">
      <div className="ml-[-15px] flex items-center justify-center border-b-4 w-full border-sky-500 border-opacity-20 pb-4">
        <img src="/RITHLogo.png" alt="logo" className="w-10 h-10 mr-3"></img>
        <h1
          style={{
            fontFamily: "Futura, 'Trebuchet MS', Arial, sans-serif",
            fontSize: "21px",
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: 400,
            lineHeight: "30px",
            textAlign: "center",
          }}
        >
          Robin In the Hood
        </h1>
      </div>
      {/* <h1
          style={{
            fontFamily:
              'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif',
            fontSize: "21px",
            fontStyle: "bold",
            fontVariant: "normal",
            fontWeight: 400,
            lineHeight: "30px",
          }}
        >
          Robin In the Hood
        </h1>
        <h1
          style={{
            fontFamily:
              'Baskerville, "Baskerville Old Face", "Hoefler Text", Garamond, "Times New Roman", serif',
            fontSize: "21px",
            fontStyle: "bold",
            fontVariant: "normal",
            fontWeight: 400,
            lineHeight: "30px",
          }}
        >
          Robin In the Hood
        </h1> */}

      <nav className="w-full text-xl text-shadow-lg ">
        {isLoggedIn ? (
          <div className="flex flex-col items-center">
            {/* The navbar will show these links after you log in */}
            <div className="flex flex-col items-start">
              <Link
                to="/home"
                className={`hover:text-blue-500 flex items-center mb-3 ${
                  isActiveLink("/home") ? "active-link edit-button" : ""
                }`}
              >
                <i className="fa-solid fa-house-user mr-3"></i>
                <span className="font-head text-xl">Home</span>
              </Link>
              <Link
                to="/allStocks"
                className={`hover:text-blue-500 flex items-center mb-3 ${
                  isActiveLink("/allStocks") ? "active-link edit-button" : ""
                }`}
              >
                <i className="fa-solid fa-money-bill-1-wave mr-3"></i>
                <span className="font-head text-xl">All Stocks</span>
              </Link>
              <Link
                to="/portfolio"
                className={`hover:text-blue-500 flex items-center mb-3 ${
                  isActiveLink("/portfolio") ? "active-link edit-button" : ""
                }`}
              >
                <i className="fa-solid fa-rocket mr-3"></i>
                <span className="font-head text-xl">Portfolio</span>
              </Link>
              <Link
                to="/user/edit"
                className={`hover:text-blue-500 flex items-center mb-3 ${
                  isActiveLink("/user/edit") ? "active-link edit-button" : ""
                }`}
              >
                <i className="fa-solid fa-user-pen mr-3"></i>
                <span className="font-head text-xl">Edit User Profile</span>
              </Link>
            </div>

            <hr className="w-56 fixed bottom-8 border-t-4 border-sky-500 border-opacity-20 pb-4" />
            <div className="fixed bottom-0 pb-4">
              <button
                type="button"
                className="hover:text-blue-500 active:bg-gray-500 active:text-white"
                onClick={logoutAndRedirectHome}
              >
                <i className="fa-solid fa-right-from-bracket mr-3"></i>
                {"Logout"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center ">
            <Link to="/login" className="hover:text-blue-500 block">
              Login
            </Link>
            <Link to="/signup" className="hover:text-blue-500 block">
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
