import React from 'react';
import styles from './TripBuddy.module.css';
import { Plus } from "lucide-react";

const TripBuddy = () => {
  const buddies = [
    { name: 'Gan Wei Lee', image: '../src/assets/buddyicon.svg'},
    { name: 'Kyle Goh', image: '../src/assets/buddyicon.svg'},
    { name: 'Bryan Tan', image: '../src/assets/buddyicon.svg'},
    { name: 'Anoop Singh', image: '../src/assets/buddyicon.svg'},
    { name: 'Angie Kwa', image: '../src/assets/buddyicon.svg'}
    /* Ideally would want to use a null value for default profile pic to save
    space in database, put the default in local*/
  ];

  return (
    <section className={styles.tripBuddy}>
      <div className={styles.buddyHeaderContainer}>
        <h2 className={styles.buddyTitle}>Trip Buddy</h2>
        <button className={styles.addBuddyButton} aria-label="Add buddy"><Plus/></button>
      </div>
      <ul className={styles.buddyList}>
        {buddies.map((buddy, index) => (
          <li key={index} className={styles.buddyItem}>
            <img src={buddy.image} alt={buddy.name} className={styles.buddyImage} />
            <span className={styles.buddyName}>{buddy.name}</span>
            <button className={styles.buddyAction}>
              <img src='../src/assets/more.svg' alt="Action" className={styles.actionIcon} />
            </button>
          </li>
        ))}
      </ul>
    </section >
  );
};

export default TripBuddy;