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
            <div className={styles.highlightsContainer}>
                <h2 className={styles.highlightsTitle}>Highlights</h2>
                <div className={styles.highlightsList}>
                    {highlights.map((highlight, index) => (
                        <React.Fragment key={index}>
                            <div className={styles.highlightItem}>
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
                                            <span className={styles.infoText}>{highlight.duration}</span>
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
                            {index < highlights.length - 1 && <div className={styles.separator} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TripSummary;