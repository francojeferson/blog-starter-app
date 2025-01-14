import React, { useState, useEffect } from "react";

function DemandStrip() {
  const [viewers, setViewers] = useState(70); // start at 70

  useEffect(() => {
    // Example: random small increment every 3-5 seconds
    const interval = setInterval(() => {
      setViewers((prev) => prev + Math.floor(Math.random() * 3)); // increments by 0-2
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-yellow-100 border border-yellow-300 rounded-md px-4 py-2 mt-2 text-center">
      <p className="text-sm sm:text-base font-bold text-red-600">
        High Demand: <span className="font-extrabold">{viewers} people</span> are looking at this offer!
      </p>
    </div>
  );
}

export default DemandStrip;
