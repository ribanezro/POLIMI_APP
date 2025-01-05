import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Footer from "./navigation/footer";
//import LoginScreen from "./screens/LoginScreen";
//import RegisterScreen from "./screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} /> */}
                <Stack.Screen name="Footer" component={Footer} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}