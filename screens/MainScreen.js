import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faVideo, faMusic, faCog, faBell } from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';

function MainScreen({ navigation }) {
  const [alerts, setAlerts] = useState([
    { id: '1', message: 'The baby was crying !' },
    { id: '2', message: 'The baby cannot be seen on screen !' },
    { id: '3', message: 'The baby was crying !' },
  ]);

  return (
    <LinearGradient
      colors={['#5f5c95', '#5f5c95', '#808080']}
      style={styles.container}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0, 0.6, 1]}
    >
      <View style={styles.titleContainer}>
        <Image
          source={{ uri: 'Capture.png' }} // Replace with your logo URL or local image
          style={styles.logo}
        />
        <Text style={styles.title}>eBabySitter</Text>
      </View>
      <View style={styles.line} />
      <View style={styles.menu}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.buttonLarge} onPress={() => navigation.navigate('MainPage')}>
            <FontAwesomeIcon icon={faVideo} size={60} color="#FFFFFF" />
            <Text style={styles.buttonText}>LIVE Monitoring</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLarge} onPress={() => navigation.navigate('PlaySendAudio')}>
            <FontAwesomeIcon icon={faMusic} size={60} color="#FFFFFF" />
            <Text style={styles.buttonText}>Play & Send Audio</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.buttonLarge} onPress={() => navigation.navigate('Alert', { alerts })}>
            <FontAwesomeIcon icon={faBell} size={60} color="#FFFFFF" />
            <Text style={styles.buttonText}>Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonLarge} onPress={() => navigation.navigate('Settings')}>
            <FontAwesomeIcon icon={faCog} size={60} color="#FFFFFF" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  line: {
    width: '80%',
    height: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  menu: {
    width: '100%', // Expand to full width
    paddingHorizontal: 20, // Add padding for spacing
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  buttonLarge: {
    backgroundColor: 'transparent',
    paddingVertical: 40, // Increased vertical padding for taller buttons
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
});

export default MainScreen;
