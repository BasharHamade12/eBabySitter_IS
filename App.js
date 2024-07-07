import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainScreen from './screens/MainScreen';
import MonitoringScreen from './screens/MonitoringScreen';
import AuthScreen from './screens/AuthScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AlertScreen from './screens/AlertScreen';  // Import AlertScreen
import PlaySendAudioScreen from './screens/PlaySendAudioScreen'; // Import PlaySendAudioScreen

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const checkUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        setUserEmail(email);
      } catch (error) {
        console.error('Failed to load user email from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserEmail();
  }, []);

  if (isLoading) {
    return null; // You can replace this with a loading spinner if desired
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userEmail ? 'Main' : 'Auth'}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Monitoring" component={MonitoringScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Alert" component={AlertScreen} /> 
        <Stack.Screen name="PlaySendAudio" component={PlaySendAudioScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
