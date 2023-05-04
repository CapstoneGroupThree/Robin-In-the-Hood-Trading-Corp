import React from 'react';
export default function SignUp() {
  return (
    <>
      <div className="form-floating mb-2">
        <input
          type="text"
          className="form-control"
          id="floatingFirstName"
          name="firstName"
          placeholder="John"
        />
        <label htmlFor="floatingFirstName">First Name</label>
      </div>
      <div className="form-floating mb-2">
        <input
          type="text"
          className="form-control"
          id="floatingLastName"
          name="lastName"
          placeholder="Doe"
        />
        <label htmlFor="floatingLastName">Last Name</label>
      </div>
      <div className="form-floating mb-2">
        <input
          type="email"
          className="form-control"
          id="floatingEmail"
          name="email"
          placeholder="name@example.com"
        />
        <label htmlFor="floatingEmail">Email address</label>
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
    </>
  );
}
