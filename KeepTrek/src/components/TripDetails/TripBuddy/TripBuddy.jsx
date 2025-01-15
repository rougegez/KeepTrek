import React from 'react';
import styles from './TripBuddy.module.css';
import { Plus } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';

const TripBuddy = () => {
  const buddies = [
    { name: 'kyle', image: '../src/assets/buddyicon.svg'},
    { name: 'bryan', image: '../src/assets/buddyicon.svg'},
    { name: 'John', image: '../src/assets/buddyicon.svg'},
    { name: 'JimGym', image: '../src/assets/buddyicon.svg'},
    { name: 'SamAlt', image: '../src/assets/buddyicon.svg'},
    { name: 'ahmad', image: '../src/assets/buddyicon.svg'},
    { name: 'akmal', image: '../src/assets/buddyicon.svg'},
    { name: 'Melanie', image: '../src/assets/buddyicon.svg'},
    /* Ideally would want to use a null value for default profile pic to save
    space in database, put the default in local*/
  ];

  return (
    <section className={styles.tripBuddy}>
      <div className={styles.buddyHeaderContainer}>
        <h2 className={styles.buddyTitle}>Trip Buddy</h2>
        <Button className="" aria-label="Add buddy" size="icon"><Plus/></Button>
      </div>
      <ul className={styles.buddyList}>
        {buddies.map((buddy, index) => (
          <li key={index} className={styles.buddyItem}>
            <img src={buddy.image} alt={buddy.name} className={styles.buddyImage} />
            <span className={styles.buddyName}>{buddy.name}</span>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Ellipsis />
            </Button>
          </li>
        ))}
      </ul>
    </section >
  );
};

export default TripBuddy;