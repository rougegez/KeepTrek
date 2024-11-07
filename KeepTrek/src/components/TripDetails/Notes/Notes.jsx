import React, { useState, useRef } from 'react';
import styles from './Notes.module.css';
import { Plus } from 'lucide-react'

const Notes = () => {
  const [note, setNote] = useState('');
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setNote(e.target.value);
    autoResizeTextarea();
  };

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to calculate the new scroll height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
    }
  };

  return (
    <div className={styles.noteContainer}>
      <div className={styles.noteHeader}>
        <h2 className={styles.noteTitle}>Notes</h2>
        <button className={styles.addNoteButton}><Plus/></button>
      </div>
      <textarea
        ref={textareaRef}
        className={styles.inputNote}
        placeholder="Type your notes here..."
        value={note}
        onChange={handleInputChange}
        rows="1" // Minimum number of rows
      />
    </div>
  );
};

export default Notes;
