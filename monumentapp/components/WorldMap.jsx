import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { geoPath, geoMercator } from 'd3-geo';
import countriesGeoJSON from '../data/countries.geo.json';

const WorldMap = ({ visitedCountries }) => {
    const width = 900;
    const height = 400;

    // Define the projection and path generator
    const projection = geoMercator().fitSize([width, height], countriesGeoJSON);
    const pathGenerator = geoPath(projection);

    return (
        <View style={styles.container}>
            <Svg width={width} height={height} style={styles.svg}>
                {countriesGeoJSON.features.map((feature, index) => {
                    const isVisited = visitedCountries.includes(feature.id); // Check if the country is visited
                    const isUnvisited =!isVisited && feature.id !== null; // Check if the country is unvisited

                    return (
                        <Path
                            key={index}
                            d={pathGenerator(feature)}
                            fill={
                                isVisited
                                    ? '#133b62' // Dark blue for visited
                                    : isUnvisited
                                    ? '#ffffff' // Light red for unvisited
                                    : '#ffffff' // Default light gray
                            }
                            stroke="#000"
                            strokeWidth={0.5} // Thin country borders
                        />
                    );
                })}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent', // Transparent container background
        flex: 1, // Allow the container to expand
    },
    svg: {
        backgroundColor: 'transparent', // Ensure the SVG has no background
    },
});

export default WorldMap;