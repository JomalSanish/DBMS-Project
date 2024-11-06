import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';

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
  const [studentId, setStudentId] = useState<string>('');

  // Fetch student data and marks when the component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentResponse = await fetch(`https://dbms-project-l3ur.onrender.com/api/students/${route.params?.studentId}`);
        if (studentResponse.ok) {
          const student: Student = await studentResponse.json();
          setSemester(student.semester);
          setStudentName(student.name);
          setStudentId(student.studentId);

          // Fetch marks for the student's semester
          fetchMarksForSemester(student.studentId, student.semester);
        } else {
          Alert.alert('Error', 'Failed to fetch student data');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong while fetching student data');
        console.error(error);
      }
    };

    fetchStudentData();
  }, [route.params?.studentId]);

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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.studentInfoText}>Student Name: {studentName}</Text>
        <Text style={styles.studentInfoText}>Student ID: {studentId}</Text>
        <Text style={styles.studentInfoText}>Semester: {semester}</Text>

        <View style={styles.marksContainer}>
          {marks.length > 0 ? (
            marks.map((mark, index) => (
              <View key={index} style={styles.markItem}>
                <Text style={styles.courseName}>{mark.courseName}</Text>
                <Text style={styles.mark}>{mark.mark}</Text>
              </View>
            ))
          ) : (
            <Text>No marks available for this semester.</Text>
          )}
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
  studentInfoText: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  marksContainer: {
    marginTop: 20,
    width: '100%',
  },
  markItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  courseName: {
    fontSize: 16,
    flex: 1,
  },
  mark: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
});

