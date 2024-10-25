"use client";

import React, { useState, useEffect } from "react";
import { useReview } from "../context/reviewContext";
import Message from "../components/Message";
import { useAuth } from "../context/authContext";

const DoctorReview = ({ doctor }) => {
  const { user } = useAuth();

  const { ratingState, ratingSuccess, loading, error, write_review } =
    useReview();

  const [doctorDetail, setDoctorDetail] = useState({
    id: doctor?.id,
    reviews: doctor?.reviews_count || 0,
    average_rating: doctor?.average_rating || 0,
  });

  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null); // For local error handling
  const [serverError, setServerError] = useState(null); // For server error handling

  const totalStars = 5;
  let errorTimeout; // Variable to hold the timeout reference

  // Update doctor details on successful review submission
  useEffect(() => {
    if (ratingSuccess) {
      setDoctorDetail({
        ...doctorDetail,
        reviews: ratingState.reviews_count,
        average_rating: ratingState.average_rating,
      });
      setLocalError(null); // Clear local errors
      setServerError(null); // Clear server errors on success
    }
  }, [ratingState, ratingSuccess]);

  // Handle server error (from the API context)
  useEffect(() => {
    if (error && !ratingSuccess) {
      setServerError(error); // Set the server error when a failure occurs

      // Set a timeout to clear the server error after 5 seconds
      errorTimeout = setTimeout(() => {
        setServerError(null);
      }, 2000);
    }

    // Cleanup function to clear the timeout if the component unmounts or if a new error occurs
    return () => {
      clearTimeout(errorTimeout);
    };
  }, [error, ratingSuccess]);

  const renderStarsHover = () => {
    return [...Array(totalStars)].map((_, index) => {
      const starValue = index + 1;

      return (
        <svg
          key={starValue}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => setSelectedStar(starValue)}
          className={`block h-6 w-6 cursor-pointer transition-colors duration-100 ${
            starValue <= (hoveredStar || selectedStar)
              ? "text-yellow-500"
              : "text-gray-400"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    });
  };

  const handleSubmit = async () => {
    setLocalError(null); // Clear local error before submission
    setServerError(null); // Clear server error before a new attempt

    if (selectedStar === 0) {
      setLocalError("Please select a rating before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      await write_review(doctorDetail.id, selectedStar);
      // alert("Review submitted successfully!");
    } catch (err) {
      setServerError("An error occurred: " + err.message); // Update server error on failure
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarsV2 = (rating) => {
    return [...Array(totalStars)].map((_, index) => (
      <svg
        key={index}
        className={`block h-4 w-4 align-middle ${
          index < rating ? "text-yellow-500" : "text-gray-400"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800">Reviews & Ratings</h2>
      <p className="text-gray-600">
        Average Rating: {doctorDetail.average_rating}
      </p>

      <div className="mt-2 flex items-center gap-1">
        {renderStarsV2(Math.round(doctorDetail.average_rating))}
        <div className="ml-3">
          {doctorDetail.reviews > 0 ? (
            <div className="border-b border-gray-300 py-4">
              <p className="text-gray-500">Reviews: {doctorDetail.reviews}</p>
            </div>
          ) : (
            <p className="text-gray-600">No reviews available</p>
          )}
        </div>
      </div>

      {user && (
        <div className="mt-2 flex items-center gap-1">
          <div className="flex flex-col items-center">
            <div className="flex space-x-1">{renderStarsHover()}</div>
            <p className="mt-2 text-gray-600">
              Selected Rating: {selectedStar}
            </p>

            {/* Show local errors */}
            {localError && <Message message={localError} type="error" />}

            {/* Show server errors */}
            {serverError && <Message message={serverError} type="error" />}

            <button
              onClick={handleSubmit}
              className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg ${
                submitting || loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={submitting || loading}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorReview;
