import React, { useState } from "react";
import { MapPin, Clock } from "lucide-react";
import styles from "./TripSummary.module.css";

const TripSummary = () => {
  const [activeDay, setActiveDay] = useState(0); // Current active day
  const [direction, setDirection] = useState("none"); // Animation direction

  const tripDates = [
    { day: "Mon", date: "19" },
    { day: "Tue", date: "20" },
    { day: "Wed", date: "21" },
    { day: "Thu", date: "22" },
    { day: "Fri", date: "23" },
  ];

  const travelInfo = [
    { start: "Kuala Lumpur", end: "Kuantan", method: "car" },
    { start: "Kuantan", end: "Terengganu", method: "bus" },
    { start: "Terengganu", end: "Langkawi", method: "ferry" },
    { start: "Langkawi", end: "Penang", method: "plane" },
    { start: "Penang", end: "Kuala Lumpur", method: "car" },
  ];

  const highlightsByDay = [
    [
      {
        title: "Hiking to Rainbow Falls",
        location: "Sungai Lembing, Pahang",
        time: "2pm",
        duration: "3 Hours",
        image: "../src/assets/dummy-image.jpg",
      },
      {
        title: "Watersport at Cherating",
        location: "Pantai Cherating, Pahang",
        time: "5pm",
        duration: "2 Hours",
        image: "../src/assets/dummy-image.jpg",
      },
    ],
    [
        {
          title: "Hiking to Rainbow Falls",
          location: "Sungai Lembing, Pahang",
          time: "2pm",
          duration: "3 Hours",
          image: "../src/assets/dummy-image.jpg",
        },
        {
          title: "Watersport at Cherating",
          location: "Pantai Cherating, Pahang",
          time: "5pm",
          duration: "2 Hours",
          image: "../src/assets/dummy-image.jpg",
        },
      ],
      [
        {
          title: "Hiking to Rainbow Falls",
          location: "Sungai Lembing, Pahang",
          time: "2pm",
          duration: "3 Hours",
          image: "../src/assets/dummy-image.jpg",
        },
        {
          title: "Watersport at Cherating",
          location: "Pantai Cherating, Pahang",
          time: "5pm",
          duration: "2 Hours",
          image: "../src/assets/dummy-image.jpg",
        },
      ],
      [
        {
          title: "Hiking to Rainbow Falls",
          location: "Sungai Lembing, Pahang",
          time: "2pm",
          duration: "3 Hours",
          image: "../src/assets/dummy-image.jpg",
        },
        {
          title: "Watersport at Cherating",
          location: "Pantai Cherating, Pahang",
          time: "5pm",
          duration: "2 Hours",
          image: "../src/assets/dummy-image.jpg",
        },
      ],
      [
        {
          title: "Hiking to Rainbow Falls",
          location: "Sungai Lembing, Pahang",
          time: "2pm",
          duration: "3 Hours",
          image: "../src/assets/dummy-image.jpg",
        },
        {
          title: "Watersport at Cherating",
          location: "Pantai Cherating, Pahang",
          time: "5pm",
          duration: "2 Hours",
          image: "../src/assets/dummy-image.jpg",
        },
      ],
    // Add more highlights as per your data
  ];

  const handleDayChange = (index) => {
    if (index > activeDay) {
      setDirection("slide-left"); // Slide to the left
    } else {
      setDirection("slide-right"); // Slide to the right
    }

    setTimeout(() => {
      setActiveDay(index);
      setDirection("none"); // Reset animation state after transition
    }, 300); // Matches the CSS transition duration
  };

  return (
    <div className={styles.container}>
      {/* Date Selection Section */}
      <div className={styles.dateContainer}>
        {tripDates.map((date, index) => (
          <div
            key={date.day}
            className={`${styles.dateItem} ${
              activeDay === index
                ? styles.dateItemActive
                : styles.dateItemInactive
            }`}
            onClick={() => handleDayChange(index)}
          >
            <span className={styles.dateDay}>{date.day}</span>
            <span className={styles.dateNumber}>{date.date}</span>
          </div>
        ))}
      </div>

      {/* Day & Travel Section */}
      <div
  className={`${styles.dayTravelContainer} ${styles[direction]}`}
>
  <div className={styles.dayIndicator}>
    <span className={styles.dayNumber}>Day {activeDay + 1}</span>
  </div>
  <div className={styles.travelCard}>
    <div className={styles.travelPath}>
      <span className={styles.locationName}>
        {travelInfo[activeDay].start}
      </span>
      <div className={styles.travelDash}>
        <span className={styles.travelIcon}>
          {travelInfo[activeDay].method === "car" && "🚗"}
          {travelInfo[activeDay].method === "bus" && "🚌"}
          {travelInfo[activeDay].method === "ferry" && "⛴"}
          {travelInfo[activeDay].method === "plane" && "✈️"}
        </span>
      </div>
      <span className={styles.locationName}>
        {travelInfo[activeDay].end}
      </span>
    </div>
  </div>
</div>
      {/* Highlights Section */}
      <div className={`${styles.highlightsContainer} ${styles[direction]}`}>
        <h2 className={styles.highlightsTitle}>Highlights</h2>
        <div className={styles.highlightsList}>
          {highlightsByDay[activeDay].map((highlight, index) => (
            <div key={index} className={styles.highlightItem}>
              <div className={styles.highlightContent}>
                <h3 className={styles.highlightName}>{highlight.title}</h3>
                <div className={styles.highlightDetails}>
                  <div className={styles.infoRow}>
                    <MapPin size={16} className={styles.icon} />
                    <span className={styles.infoText}>{highlight.location}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <Clock size={16} className={styles.icon} />
                    <span className={styles.infoText}>{highlight.time}</span>
                    <span className={styles.divider}>•</span>
                    <span className={styles.infoText}>
                      {highlight.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.imageContainer}>
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripSummary;