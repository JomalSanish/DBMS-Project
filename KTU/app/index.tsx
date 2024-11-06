import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/components/screens/LoginScreen';
import StudentHomeScreen from '@/components/screens/StudentHomeScreen';
import TeacherHomeScreen from '@/components/screens/TeacherHomeScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons

type RootStackParamList = {
  Login: undefined;
  StudentHome: { studentName: string }; // Add studentName as a param
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
          headerStyle: {
            backgroundColor: '#e0f7fa', // Light blue color for the header
          },
          headerTintColor: '#000', // Title color
          headerRight: () => (
            <Icon
              name="power" // Power icon
              size={24}
              color="#000"
              style={{ marginRight: 10 }} // Right padding for the icon
              onPress={() => navigation.navigate('Login')} // Power icon action (logout)
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
          headerStyle: {
            backgroundColor: '#e0f7fa', // Light blue color for the header
          },
          headerTintColor: '#000', // Title color
          headerRight: () => (
            <Icon
              name="power" // Power icon
              size={24}
              color="#000"
              style={{ marginRight: 10 }} // Right padding for the icon
              onPress={() => navigation.navigate('Login')} // Power icon action (logout)
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
