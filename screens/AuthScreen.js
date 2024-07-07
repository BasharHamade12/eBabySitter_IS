// screens/AuthScreen.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

function AuthScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Log In" onPress={() => navigation.navigate('Login')} />
      <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthScreen;
