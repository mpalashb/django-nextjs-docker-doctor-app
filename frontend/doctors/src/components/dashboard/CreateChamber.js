"use client";

import React, { useState } from "react";
import { useChamber } from "../../context/chamberContext";

const CreateChamber = ({ setchamberCreateClick }) => {
  const { createChamber } = useChamber();

  const [addChamber, setAddChamber] = useState([
    {
      default_chamber: false,
      chamber_name: "",
      chamber_address: "",
      appointment_number: "",
      visiting_hours: [
        { day: "", visiting_hour_start: "", visiting_hour_end: "" },
      ],
    },
  ]);

  const daysOfWeek = [
    { value: "sun", label: "Sunday" },
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
    { value: "sat", label: "Saturday" },
  ];

  const handleChamberChange = (chamberIndex, e) => {
    const { name, value, type, checked } = e.target;
    const updatedChambers = [...addChamber];
    if (type === "checkbox") {
      updatedChambers[chamberIndex][name] = checked;
    } else {
      updatedChambers[chamberIndex][name] = value;
    }
    setAddChamber(updatedChambers);
  };

  const handleVisitingHourChange = (chamberIndex, hourIndex, e) => {
    const { name, value } = e.target;
    const updatedChambers = [...addChamber];
    updatedChambers[chamberIndex].visiting_hours[hourIndex][name] = value;
    setAddChamber(updatedChambers);
  };

  const addVisitingHour = (chamberIndex) => {
    const updatedChambers = [...addChamber];
    updatedChambers[chamberIndex].visiting_hours.push({
      day: "",
      visiting_hour_start: "",
      visiting_hour_end: "",
    });
    setAddChamber(updatedChambers);
  };

  const removeVisitingHour = (chamberIndex, hourIndex) => {
    const updatedChambers = [...addChamber];
    updatedChambers[chamberIndex].visiting_hours.splice(hourIndex, 1);
    setAddChamber(updatedChambers);
  };

  const removeChamber = (chamberIndex) => {
    const updatedChambers = addChamber.filter((_, i) => i !== chamberIndex);
    setAddChamber(updatedChambers);
  };

  const addNewChamber = () => {
    setAddChamber([
      ...addChamber,
      {
        default_chamber: false,
        chamber_name: "",
        chamber_address: "",
        appointment_number: "",
        visiting_hours: [
          { day: "", visiting_hour_start: "", visiting_hour_end: "" },
        ],
      },
    ]);
  };

  const handleSubmit = async () => {
    await createChamber(addChamber);
  };

  return (
    <div>
      {addChamber.length > 0 &&
        addChamber.map((chamber, chamberIndex) => (
          <div key={chamberIndex} className="mt-3 p-4 border border-gray-300">
            {/* Chamber Form Fields */}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Chamber Name"
                name="chamber_name"
                value={chamber.chamber_name}
                onChange={(e) => handleChamberChange(chamberIndex, e)}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Chamber Address"
                name="chamber_address"
                value={chamber.chamber_address}
                onChange={(e) => handleChamberChange(chamberIndex, e)}
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Appointment Number"
                name="appointment_number"
                value={chamber.appointment_number}
                onChange={(e) => handleChamberChange(chamberIndex, e)}
                className="border p-2"
              />

              {/* Default Chamber Checkbox */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="default_chamber"
                  checked={chamber.default_chamber}
                  onChange={(e) => handleChamberChange(chamberIndex, e)}
                />
                Set as Default Chamber
              </label>
            </div>

            {/* Visiting Hours Form */}
            <div className="mt-4">
              <h3 className="font-semibold">Visiting Hours</h3>
              {chamber.visiting_hours.map((visitingHour, hourIndex) => (
                <div key={hourIndex} className="flex flex-row gap-2 mt-2">
                  {/* Day Selection Dropdown */}
                  <select
                    name="day"
                    value={visitingHour.day}
                    onChange={(e) =>
                      handleVisitingHourChange(chamberIndex, hourIndex, e)
                    }
                    className="border p-2"
                  >
                    <option value="" disabled>
                      Select Day
                    </option>
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    placeholder="Start Time"
                    name="visiting_hour_start"
                    value={visitingHour.visiting_hour_start}
                    onChange={(e) =>
                      handleVisitingHourChange(chamberIndex, hourIndex, e)
                    }
                    className="border p-2"
                  />
                  <input
                    type="time"
                    placeholder="End Time"
                    name="visiting_hour_end"
                    value={visitingHour.visiting_hour_end}
                    onChange={(e) =>
                      handleVisitingHourChange(chamberIndex, hourIndex, e)
                    }
                    className="border p-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeVisitingHour(chamberIndex, hourIndex)}
                    className="text-white bg-red-600 hover:bg-red-700 border-0 py-2 px-4 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Add Another Visiting Hour Button */}
              <button
                type="button"
                onClick={() => addVisitingHour(chamberIndex)}
                className="mt-3 text-white bg-blue-600 border-0 py-2 px-4 rounded"
              >
                + Add Visiting Hour
              </button>
            </div>

            {/* Remove Chamber Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => removeChamber(chamberIndex)}
                className="text-white bg-red-600 hover:bg-red-700 border-0 py-2 px-4 rounded"
              >
                Remove Chamber
              </button>
            </div>
          </div>
        ))}

      {/* Action Buttons */}
      <div className="flex flex-row gap-3 mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-1/4 text-white bg-blue-600 border-0 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded"
        >
          {addChamber.length > 1 ? "Submit All Chambers" : "Create Chamber"}
        </button>
        <button
          type="button"
          onClick={() => {
            setAddChamber([]);
            setchamberCreateClick(false);
          }} // Resets chamber creation form
          className="w-1/4 text-white bg-red-600 border-0 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded"
        >
          Cancel
        </button>
      </div>

      {/* Add another chamber button */}
      <button
        type="button"
        className="mt-5 w-1/4 rounded-md bg-neutral-600 p-2 text-white"
        onClick={addNewChamber}
      >
        Add Another Chamber
      </button>
    </div>
  );
};

export default CreateChamber;
