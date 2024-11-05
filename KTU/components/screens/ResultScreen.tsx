import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList } from 'react-native';
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
        const response = await fetch(`http://192.168.165.130:5000/api/students/semester/${semester}`);
        const data = await response.json();
        
        // Log the response data for debugging
        console.log('Fetched students:', data);

        // Ensure data is an array before setting state
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
        const response = await fetch(`http://192.168.165.130:5000/api/courses/${semester}`);
        const data = await response.json();
        setCourses(data);
        setMarks(data.reduce((acc: { [key: string]: string }, course: Course) => ({ ...acc, [course.name]: '' }), {})); // Reset marks
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
    // Validate all marks are entered
    if (Object.values(marks).some((mark) => mark === '')) {
      Alert.alert('Error', 'Please enter marks for all courses.');
      return;
    }

    try {
      const response = await fetch('http://192.168.165.130:5000/api/results', {
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Update Student Results</Text>

      {/* Semester Picker */}
      <Text>Select Semester:</Text>
      <Picker
        selectedValue={semester}
        onValueChange={(value) => setSemester(value)}
        style={{ marginVertical: 10 }}
      >
        {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
          <Picker.Item label={`Semester ${sem}`} value={String(sem)} key={sem} />
        ))}
      </Picker>

      {/* Student Picker */}
      <Text>Select Student:</Text>
      <Picker
        selectedValue={selectedStudentId}
        onValueChange={(value) => setSelectedStudentId(value)}
        style={{ marginVertical: 10 }}
      >
        {students.length > 0 ? (
          students.map((student) => (
            <Picker.Item label={student.studentId} value={student.studentId} key={student._id} />
          ))
        ) : (
          <Picker.Item label="No students available" value="" />
        )}
      </Picker>

      {/* Marks Input for each course */}
      {courses.map((course) => (
        <View key={course._id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <Text style={{ flex: 1 }}>{course.name}</Text>
          <TextInput
            placeholder="Enter Mark"
            value={marks[course.name]}
            onChangeText={(value) => handleMarkChange(course.name, value)}
            keyboardType="numeric"
            style={{ borderWidth: 1, padding: 5, flex: 1 }}
          />
        </View>
      ))}

      {/* Submit Button */}
      <Button title="Update Marks" onPress={handleSubmit} />
    </View>
  );
}
