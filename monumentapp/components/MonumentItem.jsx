import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MonumentItem = ({ monument }) => {
  const navigation = useNavigation(); // Hook to navigate

  const handlePress = () => {
    navigation.navigate('PlaceDetails', { place: monument.id }); // Navigate to PlaceDetails with monument data
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.monumentContainer}>
      <Text
        style={[
          styles.monumentName,
          monument.visited && styles.visitedMonument,
        ]}
      >
        {monument.name}
      </Text>
      {monument.visited && <Ionicons name="checkmark" style={styles.tick} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  monumentContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monumentName: {
    fontSize: 20,
    color: '#555',
  },
  visitedMonument: {
    fontWeight: 'bold',
    color: '#1e90ff', // Highlight color for visited monuments
  },
  tick: {
    fontSize: 20,
    color: '#1e90ff', // Color for tick
  },
});

export default MonumentItem;