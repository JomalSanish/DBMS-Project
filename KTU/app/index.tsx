import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/components/screens/LoginScreen';
import StudentHomeScreen from '@/components/screens/StudentHomeScreen';
import TeacherHomeScreen from '@/components/screens/TeacherHomeScreen';

type RootStackParamList = {
  Login: undefined;
  StudentHome: { studentName: string };  // Add studentName as a param
  TeacherHome: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="StudentHome"
        component={StudentHomeScreen}
        options={({ route, navigation }) => ({
          headerShown: true,
          title: route.params?.studentName || 'Student',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('Login')}
              title="Logout"
              color="#000"
            />
          ),
        })}
      />
      <Stack.Screen
        name="TeacherHome"
        component={TeacherHomeScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Teacher',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('Login')}
              title="Logout"
              color="#000"
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
