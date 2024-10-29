import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const SampleMap = () => {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerClassName='map'
        mapContainerStyle={{ height: "100%", width: "100%" }}
        center={{ lat: 13.7563, lng: 100.5018 }} // Example: Bangkok
        zoom={10}
      >
        {/* Markers can go here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default SampleMap;