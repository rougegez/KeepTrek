import React, { useState } from 'react';
import './Attachments.css'

const Attachments = () => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  return (
    <div className="attachments">
      <h3>Attachments</h3>
      <input type="file" multiple onChange={handleFileUpload} />
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Attachments;