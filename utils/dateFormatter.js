// utils/dateFormatter.js
const dayjs = require("dayjs");

// Function to format a date into a human-readable string
const formatDate = (date) => {
  return dayjs(date).format("MMMM D, YYYY h:mm A"); // Formats to "January 1, 2020 12:00 PM"
};

// Exporting the utility function
module.exports = formatDate;

// Note: If additional formatting functions are needed, export an object instead:
// module.exports = { formatDate };
