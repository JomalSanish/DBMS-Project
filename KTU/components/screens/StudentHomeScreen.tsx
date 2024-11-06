import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';

interface Mark {
  courseName: string;
  mark: number;
}

interface ApiResponse {
  marks: Mark[];
}

interface Student {
  studentId: string;
  semester: string;
  name: string; // Adding name field for displaying student name
}

export default function StudentHomeScreen({ route }: { route: any }) {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [semester, setSemester] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const studentId = route.params?.studentId;

  // Fetch student data and marks when the component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentResponse = await fetch(`https://dbms-project-l3ur.onrender.com/api/students/${studentId}`);
        if (studentResponse.ok) {
          const student: Student = await studentResponse.json();
          setSemester(student.semester);
          setStudentName(student.name);

          // Fetch marks for the student's semester
          fetchMarksForSemester(studentId, student.semester);
        } else {
          Alert.alert('Error', 'Failed to fetch student data');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong while fetching student data');
        console.error(error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const fetchMarksForSemester = async (studentId: string, semester: string) => {
    try {
      const url = `https://dbms-project-l3ur.onrender.com/api/results?studentId=${studentId}&semester=${semester}`;
      const response = await fetch(url);

      if (response.ok) {
        const data: ApiResponse = await response.json();
        setMarks(data.marks || []);
      } else {
        Alert.alert('Error', 'Failed to fetch marks for this semester');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching marks');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Welcome, {studentName}!
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Semester: {semester}</Text>
      <View style={{ marginTop: 20 }}>
        {marks.length > 0 ? (
          marks.map((mark, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
              <Text style={{ fontSize: 16 }}>{mark.courseName}</Text>
              <Text style={{ fontSize: 16 }}>{mark.mark}</Text>
            </View>
          ))
        ) : (
          <Text>No marks available for this semester.</Text>
        )}
      </View>
    </View>
  );
}
