import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, Appbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

function MonitoringScreen({ navigation }) {
  const [showCamera, setShowCamera] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      await toggleCameraOn(); // Automatically turn on the camera when component mounts
    };
    fetchData();

    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval); // Clean up function
    };
  }, []);

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
      setShowCamera(true);
    } catch (error) {
      console.error('Error turning on camera:', error);
    }
  };

  const toggleCameraOff = async () => {
    try {
      const response = await fetch('http://192.168.43.173:5000/api/show-camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ show_camera: false }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setShowCamera(false);
    } catch (error) {
      console.error('Error turning off camera:', error);
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
        </View>
      </LinearGradient>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default MonitoringScreen;
