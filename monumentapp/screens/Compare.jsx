import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Compare = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Compare</Text>
        <Text style={styles.subtitle}>Compare your favorite monuments</Text>
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

export default Compare;