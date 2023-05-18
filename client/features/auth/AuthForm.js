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
        <p className="text-secondary">
          Don't have an account? {<Link to="/signup">Sign Up</Link>}?
        </p>
      );
    } else {
      return (
        <p className="text-secondary">
          Already have an account? {<Link to="/login">Log In</Link>}?
        </p>
      );
    }
  };

  return (
    //Changed bg-gray-700 on div and form to bg-transparent - removed justify start
    <div className="login-page min-h-screen w-screen bg-transparent flex items-center justify-center">
      {error && <div className="alert alert-danger">{error}</div>}
      <form
        /* took out shadow-md from className */
        className="text-center flex flex-col bg-transparent w-96 h-96 p-10 rounded "
        onSubmit={handleSubmit}
        name={name}
      >
        {name === "login" ? <Login /> : <SignUp />}
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          {displayName}
        </button>
        {handleNoAccount()}
      </form>
    </div>
  );
};

export default AuthForm;
