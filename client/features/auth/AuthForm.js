/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { authenticate, setErrorMessage } from "../../app/store";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";

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
          Don't have an {<Link to="/signup">account</Link>}?
        </p>
      );
    } else {
      return (
        <p className="text-secondary">
          Already have an {<Link to="/login">account</Link>}?
        </p>
      );
    }
  };

  return (
    <div className="card mt-5 mb-5 m-auto p-4" style={{ width: "25rem" }}>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="text-center" onSubmit={handleSubmit} name={name}>
        <img className="mb-4" src="/images/Maverick.svg" alt="" width="72" />
        {name === "login" ? <Login /> : <SignUp />}

        <button className="w-100 btn btn-lg btn-primary mb-3" type="submit">
          {displayName}
        </button>
        {handleNoAccount()}
      </form>
    </div>
  );
};

export default AuthForm;
