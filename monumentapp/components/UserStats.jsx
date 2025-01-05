import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserStats = () => {
  const stats = {
    monumentsVisited: 45,
    countriesVisited: 12,
    mostVisitedCountry: 'Italy',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Stats</Text>
      <Text style={styles.stat}>Monuments Visited: {stats.monumentsVisited}</Text>
      <Text style={styles.stat}>Countries Visited: {stats.countriesVisited}</Text>
      <Text style={styles.stat}>Most Visited Country: {stats.mostVisitedCountry}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stat: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default UserStats;