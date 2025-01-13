"use client";
import React, { useState, useEffect } from "react";

function AnnouncementBar() {
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  const formatTime = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="w-full bg-yellow-300 text-center py-2 font-bold">
      <p className="text-sm sm:text-base">50% Off • HURRY! LIMITED TO 100 SPOTS ONLY!</p>
      <p className="text-sm">
        Your spot is reserved for{" "}
        <span className="mx-1 text-red-600 text-base sm:text-lg">
          {formatTime(minutes)}:{formatTime(seconds)}
        </span>
      </p>
    </div>
  );
}

export default AnnouncementBar;
