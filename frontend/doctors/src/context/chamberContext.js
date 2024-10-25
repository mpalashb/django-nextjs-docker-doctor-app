"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import { useAlert } from "./alertContext";

const ChamberContext = createContext();
export const useChamber = () => useContext(ChamberContext); // Fix useContext call

export const ChamberProvider = ({ children }) => {
  const { showAlert } = useAlert();
  const baseUrl = process.env.NEXT_PUBLIC_BACK_API;
  const [chambers, setChambers] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = [
    { value: "sun", label: "Sunday" },
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
    { value: "sat", label: "Saturday" },
  ];

  const fetchChambers = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/doctor-chamber-all`, {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChambers(data); // Save chambers data in the state
        setLoading(false);
      } else {
        setLoading(false);
        console.error("Failed to fetch chambers");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching chambers:", error);
    }
  };

  // Delete chamber function
  const deleteChamber = async (chamberId) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/doctor-chamber/${chamberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        // Remove the chamber from the state
        setChambers((prevChambers) =>
          prevChambers.filter((chamber) => chamber.id !== chamberId)
        );
        showAlert("Chamber deleted successfully!", "success"); // Show success alert
      } else {
        showAlert("Failed to delete chamber.", "error"); // Show error alert
        console.error("Failed to delete chamber");
      }
    } catch (error) {
      showAlert("Error deleting chamber.", "error"); // Show error alert
      console.error("Error deleting chamber:", error);
    }
  };

  const editChamberAction = async (chamberId, update_items) => {
    try {
      // Prepare the main chamber body
      const resBody = {
        default_chamber: update_items.default_chamber || false,
        chamber_name: update_items.chamber_name || "",
        chamber_address: update_items.chamber_address || "",
        appointment_number: update_items.appointment_number || "",
      };

      // Update the main chamber information
      const response = await fetch(
        `${baseUrl}/api/doctor-chamber/${chamberId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resBody),
        }
      );

      const resData = await response.json();
      const visitingHoursData = [];

      // Handle visiting hours updates (if provided)
      if (response.ok) {
        if (
          update_items.visiting_hours &&
          update_items.visiting_hours.length > 0
        ) {
          for (const vh of update_items.visiting_hours) {
            const visitingHourBody = {
              visiting_hour_start: vh.visiting_hour_start,
              visiting_hour_end: vh.visiting_hour_end,
              day: vh.day,
            };

            if (vh.id) {
              const vhRes = await fetch(
                `${baseUrl}/api/doctor-chamber-visiting-hour/${vh.id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(visitingHourBody),
                }
              );

              if (vhRes.ok) {
                const vhData = await vhRes.json();
                visitingHoursData.push(vhData);
              } else {
                const vhDataErr = await vhRes.json();
                showAlert(
                  JSON.stringify(vhDataErr) || "Visiting Hour Update Error!",
                  "error",
                  6000
                );
              }
            } else {
              const vhRes = await fetch(
                `${baseUrl}/api/doctor-visiting-hour-create/${chamberId}`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(visitingHourBody),
                }
              );

              if (vhRes.ok) {
                const vhData = await vhRes.json();
                visitingHoursData.push(vhData);
              } else {
                const vhDataErr = await vhRes.json();
                showAlert(
                  JSON.stringify(vhDataErr) || "Visiting Hour Creation Error!",
                  "error",
                  6000
                );
              }
            }
          }
        }

        showAlert("Chamber updated successfully!", "success");

        // Update the chambers state
        setChambers((prevChambers) =>
          prevChambers.map((chamber) =>
            chamber.id === chamberId
              ? {
                  ...chamber,
                  ...resData,
                  visiting_hours: visitingHoursData.length
                    ? visitingHoursData
                    : chamber.visiting_hours,
                }
              : chamber
          )
        );
      } else {
        showAlert("Failed to update chamber.", "error");
        console.error("Failed to update chamber");
      }
    } catch (error) {
      showAlert("Error updating chamber.", "error");
      console.error("Error updating chamber:", error);
    }
  };

  //   // Edit chamber function
  //   const editChamberAction = async (chamberId, update_items) => {
  //     try {
  //       // Prepare the main chamber body
  //       const resBody = {
  //         default_chamber: update_items.default_chamber || false,
  //         chamber_name: update_items.chamber_name || "",
  //         chamber_address: update_items.chamber_address || "",
  //         appointment_number: update_items.appointment_number || "",
  //       };

  //       // Update the main chamber information
  //       const response = await fetch(
  //         `${baseUrl}/api/doctor-chamber/${chamberId}`,
  //         {
  //           method: "PUT",
  //           headers: {
  //             Authorization: `Token ${localStorage.getItem("token")}`,
  //             "Content-Type": "application/json", // Specify JSON content
  //           },
  //           body: JSON.stringify(resBody), // Main chamber details
  //         }
  //       );

  //       const resData = await response.json();
  //       const visitingHoursData = [];

  //       // Handle visiting hours updates (if provided)
  //       if (response.ok) {
  //         if (
  //           update_items.visiting_hours &&
  //           update_items.visiting_hours.length > 0
  //         ) {
  //           update_items.visiting_hours.map(async (vh) => {
  //             // Prepare visiting hours body
  //             const visitingHourBody = {
  //               visiting_hour_start: vh.visiting_hour_start,
  //               visiting_hour_end: vh.visiting_hour_end,
  //               day: vh.day,
  //             };

  //             // If `vh.id` exists, update the existing visiting hour
  //             if (vh.id) {
  //               const vhRes = await fetch(
  //                 `${baseUrl}/api/doctor-chamber-visiting-hour/${vh.id}`,
  //                 {
  //                   method: "PUT",
  //                   headers: {
  //                     Authorization: `Token ${localStorage.getItem("token")}`,
  //                     "Content-Type": "application/json",
  //                   },
  //                   body: JSON.stringify(visitingHourBody),
  //                 }
  //               );

  //               if (vhRes.ok) {
  //                 const vhData = await vhRes.json();
  //                 visitingHoursData.push(vhData); // Push the updated visiting hour
  //               } else {
  //                 const vhDataErr = await vhRes.json();
  //                 showAlert(
  //                   JSON.stringify(vhDataErr) || "Visiting Hour Update Error!",
  //                   "error",
  //                   6000
  //                 );
  //               }
  //             } else {
  //               const vhRes = await fetch(
  //                 `${baseUrl}/api/doctor-visiting-hour-create/${chamberId}`,
  //                 {
  //                   method: "POST",
  //                   headers: {
  //                     Authorization: `Token ${localStorage.getItem("token")}`,
  //                     "Content-Type": "application/json",
  //                   },
  //                   body: JSON.stringify(visitingHourBody),
  //                 }
  //               );

  //               if (vhRes.ok) {
  //                 const vhData = await vhRes.json();
  //                 visitingHoursData.push(vhData); // Push the updated visiting hour
  //               } else {
  //                 const vhDataErr = await vhRes.json();
  //                 showAlert(
  //                   JSON.stringify(vhDataErr) || "Visiting Hour Update Error!",
  //                   "error",
  //                   6000
  //                 );
  //               }
  //             }
  //           });
  //         }

  //         // Show success message and update chambers in the state
  //         showAlert("Chamber updated successfully!", "success");

  //         // Update the chambers state with the updated chamber and visiting hours
  //         setChambers((prevChambers) =>
  //           prevChambers.map((chamber) =>
  //             chamber.id === chamberId
  //               ? {
  //                   ...chamber,
  //                   ...resData, // Main chamber data
  //                   visiting_hours: visitingHoursData.length
  //                     ? visitingHoursData
  //                     : chamber.visiting_hours, // Use the updated visiting hours or keep the old ones
  //                 }
  //               : chamber
  //           )
  //         );
  //       } else {
  //         showAlert("Failed to update chamber.", "error");
  //         console.error("Failed to update chamber");
  //       }
  //     } catch (error) {
  //       showAlert("Error updating chamber.", "error");
  //       console.error("Error updating chamber:", error);
  //     }
  //   };

  // Visiting Hour Delete Action
  const visitingHourDeleteAction = async (id, index) => {
    if (id) {
      try {
        const response = await fetch(
          `${baseUrl}/api/doctor-chamber-visiting-hour/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Handle response status
        if (response.ok) {
          setChambers((prevChambers) =>
            prevChambers.map((chamber) =>
              chamber.visiting_hours
                ? {
                    ...chamber,
                    visiting_hours: chamber.visiting_hours.filter(
                      (vh, i) => i !== index
                    ),
                  }
                : chamber
            )
          );

          showAlert("Visiting hour deleted successfully!", "success");
          return { success: true };
        } else {
          const errorData = await response.json();
          console.error("Failed to delete visiting hour:", errorData);
          showAlert(
            JSON.stringify(errorData) || "Failed to delete visiting hour.",
            "error"
          );
          return { error: true, msg: errorData };
        }
      } catch (error) {
        console.error("Error deleting visiting hour:", error);
        showAlert(
          JSON.stringify(error.message) || "Error deleting visiting hour.",
          "error"
        );
        return { error: true, msg: error.message };
      }
    } else {
      console.warn("No ID provided for visiting hour deletion.");
      showAlert("No ID provided for visiting hour deletion.", "warning");
      return { error: true, msg: "No ID provided." };
    }
  };

  // Create Visiting Hour Action
  const createVisitingHourAction = async (chamberId, visitingHourData) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/doctor-visiting-hour-create/${chamberId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(visitingHourData), // Passing the visiting hour data
        }
      );

      if (response.ok) {
        const newVisitingHour = await response.json(); // Parse the response

        // Optionally update the local state to reflect the new visiting hour
        setChambers((prevChambers) =>
          prevChambers.map((chamber) =>
            chamber.id === chamberId
              ? {
                  ...chamber,
                  visiting_hours: [...chamber.visiting_hours, newVisitingHour],
                }
              : chamber
          )
        );

        showAlert("Visiting hour created successfully!", "success");
        return { success: true, data: newVisitingHour };
      } else {
        const errorData = await response.json();
        console.error("Failed to create visiting hour:", errorData);
        showAlert(
          JSON.stringify(errorData) || "Failed to create visiting hour.",
          "error"
        );
        return { error: true, msg: errorData }; // Return error object
      }
    } catch (error) {
      console.error("Error creating visiting hour:", error);
      showAlert(
        JSON.stringify(error.message) || "Error creating visiting hour.",
        "error"
      );
      return { error: true, msg: error.message }; // Return error message
    }
  };

  const createChamber = async (newChambers) => {
    try {
      const chamberResponses = [];

      for (const chamber of newChambers) {
        // Validate chamber fields
        if (
          !chamber.chamber_name ||
          !chamber.chamber_address ||
          !chamber.appointment_number
        ) {
          showAlert("Please fill out all required fields.", "error");
          return;
        }

        // Validate visiting hours
        for (const visitingHour of chamber.visiting_hours) {
          if (
            !visitingHour.day ||
            !visitingHour.visiting_hour_start ||
            !visitingHour.visiting_hour_end
          ) {
            showAlert("All visiting hours must be complete.", "error");
            return;
          }
        }

        // Send request to create chamber
        const response = await fetch(
          `${baseUrl}/api/doctor-chamber-visiting-hour-create`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(chamber),
          }
        );

        const resData = await response.json();

        if (response.ok) {
          chamberResponses.push(resData);
        } else {
          showAlert(
            JSON.stringify(resData) || "Failed to create chamber.",
            "error"
          );
          console.error(resData);
          return;
        }
      }

      setChambers((prevChambers) => [...prevChambers, ...chamberResponses]);
      showAlert("Chamber(s) created successfully!", "success");
    } catch (error) {
      showAlert("An error occurred while creating the chamber.", "error");
      console.error(error);
    }
  };

  return (
    <ChamberContext.Provider
      value={{
        loading,
        chambers,
        fetchChambers,
        createChamber,
        editChamberAction,
        createVisitingHourAction,
        visitingHourDeleteAction,
        deleteChamber,
      }}
    >
      {children}
    </ChamberContext.Provider>
  );
};
