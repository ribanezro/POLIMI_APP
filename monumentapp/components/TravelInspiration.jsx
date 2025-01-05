import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const TravelInspiration = () => {
  const inspiration = {
    title: 'Explore the beauty of Santorini, Greece',
    imageUrl: 'https://example.com/santorini.jpg', // Replace with a real URL or local image
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{inspiration.title}</Text>
      <Image
        source={{ uri: inspiration.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
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
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
});

export default TravelInspiration;