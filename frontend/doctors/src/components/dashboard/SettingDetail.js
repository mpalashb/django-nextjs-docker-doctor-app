import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useAlert } from "../../context/alertContext";

const SettingDetail = ({ user }) => {
  const { showAlert } = useAlert();

  const { userUpdateAction, userDeleteAction } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [clickEmailChange, setClickEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    if (user?.email) {
      setNewEmail(user.email);
    }
  }, [user]);

  const handlePasswordChange = async () => {
    await userUpdateAction(currentPassword, "", newPassword);
    setNewPassword("");
    setCurrentPassword("");
  };

  const handleEmailSet = (e) => {
    setNewEmail(e.target.value);
  };

  const handleEmailChange = async () => {
    if (!currentPassword) {
      showAlert("Please put your current password first!", "error", 5000);
      return;
    }

    await userUpdateAction(currentPassword, newEmail, "");
    setNewPassword("");
    setCurrentPassword("");
    setClickEmailChange(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      userDeleteAction(); // Trigger the delete account action
    }
  };

  return (
    <>
      <div className="pt-4">
        <h1 className="py-2 text-2xl font-semibold">User Account</h1>
        <p className="font- text-slate-600">
          Check your user account overview!
        </p>
      </div>
      <hr className="mt-4 mb-8" />

      {/* Email Section */}
      <p className="py-2 text-xl font-semibold">Email Address</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          Your email address is <strong>{user?.email}</strong>
        </p>

        <button
          onClick={() => setClickEmailChange(true)}
          className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2"
        >
          Change
        </button>
      </div>
      {clickEmailChange && (
        <>
          <hr className="mt-4 mb-8" />
          {/* Email Section */}
          <p className="py-2 text-xl font-semibold">New Address</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <input
              type="email"
              id="email-changed"
              name="new_email"
              value={newEmail}
              onChange={handleEmailSet}
              className=" appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
            />

            <div className="flex space-x-3">
              <button
                onClick={handleEmailChange}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Save Email
              </button>
              <button
                onClick={() => setClickEmailChange(false)}
                className="mt-4 rounded-lg bg-yellow-600 px-4 py-2 text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      <hr className="mt-4 mb-8" />

      {/* Password Section */}
      <p className="py-2 text-xl font-semibold">Password</p>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
          <label htmlFor="current-password">
            <span className="text-sm text-gray-500">Current Password</span>
            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder="***********"
              />
            </div>
          </label>
          <label htmlFor="new-password">
            <span className="text-sm text-gray-500">New Password</span>
            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder="***********"
              />
            </div>
          </label>
        </div>
        <button
          onClick={handlePasswordChange}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Save Password
        </button>
      </div>

      <p className="mt-2">
        Can't remember your current password?{" "}
        <a
          className="text-sm font-semibold text-blue-600 underline decoration-2"
          href="#"
        >
          Recover Account
        </a>
      </p>
      <hr className="mt-4 mb-8" />

      {/* Delete Account Section */}
      <div className="mb-10">
        <p className="py-2 text-xl font-semibold">Delete Account</p>
        <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Proceed with caution
        </p>
        <p className="mt-2">
          Make sure you have taken backup of your account in case you ever need
          to get access to your data. We will completely wipe your data. There
          is no way to access your account after this action.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="mt-4 text-sm font-semibold text-rose-600 underline decoration-2"
        >
          Continue with deletion
        </button>
      </div>
    </>
  );
};

export default SettingDetail;
