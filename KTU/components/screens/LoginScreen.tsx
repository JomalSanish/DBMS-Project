import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [studentIds, setStudentIds] = useState<string[]>([]);

  useEffect(() => {
    // Fetch student IDs from the server on load
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

    fetchStudentIds();
  }, []);

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
      <Text>KTU Login</Text>
      <TextInput
        placeholder="Enter ID"
        value={id}
        onChangeText={setId}
        style={{ borderWidth: 1, padding: 10, margin: 10, width: '80%' }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
        <TextInput
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{ borderWidth: 1, padding: 10, margin: 10, flex: 1 }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={{ margin: 10 }}>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
