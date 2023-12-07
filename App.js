import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function App() {
  const [responseData, setResponseData] = useState([]);

  const GET = () => {
    console.log("GET");
    const Http = new XMLHttpRequest();
    const url = 'http://courses.illinois.edu/cisapp/explorer/schedule.xml';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      if (Http.readyState === 4 && Http.status === 200) {
        const response = Http.responseText;
        const parsedResponse = parseResponse(response);
        setResponseData(parsedResponse);
      }
    }
  };

  const parseResponse = (response) => {
    const { XMLParser } = require("fast-xml-parser");
    const parser = new XMLParser();
    let yearData = parser.parse(response);
    
    // Convert the response from an object to an array
    yearData = Object.values(yearData);
    yearData = (Object.values(Object.values(yearData[1])[1])[0]);
    const minYear = new Date().getFullYear()
    yearData = yearData.filter(year => year >= minYear);
    return yearData
  };

  const handleItemClick = (item) => {
    // Handle click event for each item
    console.log("Clicked item:", item);
  };

  const resetResponseData = () => {
    setResponseData([]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={GET} style={[styles.buttonText, { marginRight: 14, padding: 1, borderWidth: 3, borderColor: 'lightgray', borderRadius: 5 }]}>
          <Text>Test HTTP 'GET' request</Text>
        </TouchableOpacity>

        {responseData.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleItemClick(item)} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={[styles.buttonText, { marginRight: 14, padding: 1, borderWidth: 3, borderColor: 'lightgray', borderRadius: 5 }]}>
          <Text style={styles.buttonText}>Button 1</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetResponseData} style={[styles.buttonText, { marginRight: 14, padding: 1, borderWidth: 3, borderColor: 'lightgray', borderRadius: 5 }]}>
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
    height: 100,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
  },
  itemContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    backgroundColor: 'lightblue',
  },
  itemText: {
    fontSize: 18,
    color: 'black',
  },
});

