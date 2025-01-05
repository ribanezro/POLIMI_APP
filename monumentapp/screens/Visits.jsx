import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Visits = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Visits</Text>
        <Text style={styles.subtitle}>Your visit history is empty</Text>
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

export default Visits;