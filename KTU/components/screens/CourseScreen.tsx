// components/screens/CourseScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function CourseScreen() {
  const [semester, setSemester] = useState<string>('1');
  const [courseName, setCourseName] = useState<string>('');
  const [courses, setCourses] = useState<Array<{ _id: string; name: string }>>([]);

  useEffect(() => {
    fetchCourses();
  }, [semester]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://192.168.165.130:5000/api/courses?semester=${semester}`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        Alert.alert('Error', 'Failed to fetch courses');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching courses');
      console.error(error);
    }
  };

  const handleAddCourse = async () => {
    if (!courseName) {
      Alert.alert('Error', 'Course name cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://192.168.165.130:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: courseName, semester }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Course added successfully');
        setCourseName('');
        fetchCourses();
      } else {
        Alert.alert('Error', 'Failed to add course');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      console.error(error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const response = await fetch(`http://192.168.165.130:5000/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Success', 'Course deleted successfully');
        fetchCourses();
      } else {
        Alert.alert('Error', 'Failed to delete course');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Manage Courses</Text>
      
      <Picker
        selectedValue={semester}
        onValueChange={(value) => setSemester(value)}
        style={{ marginVertical: 10 }}
      >
        {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
          <Picker.Item label={`Semester ${sem}`} value={String(sem)} key={sem} />
        ))}
      </Picker>

      <TextInput
        placeholder="Enter Course Name"
        value={courseName}
        onChangeText={setCourseName}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Add Course" onPress={handleAddCourse} />

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Courses for Semester {semester}</Text>
        
        <FlatList
          data={courses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <Text style={{ flex: 1 }}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleDeleteCourse(item._id)}>
                <Text style={{ color: 'red', fontSize: 16 }}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}
