import React, { useState } from "react";
import { MapPin, Clock } from "lucide-react";
import styles from "./TripSummary.module.css";

const TripSummary = () => {
  const [activeDay, setActiveDay] = useState(0); // Current active day
  const [direction, setDirection] = useState("none"); // Animation direction

  const tripDates = [
    { day: "Wed", date: "15" },
    { day: "Thu", date: "16" },
    { day: "Fri", date: "17" },
  ];

  const travelInfo = [
    { start: "Penang Mainland", end: "Penang Island", method: "car" },
    { start: "Penang Island", end: "Penang Island", method: "car" },
    { start: "Penang Island", end: "Kuala Lumpur", method: "car" },
  ];

  const highlightsByDay = [
    [
      {
        title: "Hameediyah Restuarant",
        location: "Lebuh Campbell, George Town",
        time: "1:30pm",
        duration: "1 Hour",
        image: "https://lh3.googleusercontent.com/places/ANXAkqEU-ovyGrTomLZ6KQIj3jWSkyKonP156QhPNVeZEmV9455sX0j18kHqgcWp3zyzE_PDafsc9cmnaoarFBIdV9Q3PWNwdBZyBDM=s4800-h405",
      },
      {
        title: "Penang War Museum",
        location: "Jalan Batu Muang, Batu Maung",
        time: "3pm",
        duration: "1 Hour",
        image: "https://lh3.googleusercontent.com/places/ANXAkqFglbmn8HSYBiXAaq-lR6GnuIACvHKoUS8I1uzHXgd7MiDXwlVE6FPvx5dOCA0631skmLqZ6OVTz-FQooiRwOT5VTs1o03y6fg=s4800-h1920",
      },
    ],
    [
        {
          title: "Tiger Char Koay Teow",
          location: "Lebuh Carnarvon, George Town",
          time: "11:15am",
          duration: "1.5 Hours",
          image: "https://lh3.googleusercontent.com/places/ANXAkqF_p2CwQ--T30AhhFw8tFsvcIwfylu5XqFPp1xJq0hL7QPVw3Wjiivf-ga4qeLOnadV5b8FVg_8Mtzhccdv6dRXL36M9cSUhJU=s4800-h1920",
        },
        {
          title: "Jerejak Island",
          location: "Jerejak Island, Penang",
          time: "4pm",
          duration: "2 Hours",
          image: "https://lh3.googleusercontent.com/places/ANXAkqH4Dc4E4v1gjpn_nbpI0X-8N7KxPpF0JEqj9uLUARicv0XjtHBENQJG66M1XjBuMX6Pil1eUhCgtM4oByaiQY6aVWnEz5d2crQ=s4800-h1920",
        },
      ],
      [
        {
          title: "ESCAPE Penang",
          location: "Teluk Bahang, Tanjung Bungah",
          time: "10:30am",
          duration: "6 Hours",
          image: "https://lh3.googleusercontent.com/places/ANXAkqF38RiPSE1PxzwSZalRjNtRqHFbd2tP-686HLI-MVqarZbghei3gKSL_4epXcNc-PsO18z1z0-PP1uafgBgSeU_XA5DXxqnwrg=s4800-h1301",
        },
        {
          title: "Presgrave Street Hawker Centre",
          location: "Lebuh Presgrave, George Town",
          time: "7pm",
          duration: "2 Hours",
          image: "https://lh3.googleusercontent.com/places/ANXAkqHvvGU34N9eywKjyDyYlQ0qvyJgR0Ez1sFWizAYe1GQvMuSohKJsa7sncqSkrGI7_izMYkKdEWKME5m06ZtiFiQc4OVZVC-BzQ=s4800-h1920",
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