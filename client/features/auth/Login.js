import React from 'react';
export default function Login() {
  return (
    <>
      <div className="form-floating mb-2">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          name="email"
          placeholder="name@example.com"
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>
      <div className="form-floating mb-2">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          name="password"
          placeholder="Password"
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <div className="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me" /> Remember me
        </label>
      </div>
    </>
  );
}
