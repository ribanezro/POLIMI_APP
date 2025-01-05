import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BucketListTeaser = () => {
  const bucketList = ['Machu Picchu', 'Great Wall of China', 'Grand Canyon'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bucket List</Text>
      {bucketList.map((item, index) => (
        <Text key={index} style={styles.item}>
          - {item}
        </Text>
      ))}
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
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default BucketListTeaser;