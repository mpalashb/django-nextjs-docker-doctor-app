"use client";

import React from "react";

const Message = ({ message, type }) => {
  const messageStyles = {
    error: "text-red-500",
    success: "text-green-500",
    info: "text-blue-500",
  };

  return (
    <p className={`mt-2 ${messageStyles[type] || messageStyles.info}`}>
      {message}
    </p>
  );
};

export default Message;
