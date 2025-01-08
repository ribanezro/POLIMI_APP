import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import * as ImagePicker from "expo-image-picker";
import { MonumentsListNames } from "../services/Monuments";
import { Ionicons } from "@expo/vector-icons";

const AddVisit = ({ route, navigation }) => {
  const { placeId } = route.params;
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [photo, setPhoto] = useState(null);
  const [monuments, setMonuments] = useState([]);
  const [filteredMonuments, setFilteredMonuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        console.log("Fetching monuments...");
        const fetchedMonuments = await MonumentsListNames();
        setMonuments(fetchedMonuments);

        if (placeId) {
          const matchedMonument = fetchedMonuments.find(
            (monument) => monument.id === placeId
          );
          if (matchedMonument) {
            setSearchText(matchedMonument.name);
            setSelectedPlace(matchedMonument);
          }
        }
      } catch (error) {
        console.error("Error fetching monuments:", error);
        Alert.alert("Error", "Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMonuments();
  }, [placeId]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredMonuments([]);
      setDropdownVisible(false);
    } else {
      const filtered = monuments.filter((monument) =>
        monument.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMonuments(filtered);
      setDropdownVisible(true);
    }
  };

  const handleSelect = (monument) => {
    setSearchText(monument.name);
    setSelectedPlace(monument);
    setDropdownVisible(false);
  };

  const handlePhotoSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets ? result.assets[0].uri : result.uri;
        setPhoto(imageUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
  };

  const handleSubmit = async () => {
    const data = {
      placeId: selectedPlace?.id || placeId,
      placeName: selectedPlace?.name || searchText,
      rating,
      review,
      photo,
    };

    try {
      const response = await axios.post(
        "https://monumentapp-73e8e79b6ee2.herokuapp.com/api/monuments",
        data
      );
      Alert.alert("Success", "Monument added successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding the monument:", error);
      Alert.alert("Error", "Failed to add the monument. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Add a Visit</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a place"
          value={searchText}
          onChangeText={handleSearch}
        />
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <FlatList
              data={filteredMonuments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.dropdownText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {selectedPlace && (
          <View style={styles.visitedContainer}>
            <Text style={styles.visitedText}>You've visited</Text>
            <View style={styles.visitedDetails}>
              <Image
                source={{
                  uri: selectedPlace.image_url.replace(
                    /places\/.*?\/photos\//,
                    ""
                  ),
                }}
                style={styles.visitedImage}
              />
              <View style={styles.visitedTextContainer}>
                <Text style={styles.placeName}>{selectedPlace.name}</Text>
                <Text style={styles.placeLocation}>
                  {selectedPlace.city}, {selectedPlace.country}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rating:</Text>
          <View style={styles.starsContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setRating(index + 1)}
              >
                <Ionicons
                  name="star"
                  size={32}
                  color={index < rating ? "gold" : COLORS.lightGray}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput
          style={styles.textBox}
          placeholder="Write your review"
          value={review}
          onChangeText={setReview}
          multiline
        />

        {photo && (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photoPreview} />
            <TouchableOpacity onPress={handleDeletePhoto}>
              <Ionicons name="trash" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.photoButton} onPress={handlePhotoSelection}>
          <Text style={styles.photoButtonText}>
            {photo ? "Change Photo" : "Add Photo"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Visit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  searchBar: {
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  dropdown: {
    maxHeight: 150,
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dropdownText: {
    color: COLORS.black,
  },
  visitedContainer: {
    marginVertical: 20,
  },
  visitedText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.black,
  },
  visitedDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  visitedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  visitedTextContainer: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  placeLocation: {
    fontSize: 14,
    color: COLORS.gray,
  },
  ratingContainer: {
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  textBox: {
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: COLORS.white,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  photoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  photoButton: {
    backgroundColor: COLORS.tertiary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  photoButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default AddVisit;