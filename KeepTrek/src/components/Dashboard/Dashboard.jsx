// src/components/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { firestore } from "../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import "./Dashboard.css"; // Create this CSS file for styling

/**
 * Dashboard component to display the user's trip history.
 *
 * @returns {React.Component} - The dashboard view.
 */
const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrips = async () => {
    try {
      const tripsRef = collection(firestore, "trips");
      const q = query(tripsRef, where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      const tripsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTrips(tripsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trip history.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="dashboard-container">Loading your trips...</div>;
  }

  if (error) {
    return <div className="dashboard-container error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Your Trip History</h1>
      {trips.length === 0 ? (
        <p>You haven't planned any trips yet. Start planning now!</p>
      ) : (
        <ul className="trip-list">
          {trips.map((trip) => (
            <li key={trip.id} className="trip-item">
              <h2>{trip.tripName}</h2>
              <p>
                <strong>Destination:</strong> {trip.destination}
              </p>
              <p>
                <strong>Dates:</strong>{" "}
                {new Date(trip.startDate.seconds * 1000).toLocaleDateString()} -{" "}
                {new Date(trip.endDate.seconds * 1000).toLocaleDateString()}
              </p>
              <p>
                <strong>Participants:</strong> {trip.participants.join(", ")}
              </p>
              {/* Add more trip details as needed */}
              {/* Example: Link to trip details page */}
              {/* <a href={`/trip-details/${trip.id}`}>View Details</a> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
