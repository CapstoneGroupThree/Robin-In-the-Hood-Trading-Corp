import React from "react";
export default function SignUp() {
  return (
    <>
      <div className="form-floating mb-2">
        <input
          type="text"
          className="form-control shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="floatingFirstName"
          name="firstName"
          placeholder="John"
        />
        <label
          htmlFor="floatingFirstName"
          className="block text-red-600 font-semibold"
        >
          First Name
        </label>
      </div>
      <div className="form-floating mb-2">
        <input
          type="text"
          //Changed className from form-control to same input className from Login-Page
          className="form-control shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="floatingLastName"
          name="lastName"
          placeholder="Doe"
        />
        <label
          htmlFor="floatingLastName"
          className="block text-red-600 font-semibold"
        >
          Last Name
        </label>
      </div>
      <div className="form-floating mb-2">
        <input
          type="email"
          className="form-control shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="floatingEmail"
          name="email"
          placeholder="name@example.com"
        />
        <label
          htmlFor="floatingEmail"
          className="block text-red-600 font-semibold"
        >
          Email address
        </label>
      </div>
      <div className="form-floating mb-2">
        <input
          type="password"
          className="form-control shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="floatingPassword"
          name="password"
          placeholder="Password"
        />
        <label
          htmlFor="floatingPassword"
          className="block text-red-600 font-semibold"
        >
          Password
        </label>
      </div>
    </>
  );
}
