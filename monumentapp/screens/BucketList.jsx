import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

const BucketList = ({ navigation }) => {
  const [bucketList, setBucketList] = useState([]);

  useEffect(() => {
    // Simulate fetching bucket list data from an API
    const fetchBucketList = async () => {
      const data = [
        {
          id: 1,
          name: "Eiffel Tower",
          image_url: "https://example.com/eiffel.jpg",
          city: "Paris",
          country: "France",
          isVisited: false,
        },
        {
          id: 2,
          name: "Colosseum",
          image_url: "https://example.com/colosseum.jpg",
          city: "Rome",
          country: "Italy",
          isVisited: true,
        },
        {
          id: 3,
          name: "Statue of Liberty",
          image_url: "https://example.com/liberty.jpg",
          city: "New York",
          country: "",
          isVisited: false,
        },
      ];
      setBucketList(data);
    };

    fetchBucketList();
  }, []);

  const renderPlace = ({ item }) => {
    const location = [item.city, item.country].filter(Boolean).join(", ");

    return (
      <TouchableOpacity
        style={styles.placeContainer}
        onPress={() => navigation.navigate("VisitPage", { placeId: item.id })}
      >
        <Image source={{ uri: item.image_url }} style={styles.placeImage} />
        <View style={styles.placeDetails}>
          <Text
            style={[
              styles.placeName,
              item.isVisited && { color: COLORS.tertiary },
            ]}
          >
            {item.name}
          </Text>
          {location ? <Text style={styles.placeLocation}>{location}</Text> : null}
        </View>
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={item.isVisited ? COLORS.tertiary : COLORS.secondary}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Bucket List</Text>
      {bucketList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Your bucket list is empty. Click Add to add some stuff.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bucketList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPlace}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: COLORS.black,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  placeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  placeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  placeDetails: {
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
});

export default BucketList;