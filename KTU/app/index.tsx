import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/components/screens/LoginScreen';
import StudentHomeScreen from '@/components/screens/StudentHomeScreen';
import TeacherHomeScreen from '@/components/screens/TeacherHomeScreen';

type RootStackParamList = {
  Login: undefined;
  StudentHome: undefined;
  TeacherHome: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
        <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} />
      </Stack.Navigator>
        );
}
