"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "../../../context/profileContext"; // Use ProfileProvider context

const ProfileCreationForm = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACK_API;
  const [specialties, setSpecialties] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const {
    profileData,
    updateProfileData,
    updateProfilePicture,
    updateSpecialty,
    submitProfileData,
  } = useProfile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/public/div-hos-spe`);
        const data = await response.json();
        setSpecialties(data.specialties);
        setHospitals(data.hospitals);
        setDivisions(data.divisions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    await submitProfileData(); // Submit data through the context function
  };

  // Handle input changes (text/selection)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateProfileData(name, value); // Update profile data through context
  };

  // Handle file change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    updateProfilePicture(file); // Update profile picture in context
  };

  return (
    <div className="lg:m-10">
      <form
        onSubmit={handleSubmit}
        className="relative border border-gray-100 space-y-3 max-w-screen-md mx-auto rounded-md bg-white p-6 shadow-xl lg:p-10"
      >
        <h1 className="mb-6 text-xl font-semibold lg:text-2xl">
          Create Doctor Profile
        </h1>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Your First Name"
              onChange={handleInputChange}
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Your Last Name"
              onChange={handleInputChange}
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            />
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div>
            <label>Gender</label>
            <select
              name="sex"
              onChange={handleInputChange}
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label>
              Phone: <span className="text-sm text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+543 5445 0543"
              onChange={handleInputChange}
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            />
          </div>
        </div>

        <div>
          <label>Qualifications</label>
          <textarea
            name="qualifications"
            placeholder="Your qualifications"
            onChange={handleInputChange}
            className="mt-2 w-full rounded-md bg-gray-100 px-3 py-2"
            required
          />
        </div>

        <div>
          <label>Specialty</label>
          <div className="grid gap-2 mt-2">
            {specialties.map((specialty) => (
              <div key={specialty.id}>
                <input
                  type="checkbox"
                  value={specialty.id}
                  onChange={() => updateSpecialty(specialty.id)} // Call the update function
                  checked={profileData.specialty.includes(specialty.id)}
                  className="mr-2"
                />
                <label>{specialty.title}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label>Division</label>
          <select
            name="division"
            onChange={handleInputChange}
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            required
          >
            <option value="">Select your division</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Workplace</label>
          <select
            name="workplace"
            onChange={handleInputChange}
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
          >
            <option value="">Select your workplace</option>
            {hospitals.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
          <p>
            <span className="text-red-400">If Not There</span>
            <input
              type="text"
              name="workplace_name"
              onChange={handleInputChange} // Update workplace name
              placeholder="New Workplace Name"
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            />
          </p>
        </div>

        <div>
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            placeholder="Your Designation"
            onChange={handleInputChange}
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            required
          />
        </div>

        {/* Profile picture input */}
        <div>
          <label>Profile Picture</label>
          <input
            type="file"
            name="profile_picture"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
          />
        </div>

        <div className="mt-5">
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 p-2 text-center font-semibold text-white"
          >
            Create Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCreationForm;
