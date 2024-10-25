"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "../context/alertContext";

const PaymentContext = createContext();

export const usePayment = () => {
  return useContext(PaymentContext);
};

export const PaymentProvider = ({ children }) => {
  const { showAlert } = useAlert();

  const baseUrl = process.env.NEXT_PUBLIC_BACK_API;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/payment-ref`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (newPayment) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/payment-ref`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newPayment),
      });

      const resData = await response.json();

      if (response.ok) {
        setLoading(false);
        showAlert("Payment Added!", "success");
        fetchPayments(); // Refresh payment list after adding
      } else {
        setLoading(false);
        showAlert(JSON.stringify(resData) || "Failed to add payment", "error");
      }
    } catch (err) {
      setLoading(false);
      showAlert("Failed to add payment", "error");
      setError("Failed to add payment");
    }
  };

  const deletePayment = async (id) => {
    try {
      setLoading(true);
      await fetch(`${baseUrl}/api/payment-ref/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      setPayments([]);
      showAlert("Payment Deleted", "success");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showAlert("Failed to delete payment", "error");
      setError("Failed to delete payment");
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        loading,
        error,
        fetchPayments,
        addPayment,
        deletePayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
