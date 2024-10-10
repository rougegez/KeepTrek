import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig.jsx";

// Helper function to generate the list of dates between start and end date
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const stopDate = new Date(endDate);

  while (currentDate <= stopDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const TripDetailsPage = () => {
  const location = useLocation();
  const { id } = useParams(); // Get the itinerary id from the URL
  const [itinerary, setItinerary] = useState(location.state?.itinerary || null);
  const [selectedDay, setSelectedDay] = useState(null); // State for the selected day

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!itinerary) {
        const docRef = doc(firestore, "itineraries", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItinerary(docSnap.data()); // Set fetched itinerary
        } else {
          console.error("No such itinerary found!");
        }
      }
    };

    fetchItinerary();
  }, [id, itinerary]);

  // Handle the click on a day button
  const handleDayClick = (day) => {
    setSelectedDay(day); // Set the selected day to show the planning section
  };

  if (!itinerary) {
    return <p>Loading itinerary...</p>;
  }

  // Generate the date range based on the start and end dates
  const dateRange = generateDateRange(itinerary.StartDate, itinerary.EndDate);

  return (
    <div>
      <h1>Trip Details</h1>
      <h2>{itinerary.TripName}</h2>

      <h3>Select a Day to Plan:</h3>
      <ul>
        {dateRange.map((date, index) => (
          <li key={index}>
            <button onClick={() => handleDayClick(date)}>
              {date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </button>
          </li>
        ))}
      </ul>

      {/* Conditionally render the planning section for the selected day */}
      {selectedDay && (
        <div>
          <h3>
            Plan for{" "}
            {selectedDay.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>

          {/* Planning section content */}
          <textarea placeholder="Enter your plan for the day..."></textarea>
          <button>Save Plan</button>
        </div>
      )}
    </div>
  );
};

export default TripDetailsPage;
