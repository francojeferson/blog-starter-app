// Utility function to convert object to query string
const toQueryString = (params: {
  [key: string]: string | string[] | undefined;
}) => {
  const queryString = Object.keys(params)
    .map((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        return value
          .map((val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
          .join("&");
      } else if (value !== undefined) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      } else {
        return "";
      }
    })
    .filter(Boolean) // Remove any empty strings
    .join("&");

  return queryString;
};

export default toQueryString;
