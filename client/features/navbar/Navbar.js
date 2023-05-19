import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../app/store";
import AuthForm from "../auth/AuthForm";
import { resetPortfolio } from "../portfolio/portfolioSlice";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutAndRedirectHome = () => {
    dispatch(logout());
    dispatch(resetPortfolio());
    navigate("/login");
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
          <div className="flex flex-col items-center place-content-evenly ">
            {/* The navbar will show these links after you log in */}
            <Link
              to="/home"
              className="hover:text-blue-500 block font-head text-xl"
            >
              <i className="fa-solid fa-house-user"></i> {" Home"}
            </Link>
            <Link
              to="/allStocks"
              className="hover:text-blue-500 block font-head text-xl"
            >
              <i className="fa-solid fa-money-bill-1-wave"></i> {" All Stocks"}
            </Link>
            <Link
              to={"/portfolio"}
              className="hover:text-blue-500 block font-head text-xl"
            >
              <i className="fa-solid fa-rocket"></i>
              {" Portfolio"}
            </Link>
            <Link
              to="/user/edit"
              className="hover:text-blue-500 block font-head text-xl"
            >
              <i className="fa-solid fa-user-pen"></i>
              {" Edit User Profile"}
            </Link>

            <hr className=" w-56 fixed bottom-8  border-t-4 border-sky-500 border-opacity-20 pb-4 " />
            <div className="fixed bottom-0 pb-4">
              <button
                type="button"
                className="hover:text-blue-500  active:bg-gray-500 active:text-white "
                onClick={logoutAndRedirectHome}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                {" Logout"}
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
