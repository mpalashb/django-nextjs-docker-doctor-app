export const convertToDays = (day) => {
  // Day mapping
  const dayMapping = {
    sun: "Sunday",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
  };
  return dayMapping[day]; // Corrected to access the object value using day as the key
};

// Convert 24-hour time to 12-hour AM/PM format
export const convertToAmPm = (time) => {
  const [hours, minutes] = time.split(":");
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
