import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const EditUserInfo = () => {
  const me = useSelector((state) => state.auth.me);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState(me.email);
  const [firstName, setFirstName] = useState(me.first_name);
  const [lastName, setlastName] = useState(me.last_name);
  const [password, setPassword] = useState("********");
  const [editPasswordMode, setEditPasswordMode] = useState(false);

  const handleEditModeToggle = (e) => {
    e.preventDefault();
    setEditPasswordMode(false);
    setEditMode(true);
  };
  console.log(me);

  const handleSubmit = (e) => {
    e.preventDefault();
    //todo async thunks here
  };

  const handleEditPasswordToggle = (e) => {
    e.preventDefault();
    setEditPasswordMode(true);
    //todo async thunks here
  };

  if (!editMode) {
    return (
      <div>
        <div>User Info</div>
        <div>Email Address: {me.email}</div>
        <div>First Name: {me.first_name}</div>
        <div>Last Name: {me.last_name}</div>
        <div>Password: ********</div>
        <button onClick={handleEditModeToggle}>Edit Profile Information</button>
      </div>
    );
  }

  return (
    <div>
      <div>Edit User Info</div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address:</label>
        <input
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label htmlFor="email">First Name:</label>
        <input
          name="firstName"
          value={firstName}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label htmlFor="email">Last Name:</label>
        <input
          name="lastName"
          value={lastName}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <button type="submit">Submit</button>
      </form>
      <div>
        <button onClick={handleEditPasswordToggle}>
          {" "}
          Enter Current Password to Change Password{" "}
        </button>
      </div>
      {editPasswordMode ? (
        <div>
          {/* <label htmlFor="newPassWord">Password:</label>
        <input
          name="newPassword"
          value={}
          onChange={(e) => {
            setEmail(e.target.value);
          }}/>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          name="confirmPassword"
          value={}
          onChange={(e) => {
            setEmail(e.target.value);
          }}/> */}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default EditUserInfo;
