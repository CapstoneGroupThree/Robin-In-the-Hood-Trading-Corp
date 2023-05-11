import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editUserProfileInfo, editUserPassword } from "../auth/authSlice";

const EditUserInfo = () => {
  const me = useSelector((state) => state.auth.me);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState(me.email);
  const [firstName, setFirstName] = useState(me.first_name);
  const [lastName, setLastName] = useState(me.last_name);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const { error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleEditModeToggle = (e) => {
    e.preventDefault();
    setEditPasswordMode(false);
    setEditMode(true);
  };
  console.log(me);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    //todo async thunks here

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      alert("Please input a valid email.");
    }

    if (firstName && lastName && email) {
      dispatch(
        editUserProfileInfo({
          id: me.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
        })
      );
      setEditMode(false);
    } else {
      alert("Please input valid name and email");
      return;
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    //todo async thunks here
    if (newPassword !== confirmPassword) {
      alert("Please make sure passwords are matching.");
      return;
    }

    if (
      newPassword === confirmPassword &&
      newPassword.length > 1 &&
      oldPassword
    ) {
      const actionResult = await dispatch(
        editUserPassword({
          id: me.id,
          oldPassword: oldPassword,
          newPassword: newPassword,
        })
      );

      if (editUserPassword.rejected.match(actionResult)) {
        alert('"Please input the correct previous password."');
        setOldPassword("");
        return;
      } else {
        alert("Password Changed");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setEditMode(false);
        setEditPasswordMode(false);
      }
    }
  };

  const handleEditPasswordToggle = (e) => {
    e.preventDefault();
    setEditPasswordMode(!editPasswordMode);
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
      <form onSubmit={handleProfileSubmit}>
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
            setFirstName(e.target.value);
          }}
        />
        <label htmlFor="email">Last Name:</label>
        <input
          name="lastName"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />

        <button type="submit">Submit</button>
      </form>
      <div>
        <button onClick={handleEditPasswordToggle}>Change Password</button>
      </div>
      {editPasswordMode ? (
        <div>
          <form onSubmit={handlePasswordSubmit}>
            <label htmlFor="oldPassWord">Previous Password:</label>
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
            />
            <label htmlFor="newPassWord">New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <button>Submit Password Change</button>
          </form>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default EditUserInfo;
