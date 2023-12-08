import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { abbreviations } from './data.js';

export default function App() {
  const { XMLParser } = require("fast-xml-parser");
  const parser = new XMLParser();
  
  const [yearData, setYearData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [courseData, setCourseData] = useState([]);

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const GET_YEARS = () => {
    const years = 'http://courses.illinois.edu/cisapp/explorer/schedule.xml';
    const Http = new XMLHttpRequest();
    Http.open("GET", years);
    Http.send();

    Http.onreadystatechange = (e) => {
      if (Http.readyState === 4 && Http.status === 200) {
        const response = Http.responseText;
        const parsedResponse = parseYears(response);
        setYearData(parsedResponse);
      }
    }
  };

  const GET_SEMESTER = (year) => {
    const semester = `http://courses.illinois.edu/cisapp/explorer/schedule/${year}.xml`;
    const Http = new XMLHttpRequest();
    Http.open("GET", semester);
    Http.send();
    setSelectedYear(year);
    Http.onreadystatechange = (e) => {
      if (Http.readyState === 4 && Http.status === 200) {
        const response = Http.responseText;
        const parsedResponse = parseSemesters(response);
        setSemesterData(parsedResponse);
      }
    }
  };

  const GET_SUBJECTS = (year, semester) => {
    let semesterString = semester.split(' ')[0].toLowerCase();
    const subjects = `http://courses.illinois.edu/cisapp/explorer/schedule/${year}/${semesterString}.xml`;
    const Http = new XMLHttpRequest();
    Http.open("GET", subjects);
    Http.send();
    setSelectedSemester(semester);
    Http.onreadystatechange = (e) => {
      if (Http.readyState === 4 && Http.status === 200) {
        const response = Http.responseText;
        const parsedResponse = parseSubjects(response);
        setSubjectData(parsedResponse);
      }
    }
  };

  const GET_COURSE = (year, semester, subject) => {
    let semesterString = semester.split(' ')[0].toLowerCase();
    const courses = `http://courses.illinois.edu/cisapp/explorer/schedule/${year}/${semesterString}/${abbreviations[subject]}.xml`;
    const Http = new XMLHttpRequest();
    Http.open("GET", courses);
    Http.send();
    setSelectedSubject(subject);
    Http.onreadystatechange = (e) => {
      if (Http.readyState === 4 && Http.status === 200) {
        const response = Http.responseText;
        const parsedResponse = parseCourses(response);
        setCourseData(parsedResponse);
      }
    }
  };

  const parseYears = (response) => {
    let yearData = parser.parse(response);
    yearData = Object.values(Object.values(Object.values(yearData)[1])[1])[0];
    const minYear = new Date().getFullYear();
    yearData = yearData.filter(year => year >= minYear);
    return yearData;
  };

  const parseSemesters = (response) => {
    let semesterData = parser.parse(response);
    semesterData = Object.values(Object.values(Object.values(semesterData)[1])[1])[0];
    return semesterData;
  };

  const parseSubjects = (response) => {
    let subjectData = parser.parse(response);
    subjectData = Object.values(Object.values(Object.values(subjectData)[1])[2])[0];
    return subjectData;
  };

  const parseCourses = (response) => {
    let courseData = parser.parse(response);
    console.log(Object.values(Object.values(Object.values(courseData)[1])[12]))
    courseData = Object.values(Object.values(Object.values(courseData)[1])[12])[0];
    return courseData;
  };

  const resetYearData = () => {
    setYearData([]);
    setCourseData([]);
    setSemesterData([]);
    setSubjectData([]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={GET_YEARS} style={[styles.buttonText, { marginRight: 14, padding: 1, borderWidth: 3, borderColor: 'lightgray', borderRadius: 5 }]}>
          <Text>Test HTTP 'GET' request</Text>
        </TouchableOpacity>

        {yearData.map((year, index) => (
          <TouchableOpacity key={index} onPress={() => GET_SEMESTER(year)} style={styles.itemText}>
            <Text>{year}</Text>
            {selectedYear === year && semesterData.map((semester, index) => (
              <TouchableOpacity key={index} onPress={() => GET_SUBJECTS(year, semester)} style={styles.itemText}>
                <Text>{semester}</Text>
                {selectedSemester === semester && subjectData.map((subject, index) => (
                  <TouchableOpacity key={index} onPress={() => GET_COURSE(year, semester, subject)} style={styles.itemText}>
                    <Text>{subject}</Text>
                    {selectedSubject === subject && courseData.map((course, index) => (
                      <TouchableOpacity key={index} style={styles.itemText}>
                        <Text>{course}</Text>
                      </TouchableOpacity>
                    ))}
                  </TouchableOpacity>
                ))}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={[styles.buttonText, { marginRight: 14, padding: 1, borderWidth: 3, borderColor: 'lightgray', borderRadius: 5 }]}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetYearData} style={[styles.buttonText, { marginRight: 14, padding: 1, borderWidth: 3, borderColor: 'lightgray', borderRadius: 5 }]}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonText, {marginRight: 14, padding: 1, borderWidth: 3, borderColor: 'lightgray', borderRadius: 5}]}>
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    marginBottom: 150,
  },
  navbar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
  },
  itemText: {
    fontSize: 18,
    color: 'black',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'lightblue',
  },
});
