import React, { useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, Button, Picker, Text, TextInput, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, Appbar, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const App = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [faceStatus, setFaceStatus] = useState(true);
  const timeoutRef = useRef(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [listenAudio, setListenAudio] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:3000/api/face-status');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('Face Status:', data);
          
          if (data === false) {
            if (!timeoutRef.current) {
              timeoutRef.current = setTimeout(() => {
                sendEmailAlert();
              }, 60000);
            }
          } else {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
          setFaceStatus(data);
        } catch (error) {
          console.error('Error fetching face status:', error);
        }
      }, 5000);
      return () => clearInterval(interval);
    };
    fetchData();
    return () => {};
  }, [faceStatus]);
  
  const sendEmailAlert = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: userEmail,
          subject: 'Alert: Baby Not Detected',
          text: 'The baby has not been detected for 30 seconds.',
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  useEffect(() => {
    if (audioChunks.length > 0 && audioContext) {
      const playAudioChunks = async () => {
        for (const buffer of audioChunks) {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
          await new Promise((resolve) => {
            source.onended = resolve;
          });
        }
        setAudioChunks([]);
      };
      playAudioChunks();
    }
  }, [audioChunks, audioContext]);

  const toggleCameraOn = async () => {
    try {
      const response = await fetch('http://192.168.43.173:5000/api/show-camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ show_camera: true }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } 
      console.log("showing camera")
      setShowCamera(true);
    } catch (error) {
      console.error('Error turning on camera:', error);
    }
  };

  const toggleCameraOff = async () => {
    try {
      const response = await fetch('http://192.168.43.173:5000/api/turn-off-camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setShowCamera(false);
    }
    catch (error) {
      console.error('Error turning off camera:', error);
    }
  };

  const startAudioDetection = async () => {
    try {
      const response = await fetch('http://192.168.43.173:5000/api/start-audio-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setListenAudio(true);
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error starting audio detection:', error);
    }
  };

  const stopAudioDetection = async () => {
    try {
      const response = await fetch('http://192.168.43.173:5000/api/stop-audio-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setListenAudio(false);
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error stopping audio detection:', error);
    }
  };

  return (
    <PaperProvider>
      <LinearGradient
        colors={['#5f5c95', '#FFFFFF', '#5f5c95']}
        style={styles.container}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <View style={styles.titleContainer}>
          <Image
            source={{ uri: 'Capture.png' }} // Replace with your logo URL or local image
            style={styles.logo}
          />
          <Text style={styles.title}>Monitoring</Text>
        </View>
        <View style={styles.cameraWrapper}>
          <View style={styles.cameraHeader}>
            <Text style={styles.dateTimeText}>{dateTime.toLocaleString()}</Text>
          </View>
          {showCamera && <Image source={{ uri: 'http://192.168.43.173:5000/api/camera-feed' }} style={styles.cameraFeed} />}
          <View style={styles.cameraFooter}>
            <Text style={styles.liveText}>
              Live <Text style={styles.redDot}>●</Text>
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonLarge} onPress={toggleCameraOn} disabled={showCamera}>
            <Text style={styles.buttonText}>Turn On Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLarge} onPress={toggleCameraOff} disabled={!showCamera}>
            <Text style={styles.buttonText}>Turn Off Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLarge} onPress={startAudioDetection} disabled={listenAudio}>
            <Text style={styles.buttonText}>Start Audio Detection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLarge} onPress={stopAudioDetection} disabled={!listenAudio}>
            <Text style={styles.buttonText}>Stop Audio Detection</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cameraWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 10,
    padding: 10,
    position: 'relative',
  },
  cameraHeader: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#000000',
  },
  cameraFeed: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    zIndex: 1,
  },
  liveText: {
    fontSize: 16,
    color: '#000000',
  },
  redDot: {
    color: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  buttonLarge: {
    backgroundColor: 'transparent',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default App;
