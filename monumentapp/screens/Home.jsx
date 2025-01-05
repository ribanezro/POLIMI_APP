import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View } from 'react-native';
import UserStats from '../components/UserStats';
import RecentActivities from '../components/RecentActivities';
import BucketListTeaser from '../components/BucketListTeaser';
import TravelInspiration from '../components/TravelInspiration';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      <UserStats />
      <BucketListTeaser />
      <TravelInspiration />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});

export default Home;