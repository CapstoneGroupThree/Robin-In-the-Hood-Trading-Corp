import React from "react";
export default function Login() {
  return (
    <>
      <div className="form-floating mb-2">
        <input
          type="email"
          className="form-control shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="floatingInput"
          name="email"
          placeholder="name@example.com"
        />
        <label
          htmlFor="floatingInput"
          className="block text-gray-700 text-sm font-bold mb-2"
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
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password
        </label>
      </div>
      <div className="checkbox mb-3">
        <label className="inline-flex items-center mt-3">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-purple-600"
            value="remember-me"
          />
          <span className="ml-2 text-gray-700">Remember me</span>
        </label>
      </div>
    </>
  );
}
