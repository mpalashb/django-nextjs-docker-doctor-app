"use client";

import React, { useState, useEffect } from "react";
import SkeletonLoader from "../../components/spinners/SkeletonLoader";
import { useChamber } from "../../context/chamberContext";
import { convertToAmPm, convertToDays } from "../../utils/timeDateConverter";
import ChamberEdit from "./ChamberEdit";
import CreateChamber from "./CreateChamber";

const ChamberComponent = () => {
  const [editChamberID, setEditChamberID] = useState(null);
  const [editChamber, setEditChamber] = useState({});
  const { loading, chambers, fetchChambers, deleteChamber } = useChamber();
  const [chamberCreateClick, setchamberCreateClick] = useState(false);

  useEffect(() => {
    fetchChambers();
  }, [editChamberID, editChamber]);

  const handleEditClick = (chamber) => {
    setEditChamberID(chamber.id);
    setEditChamber(chamber);
  };
  const handleCancelClick = () => {
    setEditChamberID(null);
    setEditChamber({});
  };

  if (loading) {
    // Skeleton loader component
    return <SkeletonLoader text="chamber" rows={2} />;
  }

  return (
    <div>
      <div className="pt-4">
        <h2 className="py-2 text-2xl font-semibold">
          {
            chamberCreateClick
              ? "Create Chamber" // If in the chamber creation state
              : chambers.length === 0
              ? "No Chamber Found!" // If no chambers are present and not in creation state
              : "Chambers" // If chambers are available
          }
        </h2>
      </div>

      <div>
        {!chamberCreateClick && (
          <button
            onClick={() => setchamberCreateClick(true)}
            className="my-6 inline-flex items-center text-white bg-blue-600 border-0 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded"
          >
            Create Chamber
          </button>
        )}
        {chamberCreateClick && (
          <div className="flex flex-col">
            <CreateChamber setchamberCreateClick={setchamberCreateClick} />
          </div>
        )}
      </div>

      {editChamberID && (
        <ChamberEdit
          setEditChamber={setEditChamber}
          handleCancelClick={handleCancelClick}
          editChamber={editChamber}
          editChamberID={editChamberID}
        />
      )}

      {chambers.map((chamber) => (
        <div key={chamber.id} className="mb-6 p-4 border rounded-md shadow-sm">
          {chamber?.default_chamber && (
            <span className="ml-2 px-2 py-1 bg-green-500 text-white text-sm rounded-full">
              Default
            </span>
          )}
          <h3 className="text-xl font-bold">{chamber.chamber_name}</h3>
          <p>{chamber.chamber_address}</p>
          <p>Appointment Number: {chamber.appointment_number}</p>

          <h4 className="font-semibold mt-2">Visiting Hours:</h4>
          <ul className="list-disc list-inside">
            {chamber.visiting_hours?.map((hour, index) => (
              <li key={index}>
                {convertToDays(hour.day)}:{" "}
                {convertToAmPm(hour.visiting_hour_start)} -{" "}
                {convertToAmPm(hour.visiting_hour_end)}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => deleteChamber(chamber.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => handleEditClick(chamber)} // Open the edit form
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChamberComponent;
