import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BucketList = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Bucket List</Text>
        <Text style={styles.subtitle}>Your bucket list is empty</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9F9F9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
});

export default BucketList;