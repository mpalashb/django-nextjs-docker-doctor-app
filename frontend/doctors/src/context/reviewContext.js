"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BACK_API;

const ReviewContext = createContext();

export const useReview = () => useContext(ReviewContext);

export const ReviewProvider = ({ children }) => {
  const [ratingState, setRatingState] = useState({});
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const write_review = async (doctorId, rating) => {
    setLoading(true);
    setError(null); // Clear existing errors before a new submission

    // Validate inputs
    if (!doctorId) {
      setError("Doctor ID is missing!");
      setLoading(false);
      return;
    }

    if (!rating) {
      setError("Rating is missing!");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/user/write-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          doctor: doctorId,
          rating: rating,
        }),
      });

      // Check response status
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result?.detail || "Failed to submit review");
      }

      // After review submission, fetch updated doctor details
      const drDetailRes = await fetch(
        `${baseUrl}/api/public/doctors/${doctorId}`,
        { cache: "no-store" }
      );

      if (!drDetailRes.ok) {
        throw new Error("Failed to fetch updated doctor details");
      }

      const drDetail = await drDetailRes.json();

      setRatingState({
        average_rating: drDetail?.average_rating || 0,
        reviews_count: drDetail?.reviews_count || 0,
      });

      setRatingSuccess(true);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      setRatingSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Reset error after a certain time
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(null); // Clear error after 5 seconds
      }, 2000);
      return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
    }
  }, [error]);

  return (
    <ReviewContext.Provider
      value={{
        ratingState,
        ratingSuccess,
        loading,
        error,
        write_review,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
