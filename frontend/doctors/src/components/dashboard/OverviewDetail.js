import React, { useState, useEffect } from "react";
import { useProfile } from "../../context/profileContext";
import ProfileEditForm from "./profile/ProfileEditForm";

const OverviewDetail = ({ doctorProfile, user, profile_pic }) => {
  const {
    loading,
    editUpdateProfileAction,
    deleteProfileAction,
    editProfileData,
    seteditProfileData,
  } = useProfile();
  const { deleteloading, editloading } = loading;
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    seteditProfileData({
      division: doctorProfile.division,
      workplace: doctorProfile.workplace,
      specialty: doctorProfile.specialty,
      first_name: doctorProfile.first_name,
      last_name: doctorProfile.last_name,
      profile_picture: doctorProfile.profile_picture,
      sex: doctorProfile.sex,
      email: doctorProfile.email,
      phone: doctorProfile.phone,
      qualifications: doctorProfile.qualifications,
      designation: doctorProfile.designation,
    });
  }, [doctorProfile, user]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    seteditProfileData((prev) => ({
      ...prev,

      division: doctorProfile.division,
      workplace: doctorProfile.workplace,
      specialty: doctorProfile.specialty,
      first_name: doctorProfile.first_name,
      last_name: doctorProfile.last_name,
      profile_picture: doctorProfile.profile_picture,
      sex: doctorProfile.sex,
      email: doctorProfile.email,
      phone: doctorProfile.phone,
      qualifications: doctorProfile.qualifications,
      designation: doctorProfile.designation,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    seteditProfileData((prev) => ({
      ...prev,

      division: doctorProfile.division,
      workplace: doctorProfile.workplace,
      specialty: doctorProfile.specialty,
      first_name: doctorProfile.first_name,
      last_name: doctorProfile.last_name,
      profile_picture: doctorProfile.profile_picture,
      sex: doctorProfile.sex,
      email: doctorProfile.email,
      phone: doctorProfile.phone,
      qualifications: doctorProfile.qualifications,
      designation: doctorProfile.designation,
    }));
    editUpdateProfileAction();
  };

  const handleDelete = async () => {
    await deleteProfileAction();
  };

  return (
    <>
      <div className="pt-4">
        <h1 className="py-2 text-2xl font-semibold">Profile Overview</h1>
        <p className="font- text-slate-600">
          {isEditing
            ? "Edit your profile details!"
            : "Check your profile overview!"}
        </p>
      </div>
      <div className="container mx-auto px-4 py-8">
        {editloading && (
          <span className="text-white bg-green-600 hover:bg-green-700 py-1 px-3 rounded">
            Saving...
          </span>
        )}
        <div className="relative bg-white rounded-lg shadow-lg p-6">
          {/* Buttons in the top-right corner */}
          <div className="absolute top-4 right-4 space-x-2">
            {isEditing ? (
              <div className="-mt-16 flex space-x-3">
                <button
                  className="text-white bg-green-600 hover:bg-green-700 py-1 px-3 rounded"
                  onClick={handleSave}
                >
                  {editloading ? "Saving..." : "Save"}
                </button>

                <button
                  className="text-white bg-gray-600 hover:bg-gray-700 py-1 px-3 rounded"
                  onClick={() => {
                    toggleEdit();
                    handleCancel();
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  className="text-white bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded"
                  onClick={toggleEdit}
                >
                  Edit Profile
                </button>
                {/* Delete Button with Spinner */}
                <button
                  className="text-white bg-red-600 hover:bg-red-700 py-1 px-3 rounded flex items-center"
                  onClick={handleDelete}
                  disabled={deleteloading}
                >
                  {deleteloading ? (
                    <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full mr-2"></div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <>
              <div className="flex items-center space-x-6">
                <img
                  src={profile_pic}
                  alt={`${doctorProfile.first_name} ${doctorProfile.last_name}`}
                  width={150}
                  height={150}
                  className="w-36 h-36 rounded-full object-cover border-4 border-indigo-500"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Dr. {doctorProfile.first_name} {doctorProfile.last_name}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {doctorProfile.designation}
                  </p>
                  <p className="text-lg text-gray-600">
                    {doctorProfile.qualifications}
                  </p>
                  <p className="text-sm text-gray-400">{doctorProfile.email}</p>
                  <p className="text-sm text-gray-400">{doctorProfile.phone}</p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Workplace
                </h2>
                {doctorProfile.workplace ? (
                  <p className="text-gray-600">
                    <strong>Hospital/Workplace: </strong>
                    {doctorProfile.workplace.name}
                  </p>
                ) : (
                  <p className="text-gray-600">
                    No workplace information available.
                  </p>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Location
                </h2>
                {doctorProfile.division ? (
                  <p className="text-gray-600">
                    <strong>Division: </strong> {doctorProfile.division.name}
                  </p>
                ) : (
                  <p className="text-gray-600">
                    No location information available.
                  </p>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Specialties
                </h2>
                {doctorProfile.specialty &&
                doctorProfile.specialty.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-600">
                    {doctorProfile.specialty.map((spec) => (
                      <li key={spec.id}>{spec.title}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No specialties listed.</p>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Additional Information
                </h2>
                <p className="text-gray-600">
                  <strong>Verified: </strong>{" "}
                  {doctorProfile.verified ? "Yes" : "No"}
                </p>
                <p className="text-gray-600">
                  <strong>Average Rating: </strong>{" "}
                  {doctorProfile.average_rating}
                </p>
                <p className="text-gray-600">
                  <strong>Reviews Count: </strong> {doctorProfile.reviews_count}
                </p>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Login Information
                </h2>
                <p className="text-gray-600">
                  <strong>Last Login: </strong>{" "}
                  {new Date(user.last_login).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <strong>Username: </strong> {user.email}
                </p>
              </div>
            </>
          ) : (
            <ProfileEditForm />
          )}
        </div>
      </div>
    </>
  );
};

export default OverviewDetail;
