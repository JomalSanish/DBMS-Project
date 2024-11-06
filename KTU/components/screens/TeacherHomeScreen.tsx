import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentScreen from './StudentScreen';
import ResultScreen from './ResultScreen';
import CourseScreen from './CourseScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const Tab = createBottomTabNavigator();

export default function TeacherHomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,  // Hide individual tab headers
      }}
    >
      <Tab.Screen
        name="Student"
        component={StudentScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />  // Icon for Student tab
          ),
        }}
      />
      <Tab.Screen
        name="Result"
        component={ResultScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="clipboard" size={size} color={color} />  // Icon for Result tab
          ),
        }}
      />
      <Tab.Screen
        name="Course"
        component={CourseScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="school" size={size} color={color} />  // Icon for Course tab
          ),
        }}
      />
    </Tab.Navigator>
  );
}
