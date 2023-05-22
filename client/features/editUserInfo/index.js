import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editUserProfileInfo, editUserPassword } from "../auth/authSlice";
import Chatbot from "../chatBot";

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
      <div className=" bg flex justify-center items-center h-screen">
        <div className=" card  max-w-sm mx-auto bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 rounded-xl box-shadow flex items-center space-x-4">
          <div className="  text-center text-white  w-full gap-4">
            <div className="mb-6 text-4xl font-body font-thin text-sky-500 text-shadow-lg">
              User Info
            </div>
            <div className="mb-4 flex justify-between text-shadow-lg">
              <span className="text-xl font-body"> Email Address:</span>
              <span className="text-xl font-body"> {me.email}</span>
            </div>
            <div className="mb-4 flex justify-between text-shadow-lg">
              <span className="text-xl font-body">First Name:</span>
              <span className="text-xl font-body">{me.first_name}</span>
            </div>
            <div className="mb-4 flex justify-between text-shadow-lg">
              <span className="text-xl font-body">Last Name:</span>
              <span className="text-xl font-body">{me.last_name}</span>
            </div>
            <div className="mb-4 flex justify-between text-shadow-lg">
              <span className="text-xl font-body">Password:</span>
              <span className="text-xl font-body">********</span>
            </div>
            <button
              className=" edit-button mb-4 text-white py-2 px-4 rounded"
              onClick={handleEditModeToggle}
            >
              <span className=" font-head">Edit Profile Information</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="  bg flex justify-center items-center min-h-screen ">
      <div className=" card p-6 max-w-md w-full flex-wrap mx-auto bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 rounded-xl box-shadow flex justify-around items-center space-x-4 ">
        <div className="  text-center flex-row h-full font-body items-thin ">
          <div className="text-4xl font-body font-thin  text-sky-500">
            Edit User Info
          </div>
          <form
            className="space-y-4 text-gray-600 w-full p-4 flex-col bg-inherit"
            onSubmit={handleProfileSubmit}
          >
            <label
              className="block text-md font-bold text-white"
              htmlFor="email"
            >
              Email Address:
            </label>
            <input
              className=" input-field block w-full font-black px-4 py-2 rounded-md border-2 border-gray-300"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label
              className="block text-md font-bold text-white"
              htmlFor="firstName"
            >
              First Name:
            </label>
            <input
              className=" input-field block w-full px-4 py-2 rounded-md border-2 border-gray-300"
              name="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <label
              className="block text-md font-bold text-white"
              htmlFor="lastName"
            >
              Last Name:
            </label>
            <input
              className="input-field block w-full px-4 py-2 rounded-md border-2 border-gray-300"
              name="lastName"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <button
              className=" edit-button mt-4  text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
          </form>
          <div className="mt-4">
            <button
              className="edit-button  text-white font-bold py-2 px-4 rounded"
              onClick={handleEditPasswordToggle}
            >
              Change Password
            </button>
          </div>
          {editPasswordMode ? (
            <div className=" ">
              <form
                className="space-y-4 text-gray-600 flex-col w-full bg-inherit"
                onSubmit={handlePasswordSubmit}
              >
                <label
                  className="block text-md font-bold"
                  htmlFor="oldPassWord"
                >
                  Previous Password:
                </label>
                <input
                  className="block w-full px-4 py-2 rounded-md border-2 border-gray-300"
                  type="password"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                />
                <label
                  className="block text-md font-bold"
                  htmlFor="newPassWord"
                >
                  New Password:
                </label>
                <input
                  className="block w-full px-4 py-2 rounded-md border-2 border-gray-300"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                <label
                  className="block text-md font-bold"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password:
                </label>
                <input
                  className="block w-full px-4 py-2 rounded-md border-2 border-gray-300"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
                <button
                  className="mt-4 edit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                >
                  Submit Password Change
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EditUserInfo;
