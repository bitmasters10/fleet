import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screen/HomeScreen";
import FleetScreen from "../screen/FleetScreen";
import MapScreen from "../screen/MapScreen";
import ProfileScreen from "../screen/ProfileScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={() => require("../screen/HomeScreen").default}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Fleet"
        component={() => require("../screen/FleetScreen").default}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="car" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="map" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={() => require("../screen/ProfileScreen").default}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="account" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
