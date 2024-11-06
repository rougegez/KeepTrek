import React from 'react';
// import { Card } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import { Card } from '../Card/Card.jsx';
import styles from './TripSummary.module.css';

const TripSummary = () => {
    const tripDates = [
        { day: 'Mon', date: '19', isActive: true },
        { day: 'Tue', date: '20', isActive: false },
        { day: 'Wed', date: '21', isActive: false },
        { day: 'Thu', date: '22', isActive: false },
        { day: 'Fri', date: '23', isActive: false },
    ];

    const mainTravel = {
        from: 'Kuala Lumpur',
        to: 'Kuantan'
    };

    const highlights = [
        {
            title: 'Hiking to Rainbow Falls',
            location: 'Sungai Lembing, Pahang',
            time: '2pm',
            duration: '3 Hours',
            image: '../src/assets/dummy-image.jpg'
        },
        {
            title: 'Watersport at Cherating',
            location: 'Pantai Cherating, Pahang',
            time: '5pm',
            duration: '2 Hours',
            image: '../src/assets/dummy-image.jpg'
        }
    ];

    return (
        <div className={styles.container}>
            {/* Date Selection Section */}
            <div className={styles.dateContainer}>
                {tripDates.map((date) => (
                    <div
                        key={date.day}
                        className={`${styles.dateItem} ${date.isActive ? styles.dateItemActive : styles.dateItemInactive
                            }`}
                    >
                        <span className={styles.dateDay}>{date.day}</span>
                        <span className={styles.dateNumber}>{date.date}</span>
                    </div>
                ))}
            </div>

            {/* Day and Travel Section */}
            <div className={styles.dayTravelSection}>
                <div className={styles.dayIndicator}>
                    <div className={styles.dayNumber}>DAY 1</div>
                </div>

                <Card className={styles.travelCard}>
                    <div className={styles.travelPath}>
                        <span className={styles.locationName}>{mainTravel.from}</span>
                        <div className={styles.travelDash}>
                            <span className={styles.travelIcon}>
                                🚗
                            </span>
                        </div>
                        <span className={styles.locationName}>{mainTravel.to}</span>
                    </div>
                </Card>
            </div>

            {/* Highlights Section */}
            <div>
                <h2 className={styles.highlightsTitle}>Highlights</h2>
                <div className={styles.highlightsGrid}>
                    {highlights.map((highlight, index) => (
                        <Card key={index}>
                            <div className={styles.highlightImageContainer}>
                                <img
                                    src={highlight.image}
                                    alt={highlight.title}
                                    className={styles.highlightImage}
                                />
                            </div>
                            <div className={styles.highlightContent}>
                                <h3 className={styles.highlightTitle}>{highlight.title}</h3>
                                <div className={styles.highlightInfo}>
                                    <span className={styles.iconWrapper}>
                                        <MapPin />
                                    </span>
                                    <span className={styles.highlightText}>{highlight.location}</span>
                                </div>
                                <div className={styles.highlightInfo}>
                                    <span className={styles.iconWrapper}>
                                        <Clock />
                                    </span>
                                    <span className={styles.highlightText}>{highlight.time}</span>
                                    <span className={styles.divider}>•</span>
                                    <span className={styles.highlightText}>{highlight.duration}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TripSummary;