import React from "react";

const MonthlySchedule = ({
  currentDate,
  selectedDates,
  temporarySelection,
  handleDragStart,
  handleDragEnd,
  handleDragEnter,
}) => {
  const getMonthDates = () => {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const dates = [];
    for (
      let day = firstDayOfMonth;
      day <= lastDayOfMonth;
      day.setDate(day.getDate() + 1)
    ) {
      dates.push(new Date(day));
    }
    return dates;
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {getMonthDates().map((date, index) => (
        <div
          key={date.toISOString()}
          className={`p-2 text-center border rounded cursor-pointer ${
            selectedDates.includes(date.getTime()) ||
            temporarySelection.has(index)
              ? "bg-blue-200"
              : "bg-white"
          }`}
          onMouseDown={() => handleDragStart(index)}
          onMouseUp={handleDragEnd}
          onMouseEnter={() => handleDragEnter(index)}
        >
          {date.getDate()}
        </div>
      ))}
    </div>
  );
};

export default MonthlySchedule;
