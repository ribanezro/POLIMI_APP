import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView, Text  } from 'react-native';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import CountrySection from '../components/CountrySection';
import { COLORS } from '../constants/theme';
import { MonumentsListByCountry } from '../services/Monuments';

const CountryMonuments = () => {
  const [monumentsByCountry, setMonumentsByCountry] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        const data = await MonumentsListByCountry();
        setMonumentsByCountry(data);
      } catch (error) {
        console.error('Error fetching monuments:', error);
        Alert.alert('Error', 'Failed to load monuments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMonuments();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Monuments...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>MonuMe Monuments</Text>
      <ScrollView>
        {Object.entries(monumentsByCountry).map(([country, monuments]) => (
          <CountrySection key={country} country={country} monuments={monuments} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.tertiary,
    marginBottom: 25,
    marginTop: 10,
  },
});

export default CountryMonuments;