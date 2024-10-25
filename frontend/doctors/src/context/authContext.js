"use client";

// authContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "../context/alertContext"; // Import useAlert hook

const baseUrl = process.env.NEXT_PUBLIC_BACK_API;

// Create the context
const AuthContext = createContext();

// Custom hook to easily use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const { showAlert } = useAlert(); // Use the alert hook to show messages

  let errorTimeout; // Variable to hold the timeout reference

  // Function to clear error after a specified duration
  const clearError = () => {
    errorTimeout = setTimeout(() => {
      setError(null);
    }, 2000); // Clear error after 2 seconds
  };

  // Fetch authenticated user (authMe)
  const fetchAuthMe = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/user/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // Include token in Authorization header
        },
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        // showAlert("User authenticated successfully!", "success"); // Show success alert
      } else {
        setUser(null);
        throw new Error(data.detail || "Unable to fetch user.");
      }
    } catch (err) {
      setError(err.message);
      //   showAlert(err.message, "error"); // Show error alert
      clearError();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/user/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        // Store token in local storage
        localStorage.setItem("token", data.token);
        setError(null);

        await fetchAuthMe();
        showAlert("Login successful!", "success"); // Show success alert
        router.push("/dashboard"); // Redirect after successful login
      } else {
        throw new Error(
          data.detail || data.non_field_errors || "Login failed."
        );
      }
    } catch (err) {
      setError(err.message);
      showAlert(err.message, "error"); // Show error alert
      clearError();
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/user/auth/register`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        setError(null);
        showAlert("User created successfully!", "success"); // Show success alert
        router.push("/login"); // Redirect to login page after successful registration
      } else {
        throw new Error(data.email || "Registration failed.");
      }
    } catch (err) {
      setError(err.message);
      showAlert(err.message, "error"); // Show error alert
      clearError();
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/user/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (res.ok) {
        setUser(null);
        showAlert("Logout successful!", "success"); // Show success alert
        router.push("/login"); // Redirect after successful logout
      } else {
        throw new Error("Logout failed.");
      }
    } catch (err) {
      setError(err.message);
      showAlert(err.message, "error"); // Show error alert
      clearError();
    } finally {
      setLoading(false);
    }
  };

  const userDeleteAction = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/user/auth/user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (res.ok) {
        setUser(null);
        showAlert("User Deleted!", "success"); // Show success alert
        router.push("/login"); // Redirect after successful logout
      } else {
        throw new Error("User deleting failed.");
      }
    } catch (err) {
      setError(err.message);
      showAlert(err.message, "error"); // Show error alert
      clearError();
    } finally {
      setLoading(false);
    }
  };

  const userUpdateAction = async (
    currentPassword,
    newUsernameEmail = "",
    newPassword = ""
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Only include fields that are not empty
      const requestBody = {
        current_password: currentPassword,
      };

      if (newUsernameEmail) {
        requestBody.new_username_email = newUsernameEmail;
      }

      if (newPassword) {
        console.log(newPassword);
        requestBody.new_password = newPassword;
      }

      const res = await fetch(`${baseUrl}/api/user/auth/user/update`, {
        method: "PUT", // Using PUT for update requests
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(requestBody), // Only include provided fields
      });

      if (res.ok) {
        if (newUsernameEmail) {
          const data = await res.json();
          setUser((prevUser) => ({
            ...prevUser,
            email: newUsernameEmail ? newUsernameEmail : prevUser.email,
          })); // Update user details
          showAlert("User Email updated successfully!", "success"); // Show success alert
        }

        if (newPassword) {
          // localStorage.removeItem("token");
          // setUser(null);
          // router.push("/login");
          showAlert("Password updated successfully!", "success");
        }
      } else {
        const errorData = await res.json();
        console.log(errorData);
        showAlert(JSON.stringify(errorData) || "User update failed!", "error");
        // throw new Error(errorData.detail || "User update failed.");
      }
    } catch (err) {
      setError(err.message);
      showAlert(err.message, "error"); // Show error alert
      clearError();
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch user on mount
  useEffect(() => {
    fetchAuthMe();

    // Cleanup function to clear timeout if the component unmounts
    return () => {
      clearTimeout(errorTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userUpdateAction,
        userDeleteAction,
        fetchAuthMe,
        user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
