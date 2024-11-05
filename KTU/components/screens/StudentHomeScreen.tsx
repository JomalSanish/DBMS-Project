import React, { useEffect, useState } from 'react';
import { View, Text, Picker, Button, Alert } from 'react-native';

interface Mark {
  courseName: string;
  mark: number;
}

export default function StudentHomeScreen({ route, navigation }: { route: any, navigation: any }) {
  const [semester, setSemester] = useState<string>('1');
  const [marks, setMarks] = useState<Mark[] | null>(null);
  const { studentId } = route.params;  // Assuming studentId is passed from the login screen

  useEffect(() => {
    if (semester) {
      fetchMarksForSemester();
    }
  }, [semester]);

  const fetchMarksForSemester = async () => {
    try {
      const response = await fetch(`http://192.168.165.130:5000/api/results?studentId=${studentId}&semester=${semester}`);
      if (response.ok) {
        const data = await response.json();
        setMarks(data?.marks || []);
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
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Select Semester to View Marks</Text>
      
      <Picker
        selectedValue={semester}
        onValueChange={(value) => setSemester(value)}
        style={{ marginBottom: 20 }}
      >
        {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
          <Picker.Item label={`Semester ${sem}`} value={String(sem)} key={sem} />
        ))}
      </Picker>

      <View style={{ marginTop: 20 }}>
        {marks ? (
          marks.length > 0 ? (
            marks.map((mark, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
                <Text style={{ fontSize: 16 }}>{mark.courseName}</Text>
                <Text style={{ fontSize: 16 }}>{mark.mark}</Text>
              </View>
            ))
          ) : (
            <Text>No marks available for this semester.</Text>
          )
        ) : (
          <Text>Select a semester to view marks</Text>
        )}
      </View>

      <Button title="Logout" onPress={() => navigation.navigate('Login')} style={{ marginTop: 30 }} />
    </View>
  );
}
