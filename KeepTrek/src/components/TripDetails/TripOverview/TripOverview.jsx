import React from 'react';
import { Card } from '../Card/Card.jsx';
import styles from './TripOverview.module.css';

const TripOverview = ({ 
    title = "East Coast Road-Trip",
    dateRange = "19 June 2024 to 23 June 2024",
    backgroundImage = "../src/assets/dummy-image.jpg",
    id = ""
  }) => {
    return (
      <div className={styles.container} id={id}>
        {/* Background Image Card */}
        <Card className={styles.backgroundCard}>
          <img
            src={backgroundImage}
            alt="Trip banner"
            className={styles.backgroundImage}
          />
          <div className={styles.gradientOverlay} />
        </Card>
  
        {/* Info Overlay Card */}
        <Card className={styles.infoCard}>
          <h2 className={styles.title}>
            {title}
          </h2>
          <p className={styles.dateRange}>
            {dateRange}
          </p>
        </Card>
      </div>
    );
  };

export default TripOverview;