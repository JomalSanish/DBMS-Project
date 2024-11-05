// components/screens/StudentScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function StudentScreen() {
  const [studentId, setStudentId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [semester, setSemester] = useState<string>('1');

  const handleAddStudent = async () => {
    // Validate student ID
    if (studentId.length !== 10 || !/^[a-zA-Z0-9]+$/.test(studentId)) {
      Alert.alert('Error', 'Student ID must be a 10-digit alphanumeric string');
      return;
    }

    // Confirmation dialog
    Alert.alert(
      'Confirm Submission',
      `Are you sure you want to add student:\n\nID: ${studentId}\nName: ${name}\nSemester: ${semester}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => submitStudentData() },
      ]
    );
  };

  const submitStudentData = async () => {
    try {
      const response = await fetch('http://192.168.165.130:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, semester }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Student added successfully');
        // Reset the fields
        setStudentId('');
        setName('');
        setSemester('1');
      } else {
        Alert.alert('Error', 'Failed to add student');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Add Student</Text>
      <TextInput
        placeholder="Enter 10-digit Student ID"
        value={studentId}
        onChangeText={setStudentId}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Picker
        selectedValue={semester}
        onValueChange={(value) => setSemester(value)}
        style={{ marginVertical: 10 }}
      >
        {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
          <Picker.Item label={`Semester ${sem}`} value={String(sem)} key={sem} />
        ))}
      </Picker>
      <Button title="Add Student" onPress={handleAddStudent} />
    </View>
  );
}
