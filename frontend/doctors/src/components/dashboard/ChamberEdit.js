"use client";

import React from "react";
import { useChamber } from "../../context/chamberContext";

const ChamberEdit = ({
  handleCancelClick,
  editChamber,
  setEditChamber,
  editChamberID,
}) => {
  const { editChamberAction, visitingHourDeleteAction } = useChamber();

  const editOnchange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditChamber((prevChamber) => ({
      ...prevChamber,
      [name]: type === "checkbox" ? checked : value, // Handle checkbox and other inputs
    }));
  };

  const editVhOnchange = (e, index) => {
    const { name, value } = e.target;
    const updateVisitingHour = [...editChamber.visiting_hours];
    updateVisitingHour[index][name] = value;
    setEditChamber({
      ...editChamber,
      visiting_hours: updateVisitingHour,
    });
  };

  const onUpdate = async (e) => {
    console.log(editChamber);
    e.preventDefault();
    await editChamberAction(editChamberID, editChamber);
  };

  const onVisitingDelete = async (id, index, e) => {
    e.preventDefault();
    const res = await visitingHourDeleteAction(id, index);

    if (!res.error) {
      const updatedVisitingHours = [...editChamber.visiting_hours];
      updatedVisitingHours.splice(index, 1);
      setEditChamber({
        ...editChamber,
        visiting_hours: updatedVisitingHours,
      });
    } else {
      console.error("Failed to delete visiting hour or error occurred.");
    }
  };

  const handleAddVH = () => {
    setEditChamber((prev) => ({
      ...prev,
      visiting_hours: [
        ...prev.visiting_hours,
        {
          visiting_hour_start: "00:00",
          visiting_hour_end: "00:00",
          day: "fri",
        },
      ],
    }));
  };

  const handleRemoveVH = (index) => {
    setEditChamber((prev) => ({
      ...prev,
      visiting_hours: prev.visiting_hours.filter((_, i) => i !== index), // Remove visiting hour at the given index
    }));
  };

  return (
    <>
      <div className="mb-6 p-4 border rounded-md shadow-sm">
        <h3 className="text-xl font-bold">Update Chamber</h3>

        <label htmlFor="#">Default/Primary</label>
        <input
          type="checkbox"
          name="default_chamber"
          checked={editChamber.default_chamber}
          onChange={editOnchange}
          className="border p-2 mb-2 mx-3"
        />

        <input
          type="text"
          placeholder="Chamber Name"
          name="chamber_name"
          value={editChamber.chamber_name}
          onChange={editOnchange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Chamber Address"
          name="chamber_address"
          value={editChamber.chamber_address}
          onChange={editOnchange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Appointment Number"
          name="appointment_number"
          value={editChamber.appointment_number}
          onChange={editOnchange}
          className="border p-2 mb-2 w-full"
        />

        <div className="my-4">
          <label>Visiting Hours</label>
          {editChamber.visiting_hours.map((vh, index) => (
            <div
              key={vh.id || index}
              className="mt-2 grid gap-3 lg:grid-cols-3"
            >
              <div>
                <label>Day</label>
                <select
                  name="day"
                  value={vh.day}
                  onChange={(e) => editVhOnchange(e, index)}
                  className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
                  required
                >
                  <option value="sun">Sunday</option>
                  <option value="mon">Monday</option>
                  <option value="tue">Tuesday</option>
                  <option value="wed">Wednesday</option>
                  <option value="thu">Thursday</option>
                  <option value="fri">Friday</option>
                  <option value="sat">Saturday</option>
                </select>
              </div>

              <div>
                <label>Start Time</label>
                <input
                  type="time"
                  name="visiting_hour_start"
                  onChange={(e) => editVhOnchange(e, index)}
                  value={vh.visiting_hour_start}
                  className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
                  required
                />
              </div>

              <div>
                <label>End Time</label>

                <input
                  type="time"
                  name="visiting_hour_end"
                  onChange={(e) => editVhOnchange(e, index)}
                  value={vh.visiting_hour_end}
                  className="mt-2 h-12 w-full rounded-md bg-gray-100 px-3"
                  required
                />
                {vh.id && (
                  <button
                    onClick={(e) => onVisitingDelete(vh.id, index, e)}
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                )}
                {!vh.id && (
                  <button
                    onClick={(e) => handleRemoveVH(index)}
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="visiting-hour flex">
          <button
            onClick={handleAddVH}
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            + New Visiting Hour
          </button>
        </div>

        <button
          onClick={onUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
        <button
          onClick={handleCancelClick}
          className="bg-gray-600 text-white px-4 py-2 rounded ml-2"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default ChamberEdit;
