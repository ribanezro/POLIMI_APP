import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MonumentItem from './MonumentItem';
import { countryCodeMap } from '../scripts/countryCodeMapping';
import { flagMap } from '../data/flagmap';

const CountrySection = ({ country, monuments }) => {
  // Get the two-letter code for the country
  const countryCode = countryCodeMap[country]?.toLowerCase();

  let header = country;

  // Resolve the flag
  const flag = countryCode && flagMap[countryCode];
  
  if (country === "") {
    header = "Rest of the World";
  }


  return (
    <View style={styles.countrySection}>
      {/* Country Header */}
      <View style={styles.countryHeader}>
        {flag && <Image source={flag} style={styles.flag} />}
        <Text style={styles.countryName}>{header}</Text>
      </View>

      {/* Monuments List */}
      {monuments.map((monument) => (
        <MonumentItem key={monument.id} monument={monument} />
      ))}

      {/* Separator */}
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  countrySection: {
    marginBottom: 20,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  countryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  flag: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginTop: 10,
  },
});

export default CountrySection;