import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native'; // Import LottieView
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [studentIds, setStudentIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchStudentIds = async () => {
      try {
        const response = await fetch('https://dbms-project-l3ur.onrender.com/api/students');
        if (response.ok) {
          const students = await response.json();
          const ids = students.map((student: { studentId: string }) => student.studentId);
          setStudentIds(ids);
        } else {
          Alert.alert('Error', 'Failed to fetch student IDs');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Something went wrong while fetching student IDs');
      }
    };

    // Fetch student IDs each time the screen is loaded
    fetchStudentIds();
  }, []); // empty dependency array will fetch every time this screen loads

  const handleLogin = async () => {
    if (id === 'Teacher' && password === 'password') {
      navigation.navigate('TeacherHome');
    } else if (studentIds.includes(id) && password === id) {
      try {
        // Fetch student data to get the name
        const response = await fetch(`https://dbms-project-l3ur.onrender.com/api/students/${id}`);
        if (response.ok) {
          const student = await response.json();
          // Pass both studentId and studentName to StudentHome
          navigation.navigate('StudentHome', { studentId: id, studentName: student.name });
        } else {
          Alert.alert('Error', 'Failed to fetch student name');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Something went wrong while fetching student data');
      }
    } else {
      Alert.alert('Login Failed', 'Invalid login credentials');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Lottie Animation */}
      <LottieView
        source={require('../../assets/animation.json')} // Path to your animation file
        autoPlay
        loop
        style={styles.animation}
      />
      
      <Text style={styles.loginText}>KTU Login</Text>

      {/* Card Container for Inputs and Button */}
      <View style={styles.card}>
        <TextInput
          placeholder="Enter ID"
          value={id}
          onChangeText={setId}
          style={styles.input}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          {/* Eye Icon for Show/Hide password */}
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon
              name={showPassword ? 'eye-off' : 'eye'} // Change icon based on showPassword state
              size={24}
              color="#00796b" // Icon color
            />
          </TouchableOpacity>
        </View>
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 150, // Set a desired size for your animation
    height: 150,
    marginBottom: 20, // Add some margin below the animation
  },
  loginText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e0f7fa', // Light blue color
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 40, // Add space for the icon inside the input field
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative', // Allow the icon to be placed inside the input field
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10, // Place the icon on the right side of the input
    top: '50%', // Vertically center the icon
    transform: [{ translateY: -12 }], // Adjust vertical alignment to center the icon
  },
});
