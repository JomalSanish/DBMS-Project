import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
      const response = await fetch(`https://dbms-project-l3ur.onrender.com/api/courses?semester=${semester}`);
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
      const response = await fetch('https://dbms-project-l3ur.onrender.com/api/courses', {
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
      const response = await fetch(`https://dbms-project-l3ur.onrender.com/api/courses/${id}`, {
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
    <View style={styles.container}>
      <Text style={styles.headerText}>Manage Courses</Text>

      <View style={styles.card}>
        {/* Semester Picker */}
        <Text style={styles.label}>Select Semester:</Text>
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

        {/* Course Name Input */}
        <TextInput
          placeholder="Enter Course Name"
          value={courseName}
          onChangeText={setCourseName}
          style={styles.input}
        />

        <Button title="Add Course" onPress={handleAddCourse} />

        {/* Course List */}
        <View style={styles.courseListContainer}>
          <Text style={styles.courseListHeader}>Courses for Semester {semester}</Text>
          
          <FlatList
            data={courses}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.courseItem}>
                <Text style={styles.courseName}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteCourse(item._id)} style={styles.deleteButtonContainer}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#e0f7fa', // Light blue background for the card
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginVertical: 10,
    overflow: 'hidden', // Ensures rounded corners on Android
  },
  picker: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    paddingLeft: 10, // Padding to align text horizontally
    paddingVertical: 10, // Padding to center text vertically
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  courseListContainer: {
    width: '100%',
    marginTop: 20,
  },
  courseListHeader: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#b2ebf2', // Light blue background for each course item
    borderRadius: 5,
  },
  courseName: {
    flex: 1,
    fontSize: 16,
  },
  deleteButtonContainer: {
    backgroundColor: '#ff1744', // Red background for delete button
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    color: '#fff',
    fontSize: 14,
  },
});
