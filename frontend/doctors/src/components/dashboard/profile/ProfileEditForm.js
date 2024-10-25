"use client";

import React, { useState, useEffect } from "react";
import { useProfile } from "../../../context/profileContext"; // Use ProfileProvider context

const ProfileCreationForm = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACK_API;
  const [specialties, setSpecialties] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const { editUpdateProfilePicture, seteditProfileData, editProfileData } =
    useProfile();

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

  const handleSpecialtyChange = (e) => {
    const { value, checked, type } = e.target;

    seteditProfileData((prevProfile) => {
      let updatedSpecialties = [];
      if (type === "checkbox") {
        if (checked) {
          updatedSpecialties = [
            ...prevProfile.specialty,
            { id: parseInt(value) },
          ];
        } else {
          updatedSpecialties = prevProfile.specialty.filter(
            (spe) => spe.id !== parseInt(value)
          );
        }

        return {
          ...prevProfile,
          specialty: updatedSpecialties,
        };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    editUpdateProfilePicture(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "division") {
      const selectedDivision = divisions.find(
        (division) => division.id === parseInt(value)
      );
      seteditProfileData((prevProfile) => ({
        ...prevProfile,
        [name]: selectedDivision || {}, // Assign the selected division object
      }));
    } else if (name === "workplace") {
      const selectedWorkplace = hospitals.find(
        (workplace) => workplace.id === parseInt(value)
      );
      seteditProfileData((prevProfile) => ({
        ...prevProfile,
        [name]: selectedWorkplace || {}, // Update only workplace id
      }));
    } else {
      // Handle other fields like workplace_name
      seteditProfileData((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };

  return (
    <div className="lg:m-10">
      <form className="relative space-y-3 max-w-screen-md mx-auto bg-white">
        <h1 className="mb-6 text-xl font-semibold lg:text-2xl">
          Update Your Profile
        </h1>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={editProfileData.first_name || ""}
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
              value={editProfileData.last_name || ""}
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
              value={editProfileData.sex || ""}
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
              value={editProfileData.phone || ""}
              placeholder="+543 5445 0543"
              onChange={handleInputChange}
              className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            />
          </div>
          <div>
            <label>
              Email: <span className="text-sm text-gray-400">(optional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={editProfileData.email || ""}
              placeholder="test@example.com"
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
            value={editProfileData.qualifications || ""}
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
                  name="specialty"
                  value={specialty.id}
                  onChange={handleSpecialtyChange}
                  checked={editProfileData.specialty.some(
                    (r) => r.id === specialty.id
                  )}
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
            value={editProfileData.division?.id || ""} // Use division id for selected value
            onChange={handleInputChange}
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
            required
          >
            <option value="">Select Division</option> {/* Default option */}
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
            value={editProfileData.workplace?.id || ""}
            onChange={handleInputChange}
            className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
          >
            <option value={""}>{"Select Workplace"}</option>
            <option value={editProfileData.workplace?.id || ""}>
              {editProfileData.workplace?.name || "Select Workplace"}
            </option>
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
              value={editProfileData.workplace_name || ""}
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
            value={editProfileData.designation || ""}
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
      </form>
    </div>
  );
};

export default ProfileCreationForm;
