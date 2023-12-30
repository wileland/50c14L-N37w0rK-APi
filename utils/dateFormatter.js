// utils/dateFormatter.js
const dayjs = require("dayjs");

// You can extend dayjs with more functionality if you need to
// const relativeTime = require('dayjs/plugin/relativeTime');
// dayjs.extend(relativeTime);

// Example function to format a date into a human-readable string
const formatDate = (date) => {
  return dayjs(date).format("MMMM D, YYYY h:mm A"); // e.g., "January 1, 2020 12:00 PM"
};

module.exports = {
  formatDate,
};

// Next steps: Use this utility function to format dates in your application as needed.
