import React from 'react';
import './TripBuddy.css'

const TripBuddy = () => {
  const buddies = [
    { name: "Gan Wei Lee" },
    { name: "Kyle Goh" },
    { name: "Bryan Tan" },
    { name: "Jaspreet Singh 哥" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
    { name: "Jaylee Kwa" },
  ];

  return (
    <div className="trip-buddy">
      <h3>Trip Buddy</h3>
      <ul>
        {buddies.map((buddy, index) => (
          <li key={index}>{buddy.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TripBuddy;