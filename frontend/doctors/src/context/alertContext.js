"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState("info");

  const showAlert = (msg, msgType = "info", duration = 3000) => {
    setAlert({ message: msg, type: msgType });
    setTimeout(() => {
      setAlert(null);
    }, duration);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
