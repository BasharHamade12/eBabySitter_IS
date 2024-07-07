import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ActivityIndicator, Image, Text } from 'react-native';
import { Button, Appbar, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.43.173:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Logged in successfully');
        // Save the email to AsyncStorage
        await AsyncStorage.setItem('userEmail', email);
        navigation.navigate('Main');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#5f5c95', '#5f5c95', '#C8B9DB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Image
          source={{ uri: 'Capture.png' }} // Replace with your logo URL or local image
          style={styles.logo}
        />
        <Text style={styles.title}>Log In</Text>
      </View>
      <View style={styles.content}>
        <Card style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { marginBottom: 0 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Log In
          </Button>
        </Card>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100, // Adjust margin top for the title container
    marginBottom: 20, // Adjust margin bottom as per your design
  },
  logo: {
    width: 70, // Adjust logo size as per your design
    height: 70, // Adjust logo size as per your design
    marginRight: 10,
  },
  title: {
    fontSize: 28, // Adjust title font size as per your design
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: 'transparent', // No background color for the card
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF', // Input background color
  },
  button: {
    backgroundColor: '#5f5c95', // Adjust background color for the button
    paddingVertical: 15, // Adjust padding as per your design
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20, // Adjust margin top as per your design
  },
});

export default LoginScreen;
