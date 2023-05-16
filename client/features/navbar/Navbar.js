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
    <div className="flex flex-col max-h-screen items-center  text-white font-semibold">
      <div className="flex items-center border-b w-full border-purple-500 pb-4">
        <img src="/RITHLogo.png" alt="logo" className="w-10 h-10"></img>

        <h1 className="ml-4">Robin In the Hood {"(RITH)"}</h1>
      </div>
      <nav className="w-full">
        {isLoggedIn ? (
          <div className="flex flex-col items-center place-content-evenly ">
            {/* The navbar will show these links after you log in */}
            <Link
              to="/home"
              className="hover:text-blue-500 block active:bg-gray-500 active:text-white"
            >
              Home
            </Link>
            <Link
              to="/allStocks"
              className="hover:text-blue-500 block  active:bg-gray-500 active:text-white"
            >
              All Stocks
            </Link>
            <Link
              to={"/portfolio"}
              className="hover:text-blue-500 block  active:bg-gray-500 active:text-white"
            >
              Portfolio
            </Link>
            <Link
              to="/user/edit"
              className="hover:text-blue-500 block  active:bg-gray-500 active:text-white"
            >
              {" "}
              Edit User Profile
            </Link>

            <hr className=" w-56 fixed bottom-8 border-purple-500 pb-4 " />
            <div className="fixed bottom-0 pb-4">
              <button
                type="button"
                className="hover:text-blue-500  active:bg-gray-500 active:text-white "
                onClick={logoutAndRedirectHome}
              >
                Logout
              </button>
            </div>
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
    </div>
  );
};

export default Navbar;
