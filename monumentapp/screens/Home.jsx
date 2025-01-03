import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>
      <Text style={styles.subtitle}>Explore the features below:</Text>

      {/* Example buttons for navigation */}
      <Button 
        title="Go to Profile" 
        onPress={() => navigation.navigate('Profile')} 
        color="#007BFF"
      />
      <Button 
        title="View Settings" 
        onPress={() => navigation.navigate('Settings')} 
        color="#28A745"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
});

export default Home;