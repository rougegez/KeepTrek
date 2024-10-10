import React, { useState, useEffect } from "react";
import { firestore } from "../../firebaseConfig.jsx";
import { collection, query, onSnapshot, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const Itinerary = () => {
  const [TripName, setTripName] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();

  // Function to handle creating new itinerary
  const handleCreateItinerary = async () => {
    try {
      const docRef = await addDoc(collection(firestore, "itineraries"), {
        TripName,
        StartDate,
        EndDate,
      });

      // Navigate to the trip details page after successful creation
      navigate(`/trip-details/${docRef.id}`, {
        state: { TripName, StartDate, EndDate },
      });
    } catch (error) {
      alert("Error adding trip: " + error.message);
    }
  };

  // Real-time listener for fetching itineraries
  useEffect(() => {
    const q = query(collection(firestore, "itineraries"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedItineraries = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItineraries(fetchedItineraries);
    });

    return () => unsubscribe();
  }, []);

  // Function to navigate to the details page of an itinerary
  const handleItineraryClick = (itinerary) => {
    navigate(`/trip-details/${itinerary.id}`, { state: { itinerary } });
  };

  return (
    <div>
      <h1>Create Your Trip</h1>
      <input
        type="text"
        placeholder="Trip Name"
        value={TripName}
        onChange={(e) => setTripName(e.target.value)}
      />
      <input
        type="date"
        placeholder="Start Date"
        value={StartDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        placeholder="End Date"
        value={EndDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={handleCreateItinerary}>Submit</button>

      <h2>Your Itineraries</h2>
      <ul>
        {itineraries.map((itinerary) => (
          <li key={itinerary.id}>
            <button onClick={() => handleItineraryClick(itinerary)}>
              {itinerary.TripName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
