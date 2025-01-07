import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Home from '../screens/Home';
import Visits from '../screens/Visits';
import BucketList from '../screens/BucketList';
import Compare from '../screens/Compare';
import Monuments from '../screens/Monuments';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: false,
    headerShown: false,
    tabBarStyle: {
        backgroundColor: COLORS.secondary,
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: '11%',
        paddingTop: 10,
    }
}

const Footer = () => {
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Home" component={Home} options={{
                tabBarIcon: ({ focused }) => (
                    <Entypo
                        name="globe"
                        size={30}
                        color={focused ? COLORS.tertiary : COLORS.white}
                    />
                ),
            }} />
            <Tab.Screen name="Visits" component={Monuments} options={{
                tabBarIcon: ({ focused }) => (
                    <MaterialCommunityIcons
                        name="eiffel-tower"
                        size={30}
                        color={focused ? COLORS.tertiary : COLORS.white}
                    />
                ),
            }} />
            <Tab.Screen name="BucketList" component={BucketList} options={{
                tabBarIcon: ({ focused }) => (
                    <Entypo
                        name="bucket"
                        size={30}
                        color={focused ? COLORS.tertiary : COLORS.white}
                    />
                ),
            }} />
            <Tab.Screen name="Compare" component={Compare} options={{
                tabBarIcon: ({ focused }) => (
                    <MaterialIcons
                        name="compare-arrows"
                        size={30}
                        color={focused ? COLORS.tertiary : COLORS.white}
                    />
                ),
            }} />
        </Tab.Navigator>
    );
}

export default Footer;