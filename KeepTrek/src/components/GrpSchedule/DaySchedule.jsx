import React, { useRef, useEffect } from "react";

const DaySchedule = ({ date }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to approximately the middle of the schedule (12:00)
    if (containerRef.current) {
      const middlePosition = containerRef.current.scrollHeight / 2.1;
      containerRef.current.scrollTo({
        top: middlePosition,
        behavior: "smooth",
      });
    }
  }, []);

  const renderTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let quarter = 0; quarter < 4; quarter++) {
        const minutes = quarter * 15;
        const time = `${hour.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
        timeSlots.push(
          <button
            key={`${hour}-${minutes}`}
            className="w-full p-2 border rounded hover:bg-gray-200"
            onClick={() => console.log(`Selected slot: ${time} on ${date}`)}
          >
            {time}
          </button>
        );
      }
    }
    return timeSlots;
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 border rounded overflow-y-auto max-h-96 relative"
    >
      <h3 className="sticky top-0 bg-gray-100 p-2 text-center font-semibold shadow">
        {new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          day: "numeric",
        }).format(date)}
      </h3>
      <div className="grid grid-cols-1 gap-1 p-2">{renderTimeSlots()}</div>
    </div>
  );
};

export default DaySchedule;
