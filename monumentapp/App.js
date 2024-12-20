import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export default function App() {
    return (
        <NavigationContainer>
        <RootStack />
        </NavigationContainer>
    );
}