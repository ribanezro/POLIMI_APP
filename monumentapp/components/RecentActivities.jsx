import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const RecentActivities = () => {
  const activities = [
    { id: '1', title: 'Visited Eiffel Tower, Paris' },
    { id: '2', title: 'Explored Colosseum, Rome' },
    { id: '3', title: 'Walked through Central Park, NYC' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.activity}>{item.title}</Text>}
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
  activity: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default RecentActivities;