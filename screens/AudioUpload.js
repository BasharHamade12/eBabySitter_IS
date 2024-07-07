import React, { useState } from 'react';

const AudioFileInput = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFileError('No file selected');
      return;
    }
    if (file.type !== 'audio/mpeg' && file.type !== 'audio/wav') {
      setFileError('Only MP3 and WAV files are supported');
      return;
    }
    setSelectedFile(file);
    setFileError(null);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('http://192.168.43.173:5000/save', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
        } else {
          console.log(`File uploaded successfully: ${data.filename}`);
          setSelectedFile(null); // Reset selected file after successful upload
        }
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div style={styles.container}>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && (
        <div style={styles.fileInfo}>
          <p>Selected file: {selectedFile.name}</p>
          <button style={styles.uploadButton} onClick={handleUpload}>Upload file</button>
        </div>
      )}
      {fileError && <p style={styles.errorText}>{fileError}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    textAlign: 'center',
  },
  fileInfo: {
    marginTop: '20px',
  },
  uploadButton: {
    backgroundColor: '#6a1b9a',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
  },
};

export default AudioFileInput;
