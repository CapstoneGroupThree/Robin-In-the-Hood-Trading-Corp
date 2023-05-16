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
      <div className=" w-full">
        <div className=" container flex justify-center items-center  ">
          <div className=" card p-6 max-w-sm mx-auto bg-gray-600 rounded-xl box-shadow flex items-center space-x-4">
            <div className="text-center text-white">
              <div className="text-4xl font-extrabold">User Info</div>
              <div className="mt-4 flex justify-between">
                {" "}
                <span className="text-xl font-bold"> Email Address:</span>{" "}
                <span className="text-xl"> {me.email}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-xl font-bold">First Name:</span>
                <span className="text-xl">{me.first_name}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-xl font-bold">Last Name:</span>
                <span className="text-xl">{me.last_name}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-xl font-bold">Password:</span>
                <span className="text-xl">********</span>
              </div>
              <button
                className=" edit-button mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEditModeToggle}
              >
                Edit Profile Information
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <div className=" container flex justify-center items-center h-screen ">
        <div className=" card p-6 max-w-sm mx-auto bg-slate-700 rounded-xl shadow-lg shadow-black flex items-center space-x-4">
          <div className="text-center text-white">
            <div className="text-4xl font-extrabold border-b-2 border-white-400">
              Edit User Info
            </div>
            <form
              className="space-y-4 text-gray-600"
              onSubmit={handleProfileSubmit}
            >
              <label className="block text-xl font-bold" htmlFor="email">
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
              <label className="block text-xl font-bold" htmlFor="firstName">
                First Name:
              </label>
              <input
                className="block w-full px-4 py-2 rounded-md border-2 border-gray-300"
                name="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <label className="block text-xl font-bold" htmlFor="lastName">
                Last Name:
              </label>
              <input
                className="block w-full px-4 py-2 rounded-md border-2 border-gray-300"
                name="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
              <button
                className=" button mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Submit
              </button>
            </form>
            <div className="mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEditPasswordToggle}
              >
                Change Password
              </button>
            </div>
            {editPasswordMode ? (
              <div>
                <form
                  className="space-y-4 text-gray-600"
                  onSubmit={handlePasswordSubmit}
                >
                  <label
                    className="block text-xl font-bold"
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
                    className="block text-xl font-bold"
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
                    className="block text-xl font-bold"
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
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                  >
                    Submit Password Change
                  </button>
                </form>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserInfo;
