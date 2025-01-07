import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import { AirbnbRating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import monumentList from "../services/Monuments";

const AddVisit = ({ route, navigation }) => {
  const { placeId } = route.params; // Only receiving placeId
  const [searchText, setSearchText] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [photos, setPhotos] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [monuments, setMonuments] = useState([]);

  // Fetch monuments and populate place name if placeId is provided
  useEffect(() => {
    const fetchMonuments = async () => {
      console.log("Fetching monuments...");
      const fetchedMonuments = await monumentList();
      setMonuments(fetchedMonuments);
      console.log("Monuments:", fetchedMonuments);

      if (placeId) {
        const matchedMonument = fetchedMonuments.find(
          (monument) => monument.id === placeId
        );
        if (matchedMonument) {
          setSearchText(matchedMonument.name);
          setSelectedPlace(matchedMonument);
        }
      }
    };
    fetchMonuments();
  }, [placeId]);

  const handleRating = (ratingValue) => {
    setRating(ratingValue);
  };

  const handlePhotoSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled) {
      setPhotos([...photos, result.uri]);
    }
  };

  const handleSubmit = async () => {
    const data = {
      placeId: selectedPlace?.id || placeId,
      placeName: selectedPlace?.name || searchText,
      rating,
      review,
      photos,
    };

    try {
      const response = await axios.post(
        "https://monumentapp-73e8e79b6ee2.herokuapp.com/api/monuments",
        data
      );
      Alert.alert("Éxito", "Monumento añadido correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error al añadir el monumento:", error);
      Alert.alert(
        "Error",
        "No se pudo añadir el monumento. Inténtalo de nuevo."
      );
    }
  };

  const filteredMonuments = monuments.filter((monument) =>
    monument.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Search bar with dropdown */}
        <View>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar lugar"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setDropdownVisible(true);
            }}
          />
          {dropdownVisible && searchText.length > 0 && (
            <FlatList
              data={filteredMonuments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSearchText(item.name);
                    setSelectedPlace(item);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdown}
            />
          )}
        </View>

        {/* Rating */}
        <AirbnbRating
          count={5}
          reviews={[]}
          defaultRating={rating}
          size={SIZES.large}
          onFinishRating={handleRating}
        />

        {/* Review Text Box */}
        <TextInput
          style={styles.textBox}
          placeholder="Escribe tu reseña"
          value={review}
          onChangeText={setReview}
          multiline
        />

        {/* Photo Selector */}
        <TouchableOpacity style={styles.photoButton} onPress={handlePhotoSelection}>
          <Text style={styles.photoButtonText}>Seleccionar Fotos</Text>
        </TouchableOpacity>
        <FlatList
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.photo} />
          )}
          style={styles.photoList}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Añadir Monumento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SIZES.base,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SIZES.base,
    marginTop: SIZES.xxxlarge * 2,
  },
  searchBar: {
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: SIZES.base,
    padding: SIZES.small,
    marginBottom: SIZES.base,
    backgroundColor: COLORS.white,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: SIZES.base,
    marginTop: SIZES.base / 2,
  },
  dropdownItem: {
    padding: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  textBox: {
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: SIZES.base,
    padding: SIZES.small,
    marginVertical: SIZES.base,
    backgroundColor: COLORS.white,
    height: 100,
    textAlignVertical: "top",
  },
  photoButton: {
    backgroundColor: COLORS.tertiary,
    padding: SIZES.small,
    borderRadius: SIZES.base,
    alignItems: "center",
    marginBottom: SIZES.base,
  },
  photoButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
  },
  photoList: {
    marginBottom: SIZES.base,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: SIZES.base,
    marginRight: SIZES.base,
  },
  submitButton: {
    backgroundColor: COLORS.secondary,
    padding: SIZES.small,
    borderRadius: SIZES.base,
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: "bold",
  },
});

export default AddVisit;