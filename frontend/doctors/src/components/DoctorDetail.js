import React from "react";
import DoctorReview from "../components/DoctorReview";
import { convertToAmPm, convertToDays } from "../utils/timeDateConverter";

const DoctorDetail = ({ doctor }) => {
  let doctorDetail;

  doctorDetail = {
    id: doctor?.id,
    profile_picture: doctor?.profile_picture
      ? `${doctor?.profile_picture}`
      : "/default-profile.jpg",
    first_name: doctor?.first_name || "Unknown",
    last_name: doctor?.last_name || "",
    designation: doctor?.designation || "N/A",
    email: doctor?.email || "Not provided",
    phone: doctor?.phone || "Not provided",
    specialties: doctor?.specialty || [],
    qualifications: doctor?.qualifications || "Not available",
    workplace: doctor?.workplace?.name || "Not available",
    division: doctor?.division?.name || "Not available",
    chambers: doctor?.chambers || [],
    approved: doctor?.approved || false, // Approval field
    verified: doctor?.verified || false, // Verified field
    reviews: doctor?.reviews_count || 0, // Reviews field
    average_rating: doctor?.average_rating || 0, // Average rating field
  };

  // Function to render stars based on average rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`block h-4 w-4 align-middle ${
            i < rating ? "text-yellow-500" : "text-gray-400"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center space-x-6">
        <img
          src={doctorDetail.profile_picture}
          alt={`${doctorDetail.first_name} ${doctorDetail.last_name}`}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dr. {doctorDetail.first_name} {doctorDetail.last_name}
            {doctorDetail.approved ? (
              <span className="ml-2 px-2 py-1 bg-lime-500 text-white text-sm rounded-full">
                Approved
              </span>
            ) : (
              <span className="ml-2 px-2 py-1 bg-gray-400 text-white text-sm rounded-full">
                Not Approved
              </span>
            )}
            {doctorDetail.verified ? (
              <span className="ml-2 px-2 py-1 bg-blue-500  text-white text-sm rounded-full">
                Verified
              </span>
            ) : (
              <span className="ml-2 px-2 py-1 bg-gray-400 text-white text-sm rounded-full">
                Unverified
              </span>
            )}
          </h1>
          <p className="text-gray-600">{doctorDetail.designation}</p>
          <p className="text-gray-500">{doctorDetail.email}</p>
          <p className="text-gray-500">{doctorDetail.phone}</p>
        </div>
      </div>

      {/* Reviews and Ratings Section */}
      <div className="mt-8" style={{ display: "none" }}>
        <h2 className="text-xl font-semibold text-gray-800">
          Reviews & Ratings
        </h2>
        <p className="text-gray-600">
          Average Rating: {doctorDetail.average_rating}
        </p>

        <div className="mt-2 flex items-center gap-1 ">
          {renderStars(Math.round(doctorDetail.average_rating))}{" "}
          {/* Display stars */}
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
      </div>

      {/* Reviews and Ratings Section */}
      <div className="mt-8">
        <DoctorReview doctor={doctor} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Specialty</h2>
        <ul className="list-disc list-inside text-gray-600">
          {doctorDetail.specialties.length > 0 ? (
            doctorDetail.specialties.map((specialty, index) => (
              <li key={index}>{specialty.title}</li>
            ))
          ) : (
            <li>No specialties available</li>
          )}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Qualifications</h2>
        <p className="text-gray-600">{doctorDetail.qualifications}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Workplace</h2>
        <p className="text-gray-600">{doctorDetail.workplace}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Location</h2>
        <p className="text-gray-600">Division: {doctorDetail.division}</p>
      </div>

      {/* Chambers Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Chambers</h2>
        {doctorDetail.chambers.length > 0 ? (
          doctorDetail.chambers.map((chamber, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {chamber.chamber_name}
                {chamber.default_chamber && (
                  <span className="ml-2 px-2 py-1 bg-green-500 text-white text-sm rounded-full">
                    Default
                  </span>
                )}
              </h3>
              <p className="text-gray-600">
                Address: {chamber.chamber_address}
              </p>
              <p className="text-gray-600">
                Appointment Number:{" "}
                {chamber.appointment_number || "Not available"}
              </p>

              {/* Visiting Hours */}
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-700">
                  Visiting Hours
                </h4>
                {chamber.visiting_hours.length > 0 ? (
                  chamber.visiting_hours.map((hour, idx) => (
                    <p key={idx} className="text-gray-600">
                      {convertToDays(hour.day)}:{" "}
                      {convertToAmPm(hour.visiting_hour_start)} -{" "}
                      {convertToAmPm(hour.visiting_hour_end)}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600">No visiting hours available</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No chambers available</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDetail;
