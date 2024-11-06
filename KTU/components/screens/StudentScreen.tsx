import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function StudentScreen() {
  const [studentId, setStudentId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [semester, setSemester] = useState<string>('1');
  const [students, setStudents] = useState<any[]>([]);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const response = await fetch('https://dbms-project-l3ur.onrender.com/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch students');
      console.error(error);
    }
  };

  // Handle adding a new student
  const handleAddStudent = async () => {
    if (studentId.length !== 10 || !/^[a-zA-Z0-9]+$/.test(studentId)) {
      Alert.alert('Error', 'Student ID must be a 10-digit alphanumeric string');
      return;
    }

    Alert.alert(
      'Confirm Submission',
      `Are you sure you want to add student:\n\nID: ${studentId}\nName: ${name}\nSemester: ${semester}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => submitStudentData() },
      ]
    );
  };

  // Submit student data to the backend
  const submitStudentData = async () => {
    try {
      const response = await fetch('https://dbms-project-l3ur.onrender.com/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, semester }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Student added successfully');
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

  // Handle deleting a student by ID
  const handleDeleteStudent = async (studentId: string) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete student with ID: ${studentId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => deleteStudentData(studentId) },
      ]
    );
  };

  // Delete student from the backend
  const deleteStudentData = async (studentId: string) => {
    try {
      const response = await fetch(`https://dbms-project-l3ur.onrender.com/api/students/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Success', 'Student deleted successfully');
        fetchStudents(); // Refresh the list of students
      } else {
        Alert.alert('Error', 'Failed to delete student');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Student Management</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Enter 10-digit Student ID"
          value={studentId}
          onChangeText={setStudentId}
          style={styles.input}
        />
        <TextInput
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        {/* Custom border for Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={semester}
            onValueChange={(value) => setSemester(value)}
            style={styles.picker}
          >
            {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
              <Picker.Item label={`Semester ${sem}`} value={String(sem)} key={sem} />
            ))}
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Add Student" onPress={handleAddStudent} />
        </View>
      </View>

      {/* Button to fetch all students */}
      <View style={styles.buttonContainer}>
        <Button title="Fetch All Students" onPress={fetchStudents} />
      </View>

      {/* Display all students */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.studentId}
        renderItem={({ item }) => (
          <View style={styles.studentItem}>
            <Text>{item.name} (ID: {item.studentId})</Text>
            <Button
              title="Delete"
              onPress={() => handleDeleteStudent(item.studentId)}
              color="#ff1744"  // Red color for the delete button
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40, // Increased left and right padding for the entire screen
    paddingTop: 16, // Optional, to add top padding
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e0f7fa',
    padding: 20,
    borderRadius: 10,
    width: '100%',  // Full width
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    overflow: 'hidden', // Ensures rounded corners on Android
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',  // Full width of the screen
    backgroundColor: '#e0f7fa',
    padding: 20,  // Increased padding to match card size
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
