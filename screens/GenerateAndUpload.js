import React, { useState, useRef } from 'react';
import axios from 'axios';

const RecordAndUpload = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [message, setMessage] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        setMessage('');
        setIsRecording(true);
    
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          mediaRecorder.start();
        } catch (err) {
          console.error(err);
          setMessage('Error accessing microphone.');
          setIsRecording(false);
        }
      };
    
      const stopRecording = async () => {
        setIsRecording(false);
        const mediaRecorder = mediaRecorderRef.current;
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                audioChunksRef.current = [];
    
                try {
                    const base64String = await convertAudioToBase64(audioBlob);
                    console.log('Base64 String:', base64String);
    
                    // Send the Base64 string to Flask server
                    const response = await fetch('http://192.168.43.173:5000/upload-audio', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ audioData: base64String }),
                    });
    
                    if (!response.ok) {
                        throw new Error('Failed to upload audio');
                    }
    
                    const responseData = await response.json();
                    console.log('Response from server:', responseData);
                } catch (error) {
                    console.error('Error uploading audio:', error);
                }
            };
        }
    };
    
    
      const convertAudioToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('No file provided');
                return;
            }

            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };

            reader.onerror = (error) => {
                reject('Error reading file: ' + error);
            };

            reader.readAsDataURL(file);
        });
      };
    
      const uploadAudio = async (audioBlob) => {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64String = reader.result.split(',')[1];
    
            const response = await axios.post('http://192.168.43.173:5000/upload', { audio: base64String }, {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              }
            });
    
            setMessage(response.data.message);
          };
        } catch (error) {
          console.error(error);
          setMessage('File upload failed.');
        }
      };
    

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RecordAndUpload;