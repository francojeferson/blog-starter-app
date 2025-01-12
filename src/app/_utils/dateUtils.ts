export function getFormattedDate(): string {
  // Get today's date in UTC
  const today = new Date();

  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the day, month, and year in UTC
  const day = today.getUTCDate();
  const month = monthNames[today.getUTCMonth()]; // getUTCMonth() returns 0-11
  const year = today.getUTCFullYear();

  // Format the date as "Month Day, Year"
  return `${month} ${day}, ${year}`;
}

export function getFormattedDayDate(): string {
  // Get today's date in UTC
  const today = new Date();

  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Array of day names
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get the day of the week, day, month, and year in UTC
  const dayOfWeek = dayNames[today.getUTCDay()];
  const day = today.getUTCDate();
  const month = monthNames[today.getUTCMonth()]; // getUTCMonth() returns 0-11
  const year = today.getUTCFullYear();

  // Format the date as "DayOfWeek, Month Day, Year"
  return `${dayOfWeek}, ${month} ${day}, ${year}`;
}
