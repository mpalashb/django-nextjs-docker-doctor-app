"use client";

import { useAlert } from "../context/alertContext";

const Alert = () => {
  const { alert } = useAlert();

  if (!alert) return null;

  return (
    <div
      className={`alert ${alert.type}`} // Use CSS classes for styling
      style={{
        position: "fixed",
        top: "70px", // Adjust based on your header height
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        padding: "10px 20px",
        borderRadius: "5px",
        color: "white",
        backgroundColor: alert.type === "error" ? "red" : "green", // Example styling
      }}
    >
      {alert.message}
    </div>
  );
};

export default Alert;
