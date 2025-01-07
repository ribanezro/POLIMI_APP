import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons like star and heart
import { COLORS } from '../constants/theme';

const PlaceDetails = ({ route, navigation }) => {
  const { place } = route.params; // Get place details from navigation params

  console.log('Place:', place);

  // Process image_url to remove unwanted substring
  const processedImageUrl = place.image_url.replace(
    /places\/.*?\/photos\//,
    ''
  );

  console.log('Processed Image URL:', processedImageUrl);

  const handleAddVisit = () => {
    navigation.navigate('AddVisit', {
      placeId: place.id,
      placeName: place.name,
    });
  };

  const handleAddToFavorites = () => {
    Alert.alert(
      'Add to Favorites',
      `You have added "${place.name}" to your favorites!`,
      [{ text: 'OK', onPress: () => console.log(`Favorited: ${place.name}`) }]
    );
  };

  const openInGoogleMaps = () => {
    const [latitude, longitude] = place.coordinates.split(',');
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Failed to open Google Maps')
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Place Image */}
      {processedImageUrl ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: processedImageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Go Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.goBackButton}
          >
            <FontAwesome name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      )}

      <ScrollView>
        {/* Place Title and Rating */}
        <View style={styles.header}>
          <Text style={styles.title}>{place.name}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={20} color={COLORS.gold} />
            <Text style={styles.rating}>{place.rating ? place.rating : 'N/A'}</Text>
            <TouchableOpacity onPress={handleAddToFavorites} style={styles.favorites}>
              <FontAwesome name="heart" size={24} color={COLORS.gold} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        {place.description && (
          <Text style={styles.description}>{place.description}</Text>
        )}

        {/* Address */}
        {place.address && (
          <TouchableOpacity onPress={openInGoogleMaps}>
            <Text style={styles.address}>
              <FontAwesome name="map-marker" size={22} color={COLORS.secondary} />{' '}
              {place.address}
            </Text>
          </TouchableOpacity>
        )}

        {/* Add Visit Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddVisit}>
          <Text style={styles.addButtonText}>Add Visit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 325,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  goBackButton: {
    position: 'absolute',
    top: 50, // Adjust based on SafeAreaView
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    borderRadius: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImage: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  noImageText: {
    color: '#888',
    fontSize: 16,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.tertiary,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 18,
    color: COLORS.gold,
    marginLeft: 5,
  },
  favorites: {
    marginLeft: 'auto',
  },
  description: {
    fontSize: 16,
    margin: 20,
    color: '#555',
    lineHeight: 22,
  },
  address: {
    fontSize: 16,
    color: COLORS.tertiary,
    textAlign: 'center',
    marginVertical: 15,
    textDecorationLine: 'underline',
  },
  addButton: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 18,
    color: COLORS.tertiary,
    fontWeight: 'bold',
  },
});

export default PlaceDetails;