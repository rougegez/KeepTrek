import React from 'react';
import { MapPin, Calendar, Clock, PencilLine, Trash2 } from 'lucide-react';
import './Accommodation.css';

const AccommodationCard = ({ 
  hotelName, 
  address, 
  checkInDate, 
  checkOutDate, 
  checkInTime, 
  checkOutTime,
  nights,
  bookedWith,
  onEdit,
  onDelete
}) => {
  return (
    <div className="accommodation-card">
      <div className="card-header">
        <h3 className="hotel-name">{hotelName}</h3>
        <div className="action-buttons">
          <button 
            onClick={onEdit}
            className="edit-button"
          >
            <PencilLine size={20} />
          </button>
          <button 
            onClick={onDelete}
            className="delete-button"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="address-container">
        <MapPin size={20} className="icon" />
        <span className="address">
          {address}
          <img 
            src="../src/assets/google.png"
            alt="Google Maps Icon"
            className="ml-2 size-5"
          />
        </span>
      </div>

      <div className="date-info">
        <div className="date-container">
          <Calendar size={20} />
          <span>{checkInDate} - {checkOutDate}</span>
        </div>
        <div className="nights-container">
          <Clock size={20} />
          <span>{nights} Nights</span>
        </div>
      </div>

      <div className="booking-details">
        <div className="check-times">
          <span>Check-in: {checkInTime}</span>
          <span className="separator">|</span>
          <span>Check-out: {checkOutTime}</span>
        </div>
        <div className="booking-info">
          <span>Booked with: {bookedWith}</span>
          <button className="details-button">
            Booking Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Accommodation = () => {
  const accommodations = [
    {
      hotelName: "Jazz Hotel Penang",
      address: "1, Jalan Seri Tg Pinang, Seri Tanjung Pinang, 10470 Tanjung Tokong, Pulau Pinang, Malaysia",
      checkInDate: "15 January 2025",
      checkOutDate: "16 January 2025",
      checkInTime: "9:00pm",
      checkOutTime: "12:00pm",
      nights: "1",
      bookedWith: "Agoda"
    },
    {
      hotelName: "Kimberly Hotel Georgetown",
      address: "36 G-01, Jalan Sungai Ujong, George Town, 10100 George Town, Pulau Pinang, Malaysia",
      checkInDate: "16 January 2025",
      checkOutDate: "17 Januaray 2025",
      checkInTime: "9:00 pm",
      checkOutTime: "12:00 pm",
      nights: "1",
      bookedWith: "Booking.com"
    }
  ];

  return (
    <div className="accommodation-container">
      <h2 className="section-title">Accommodation</h2>
      {accommodations.map((accommodation, index) => (
        <AccommodationCard 
          key={index}
          {...accommodation}
          onEdit={() => console.log('Edit accommodation:', accommodation.hotelName)}
          onDelete={() => console.log('Delete accommodation:', accommodation.hotelName)}
        />
      ))}
    </div>
  );
};

export default Accommodation;