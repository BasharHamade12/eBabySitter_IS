import React from 'react';
import { View, StyleSheet, Text, Image, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from 'react-native-paper';

const AlertScreen = ({ route }) => {
  const { alerts } = route.params;

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.alertText}>{item.message}</Text>
    </Card>
  );

  return (
    <LinearGradient
      colors={['#5f5c95', '#5f5c95', '#C8B9DB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Image
            source={{ uri: 'Capture.png' }} // Replace with your logo URL or local image
            style={styles.logo}
          />
          <Text style={styles.title}>Alerts</Text>
        </View>
        <FlatList
          data={alerts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  alertText: {
    fontSize: 16,
    color: '#333',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  list: {
    width: '100%',
  },
});

export default AlertScreen;
