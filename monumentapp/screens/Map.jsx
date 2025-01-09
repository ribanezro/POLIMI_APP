import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
    TouchableOpacity,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { COLORS } from "../constants/theme";
import { monumentsList } from "../services/Monuments";

const MapScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to view the map."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      };
      setRegion(userLocation);

      try {
        const data = await monumentsList();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
        Alert.alert("Error", "Failed to fetch places.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const parseCoordinates = (coordinateString) => {
    const [latitude, longitude] = coordinateString.split(",").map(Number);
    return { latitude, longitude };
  };

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
  };

  const closeModal = () => {
    setSelectedPlace(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
        <Text style={styles.loadingText}>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
        >
          {places.map((place) => {
            const coordinates = parseCoordinates(place.coordinates);
            if (!coordinates) return null;

            return (
              <Marker
                key={`${place.id}-${coordinates.latitude}-${coordinates.longitude}`}
                coordinate={coordinates}
                pinColor={COLORS.tertiary}
                onPress={
                  Platform.OS === "android"
                    ? () => handleMarkerPress(place)
                    : undefined
                }
              >
                {Platform.OS === "ios" && (
                  <Callout
                    onPress={() =>
                      navigation.navigate("PlaceDetails", { placeId: place.id })
                    }
                  >
                    <View style={styles.calloutContainer}>
                      <Image
                        source={{
                          uri: place.image_url.replace(
                            /places\/.*?\/photos\//,
                            ""
                          ),
                        }}
                        style={styles.calloutImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.calloutTitle}>{place.name}</Text>
                      <Text style={styles.calloutLocation}>
                        {[place.city, place.country]
                          .filter(Boolean)
                          .join(", ")}
                      </Text>
                      {/* Styled "Tap for details" as a button */}
                      <View style={styles.calloutButton}>
                        <Text style={styles.calloutButtonText}>
                          Tap for details
                        </Text>
                      </View>
                    </View>
                  </Callout>
                )}
              </Marker>
            );
          })}
        </MapView>
      )}

      {/* Modal for Android */}
      {Platform.OS === "android" && selectedPlace && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedPlace}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={{
                  uri: selectedPlace.image_url.replace(
                    /places\/.*?\/photos\//,
                    ""
                  ),
                }}
                style={styles.modalImage}
                resizeMode="cover"
              />
              <Text style={styles.modalTitle}>{selectedPlace.name}</Text>
              <Text style={styles.modalLocation}>
                {[selectedPlace.city, selectedPlace.country]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
              <TouchableOpacity
                style={styles.visitButton}
                onPress={() => {
                  closeModal();
                  navigation.navigate("PlaceDetails", {
                    placeId: selectedPlace.id,
                  });
                }}
              >
                <Text style={styles.visitButtonText}>Visit Page</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.secondary,
  },
  map: {
    flex: 1,
  },
  calloutContainer: {
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  calloutImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  calloutLocation: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 10,
  },
  calloutButton: {
    marginTop: 10,
    backgroundColor: COLORS.tertiary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  calloutButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  modalLocation: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 15,
  },
  visitButton: {
    backgroundColor: COLORS.tertiary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  visitButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default MapScreen;