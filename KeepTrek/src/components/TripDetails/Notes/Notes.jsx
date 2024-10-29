import React from 'react';
import './Notes.css'

const Notes = () => {
  return (
    <div className="notes">
      <h3>Notes</h3>
      <textarea placeholder="Write or paste anything here." />
    </div>
  );
};

export default Notes;