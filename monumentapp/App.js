import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


// Importing screens
import Home from "./screens/Home";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{headerShown: false}} />
            <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        </Stack.Navigator>
        </NavigationContainer>
    );
}