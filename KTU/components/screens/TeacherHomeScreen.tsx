// components/screens/TeacherHomeScreen.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentScreen from './StudentScreen';  // Your StudentScreen component
import ResultScreen from './ResultScreen';    // Import the ResultScreen
import CourseScreen from './CourseScreen';    // Import the CourseScreen
import { Button } from 'react-native';

const Tab = createBottomTabNavigator();

export default function TeacherHomeScreen({ navigation }: { navigation: any }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => (
          <Button title="Logout" onPress={() => navigation.navigate('Login')} />
        ),
      }}
    >
      <Tab.Screen name="Student" component={StudentScreen} />
      <Tab.Screen name="Result" component={ResultScreen} />
      <Tab.Screen name="Course" component={CourseScreen} />
    </Tab.Navigator>
  );
}
