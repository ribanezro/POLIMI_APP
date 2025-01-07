import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Footer from "./navigation/footer";
//import LoginScreen from "./screens/LoginScreen";
//import RegisterScreen from "./screens/RegisterScreen";

import AddVisit from "./screens/AddVisit";

import PlaceDetails from "./screens/MonumentScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} /> */}
                <Stack.Screen name="Footer" component={Footer} />
                <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
                <Stack.Screen name="AddVisit" component={AddVisit} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}