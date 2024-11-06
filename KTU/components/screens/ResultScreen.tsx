import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Mark {
  courseName: string;
  mark: number;
}

interface Student {
  _id: string;
  studentId: string;
  name: string;
  semester: string;
}

interface Course {
  _id: string;
  name: string;
  semester: string;
}

export default function ResultScreen() {
  const [semester, setSemester] = useState<string>('1');
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [marks, setMarks] = useState<{ [courseName: string]: string }>({});

  // Fetch students when semester changes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`https://dbms-project-l3ur.onrender.com/api/students/semester/${semester}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error('Data fetched is not an array:', data);
        }
      } catch (error) {
        console.error('Failed to fetch students', error);
      }
    };
    fetchStudents();
  }, [semester]);

  // Fetch courses when semester changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`https://dbms-project-l3ur.onrender.com/api/courses/${semester}`);
        const data = await response.json();
        setCourses(data);
        setMarks(data.reduce((acc: { [key: string]: string }, course: Course) => ({ ...acc, [course.name]: '' }), {}));
      } catch (error) {
        console.error('Failed to fetch courses', error);
      }
    };
    fetchCourses();
  }, [semester]);

  // Handle mark change
  const handleMarkChange = (courseName: string, mark: string) => {
    setMarks((prev) => ({ ...prev, [courseName]: mark }));
  };

  // Handle submission
  const handleSubmit = async () => {
    if (Object.values(marks).some((mark) => mark === '')) {
      Alert.alert('Error', 'Please enter marks for all courses.');
      return;
    }

    try {
      const response = await fetch('https://dbms-project-l3ur.onrender.com/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentId,
          semester,
          marks: Object.entries(marks).map(([courseName, mark]) => ({
            courseName,
            mark: parseInt(mark),
          })),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Marks updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update marks');
      }
    } catch (error) {
      console.error('Error updating marks', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Update Student Results</Text>

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

        {/* Student Picker */}
        <Text style={styles.label}>Select Student:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStudentId}
            onValueChange={(value) => setSelectedStudentId(value)}
            style={styles.picker}
          >
            {students.length > 0 ? (
              students.map((student) => (
                <Picker.Item label={student.studentId} value={student.studentId} key={student._id} />
              ))
            ) : (
              <Picker.Item label="No students available" value="" />
            )}
          </Picker>
        </View>

        {/* Marks Input for each course */}
        {courses.map((course) => (
          <View key={course._id} style={styles.inputContainer}>
            <Text style={styles.courseName}>{course.name}</Text>
            <TextInput
              placeholder="Enter Mark"
              value={marks[course.name]}
              onChangeText={(value) => handleMarkChange(course.name, value)}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        ))}

        {/* Submit Button */}
        <Button title="Update Marks" onPress={handleSubmit} />
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
    backgroundColor: '#f5f5f5', // Light background color
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
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  courseName: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    width: '60%',
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
});
