import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentScreen from './StudentScreen';
import ResultScreen from './ResultScreen';
import CourseScreen from './CourseScreen';

const Tab = createBottomTabNavigator();

export default function TeacherHomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,  // Hide individual tab headers
      }}
    >
      <Tab.Screen name="Student" component={StudentScreen} />
      <Tab.Screen name="Result" component={ResultScreen} />
      <Tab.Screen name="Course" component={CourseScreen} />
    </Tab.Navigator>
  );
}
