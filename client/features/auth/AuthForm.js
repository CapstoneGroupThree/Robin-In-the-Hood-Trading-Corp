/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { authenticate, setErrorMessage } from "../../app/store";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import "./authStyle.css";

const AuthForm = ({ name, displayName }) => {
  const { error, setError } = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (name === "signup") {
      const formName = evt.target.name;
      const email = evt.target.email.value;
      const password = evt.target.password.value;
      const first_name = evt.target.firstName.value;
      const last_name = evt.target.lastName.value;
      dispatch(
        authenticate({
          email,
          password,
          method: formName,
          first_name,
          last_name,
        })
      );
      navigate("/", { replace: true });
    } else if (name === "login") {
      try {
        const formName = evt.target.name;
        const email = evt.target.email.value;
        const password = evt.target.password.value;
        const result = await dispatch(
          authenticate({ email, password, method: formName })
        );

        if (result.type === "auth/authenticate/fulfilled") {
          navigate("/", { replace: true });
        } else {
          setError("Wrong email or password.");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleNoAccount = () => {
    if (name === "login") {
      return (
        <p className="text-secondary tracking-widest text-white font-semibold">
          Don't have an account?{" "}
          {
            <Link className="italic text-red-600 tracking-widest" to="/signup">
              Sign Up
            </Link>
          }
        </p>
      );
    } else {
      return (
        <p className="text-secondary tracking-widest text-white font-semibold">
          Already have an account?{" "}
          {
            <Link className="italic text-red-600 tracking-widest" to="/login">
              Log In
            </Link>
          }
        </p>
      );
    }
  };

  return (
    <div className="flex flex-row auth-container min-h-screen w-screen">
      <div className="flex flex-col justify-center items-center bg-transparent backdrop-filter backdrop-blur">
        <img src="/RITHLogo.png" alt="logo" className="w-10 h-10"></img>

        {/* <h1 className="ml-4 font-body text-xl text-shadow-lg" style={}> */}
        <h1
          style={{
            color: "white",
            fontFamily: "Futura, 'Trebuchet MS', Arial, sans-serif",
            fontSize: "21px",
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: 400,
            lineHeight: "30px",
          }}
        >
          Robin In the Hood
        </h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form
          /* took out shadow-md from className */
          className="flex flex-col justify-center text-center bg-transparent backdrop-filter backdrop-blur text-lg rounded"
          onSubmit={handleSubmit}
          name={name}
        >
          {name === "login" ? <Login /> : <SignUp />}
          <button
            type="submit"
            className="bg-slate-500 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded mt-2"
          >
            {displayName}
          </button>
          {handleNoAccount()}
        </form>
      </div>
      <div className="flex flex-col items-center justify-end flex-grow">
        <h1 className="flex items-center block tracking-widest mb-4 text-white text-xl font-semibold bg-transparent backdrop-filter backdrop-blur">
          Created By Future Employees of Google, Amazon, META and more!:
        </h1>
        <ul className="flex flex-row items-center gap-4 bg-transparent backdrop-filter backdrop-blur text-xl pt-5">
          <li>
            <Link
              className="block hover:text-slate-400 tracking-widest text-white font-semibold pb-5"
              to={"https://www.linkedin.com/in/charlie-aloisio/"}
            >
              Charlie Aloisio
            </Link>
          </li>
          <li>
            <Link
              className="block hover:text-slate-400 tracking-widest text-white font-semibold pb-5"
              to={"https://www.linkedin.com/in/hlin/"}
            >
              Han Yu Lin
            </Link>
          </li>
          <li>
            <Link
              className="block hover:text-slate-400 tracking-widest text-white font-semibold pb-5"
              to={"https://www.linkedin.com/in/tenzingsalaka/"}
            >
              Tenzing Salaka
            </Link>
          </li>
          <li>
            <Link
              className="block hover:text-slate-400 tracking-widest text-white font-semibold pb-5"
              to={"https://www.linkedin.com/in/jaimelopez40/"}
            >
              Jaime Lopez
            </Link>
          </li>
          <li>
            <Link
              className="block hover:text-slate-400 tracking-widest text-white font-semibold pb-5"
              to={"https://www.linkedin.com/in/adhemarhernandez/"}
            >
              Adhemar Hernandez
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AuthForm;
