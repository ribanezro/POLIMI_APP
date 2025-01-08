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
      setFilteredMonuments(filtered); // Show all results
      setDropdownVisible(true);
    }
  };

  const handleSelect = (monument) => {
    setSearchText(monument.name);
    setSelectedPlace(monument);
    setDropdownVisible(false);
  };

  const handlePhotoSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
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

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setRating(index + 1)}
        style={styles.starButton}
      >
        <Ionicons
          name="star"
          size={32}
          color={index < rating ? "gold" : COLORS.secondary}
        />
      </TouchableOpacity>
    ));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rating:</Text>
          <View style={styles.starsContainer}>{renderStars()}</View>
        </View>
        <TextInput
          style={styles.textBox}
          placeholder="Write your review"
          value={review}
          onChangeText={setReview}
          multiline
        />
        {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}
        <TouchableOpacity style={styles.photoButton} onPress={handlePhotoSelection}>
          <Text style={styles.photoButtonText}>
            {photo ? "Change Photo" : "Add Photo"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Visit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    borderBottomColor: COLORS.tertiary,
  },
  dropdownText: {
    color: COLORS.black,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  starButton: {
    marginHorizontal: 5,
    color: COLORS.secondary,
  },
  ratingText: {
    fontSize: 18,
    color: COLORS.black,
    marginBottom: 10,
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
  photoPreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 10,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default AddVisit;