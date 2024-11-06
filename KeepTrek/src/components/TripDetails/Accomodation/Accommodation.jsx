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
            src="/api/placeholder/24/24"
            alt="Google Maps Icon"
            className="maps-icon"
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
      hotelName: "Swiss-Belhotel Kuantan",
      address: "1, Jalan Tanjung Lumpur, Tanjung Lumpur, 26060 Kuantan, Pahang",
      checkInDate: "19 June",
      checkOutDate: "21 June 2024",
      checkInTime: "3:00pm",
      checkOutTime: "12:00pm",
      nights: "2",
      bookedWith: "Agoda"
    },
    {
      hotelName: "CiptaRase Homestay",
      address: "14, Jalan Sultan Zainal, Kampung Kapur, 20000 Kuala Terengganu, Terengganu",
      checkInDate: "21 June",
      checkOutDate: "23 June 2024",
      checkInTime: "3:00pm",
      checkOutTime: "12:00pm",
      nights: "2",
      bookedWith: "Airbnb"
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