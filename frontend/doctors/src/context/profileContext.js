"use client";

import React, { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "../context/alertContext";
import { useAuth } from "../context/authContext";

const ProfileContext = createContext();

// Custom hook to use ProfileContext
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACK_API;

  const { fetchAuthMe } = useAuth();
  const [deleteloading, setDeleteLoading] = useState(false);
  const [editloading, setEditLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    sex: "",
    phone: "",
    qualifications: "",
    designation: "",
    division: "",
    workplace: "",
    workplace_name: "",
    specialty: [], // Ensure this is initialized as an array
    profile_picture: null,
  });

  const [editProfileData, seteditProfileData] = useState({ ...profileData });

  const { showAlert } = useAlert();
  const router = useRouter();

  // Function to update profile picture
  const editUpdateProfilePicture = (file) => {
    if (file) {
      seteditProfileData((prevData) => ({
        ...prevData,
        profile_picture: file,
      }));
    }
  };

  const editUpdateProfileAction = async () => {
    let bodyData = {
      ...editProfileData,
    };

    // Check if both workplace and workplace_name are provided
    if (editProfileData.workplace.id && editProfileData.workplace_name) {
      showAlert(
        "Please provide either Workplace or the New Workplace Name, not both.",
        "error"
      );
      return;
    }

    // Create FormData object to handle both file and JSON data
    const formData = new FormData();

    // Add JSON fields to formData, including nested ones like division and specialty
    formData.append("first_name", bodyData.first_name);
    formData.append("last_name", bodyData.last_name);
    formData.append("sex", bodyData.sex);
    formData.append("phone", bodyData.phone || ""); // Optional fields
    formData.append("email", bodyData.email || "");
    formData.append("qualifications", bodyData.qualifications);
    formData.append("designation", bodyData.designation);
    formData.append("division", bodyData.division.id); // Use division id
    // formData.append(
    //   "specialty",
    //   bodyData.specialty.map((r) => parseInt(r.id)) // Convert specialties to IDs
    // );

    bodyData.specialty.forEach((r) => {
      formData.append("specialty", parseInt(r.id));
    });

    // Handle workplace/workplace_name
    if (bodyData.workplace.id) {
      formData.append("workplace", bodyData.workplace.id);
    } else {
      formData.append("workplace_name", bodyData.workplace_name);
    }

    // Handle profile picture if it's a file
    if (bodyData.profile_picture instanceof File) {
      formData.append("profile_picture", bodyData.profile_picture);
    }

    try {
      setEditLoading(true);

      const response = await fetch(`${baseUrl}/api/doctor-profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
          // No need to set "Content-Type" header. Fetch automatically sets it to `multipart/form-data` for FormData
        },
        body: formData, // Use formData for the request body
      });

      const data = await response.json();

      if (response.ok) {
        showAlert("Profile updated successfully", "success");
        setProfileData(data); // Update profileData state
        fetchAuthMe(); // Re-fetch authenticated user data
        console.log("Profile updated successfully:", data);
        return data;
      } else {
        showAlert(JSON.stringify(data) || "Failed to update profile", "error");
        console.log("Failed to update profile:", data);
        return null;
      }
    } catch (error) {
      showAlert("Error updating profile", "error");
      console.error("Error updating profile:", error);
      return null;
    } finally {
      setEditLoading(false);
    }
  };

  // const editUpdateProfileAction = async () => {
  //   let bodyData = {
  //     ...editProfileData,
  //   };

  //   // Check if both workplace and workplace_name are provided
  //   if (editProfileData.workplace.id && editProfileData.workplace_name) {
  //     showAlert(
  //       "Please provide either Workplace or the New Workplace Name, not both.",
  //       "error"
  //     );
  //     return;
  //   }

  //   // Destructure and handle profile_picture if it's of File type
  //   const { profile_picture, ...restData } = bodyData;

  //   if (!(profile_picture instanceof File)) {
  //     bodyData = restData; // Remove profile_picture from bodyData if it's not a File
  //   }

  //   try {
  //     setEditLoading(true);

  //     let finalBody = {
  //       ...bodyData,
  //       division: bodyData.division.id,
  //       specialty: bodyData.specialty.map((r) => r.id), // Flatten the specialty IDs array
  //     };

  //     // Adjust workplace handling
  //     if (bodyData.workplace) {
  //       finalBody.workplace = bodyData.workplace.id;
  //     }
  //     if (bodyData.workplace_name) {
  //       finalBody.workplace_name = bodyData.workplace_name;
  //     }
  //     console.log("finalBody", finalBody);

  //     const response = await fetch(`${baseUrl}/api/doctor-profile`, {
  //       method: "PATCH",
  //       headers: {
  //         Authorization: `Token ${localStorage.getItem("token")}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(finalBody), // Use the modified bodyData
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       showAlert("Profile updated successfully", "success");
  //       setProfileData(data); // Update profileData state
  //       fetchAuthMe(); // Re-fetch authenticated user data
  //       console.log("Profile updated successfully:", data);
  //       return data;
  //     } else {
  //       showAlert(JSON.stringify(data) || "Failed to update profile", "error");
  //       console.log("Failed to update profile:", data);
  //       return null;
  //     }
  //   } catch (error) {
  //     showAlert("Error updating profile", "error");
  //     console.error("Error updating profile:", error);
  //     return null;
  //   } finally {
  //     setEditLoading(false);
  //   }
  // };

  const deleteProfileAction = async () => {
    try {
      setDeleteLoading(true);
      const response = await fetch(`${baseUrl}/api/doctor-profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        await fetchAuthMe();
        showAlert("Profile deleted successfully", "success");
        console.log("Profile deleted successfully");
        // You could trigger further actions here, like redirecting
      } else {
        showAlert("Failed to delete profile", "error");
        console.log("Failed to delete profile");
      }
    } catch (error) {
      showAlert("Error deleting profile", "error");
      console.error("Error deleting profile:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Function to update text fields in the form
  const updateProfileData = (field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Function to update profile picture
  const updateProfilePicture = (file) => {
    if (file) {
      setProfileData((prevData) => ({
        ...prevData,
        profile_picture: file,
      }));
    } else {
      showAlert(`No Profile Picture Found!`, "error");
    }
  };

  // Function to update specialties (for checkboxes)
  const updateSpecialty = (specialtyId) => {
    setProfileData((prevData) => {
      const currentSpecialties = prevData.specialty.includes(specialtyId)
        ? prevData.specialty.filter((id) => id !== specialtyId) // Remove if it exists
        : [...prevData.specialty, specialtyId]; // Add if it doesn't exist

      return { ...prevData, specialty: currentSpecialties };
    });
  };

  // Function to handle form submission
  const submitProfileData = async () => {
    if (!profileData.workplace_name && !profileData.workplace) {
      showAlert(
        "You must Select a workplace name or create a new one",
        "error"
      );
      return; // Early exit if no workplace is provided
    }

    if (profileData.workplace_name && profileData.workplace) {
      showAlert("Select a Workplace or create new", "error");
      return;
    }

    const formData = new FormData();

    // Only append the necessary fields to FormData
    if (profileData.first_name) {
      formData.append("first_name", profileData.first_name);
    }

    if (profileData.last_name) {
      formData.append("last_name", profileData.last_name);
    }

    if (profileData.sex) {
      formData.append("sex", profileData.sex);
    }

    if (profileData.phone) {
      formData.append("phone", profileData.phone);
    }

    if (profileData.qualifications) {
      formData.append("qualifications", profileData.qualifications);
    }

    if (!profileData.workplace && profileData.workplace_name) {
      formData.append("workplace_name", profileData.workplace_name);
    }
    if (!profileData.workplace_name && profileData.workplace) {
      // console.log(profileData.workplace);
      formData.append("workplace", profileData.workplace);
    }

    if (profileData.designation) {
      formData.append("designation", profileData.designation);
    }

    if (profileData.division) {
      formData.append("division", parseInt(profileData.division)); // Convert division to number
    }

    if (profileData.profile_picture) {
      formData.append("profile_picture", profileData.profile_picture);
    }

    // Append specialties if they are provided
    if (Array.isArray(profileData.specialty) && profileData.specialty.length) {
      profileData.specialty.forEach((specialtyId) => {
        formData.append("specialty", parseInt(specialtyId)); // Convert to number
      });
    }

    try {
      const token = localStorage.getItem("token");
      // console.log(profileData);

      const response = await fetch(`${baseUrl}/api/doctor-profile-create`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`, // Include token in Authorization header
        },
        body: formData,
      });

      if (response.ok) {
        showAlert("Profile created successfully!", "success");
        await fetchAuthMe();
        router.push("/dashboard"); // Redirect to success page
      } else {
        const errorData = await response.json();
        console.log(errorData);

        if (errorData.detail) {
          showAlert(`Error: ${errorData.detail}`, "error");
        }

        if (errorData.profile_picture) {
          showAlert(
            `Error: Profile Picture ${errorData.profile_picture.toString()}`,
            "error"
          );
        }
        if (errorData.specialty) {
          showAlert(
            `Error: Specialty - ${errorData.specialty.toString()}`,
            "error"
          );
        }
        if (errorData.phone) {
          showAlert(`Error: Phone - ${errorData.phone.toString()}`, "error");
        }
      }
    } catch (error) {
      showAlert(`Error: ${error.message}`, "error");
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        loading: { deleteloading, editloading },
        editUpdateProfilePicture,
        setEditLoading,
        editProfileData,
        editUpdateProfileAction,
        seteditProfileData,
        deleteProfileAction,
        profileData,
        updateProfileData,
        updateProfilePicture,
        updateSpecialty, // Expose the updateSpecialty function
        submitProfileData,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
