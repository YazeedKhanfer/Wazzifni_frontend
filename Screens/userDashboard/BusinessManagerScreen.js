import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../url'; 

const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function BusinessManagerScreen({ navigation }) {
  const [hours, setHours] = useState('');
  const [location, setLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [availability, setAvailability] = useState({});

  const handleDayPress = (day) => {
    setSelectedDay(day);
  };

  const handleTimeChange = (time) => {
    const newAvailability = { ...availability };
    if (time) {
      newAvailability[selectedDay] = time;
    } else {
      delete newAvailability[selectedDay];
    }
    setAvailability(newAvailability);
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setErrorMessage('No token found.');
        return;
      }

      const response = await fetch(`${url}/api/jobPost/createJob`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token,
        },
        body: JSON.stringify({
          location,
          jobDescription,
          availability,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Job details submitted');
        navigation.navigate('My Jobs List');
      } else {
        const responseText = await response.text();
        console.error('HTTP Error:', responseText);
        setErrorMessage('Error submitting job details.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Manager Dashboard</Text>
        <Text style={styles.label}>Business Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter business location"
          placeholderTextColor="#A9A9A9"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.label}>Job Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter job description"
          placeholderTextColor="#A9A9A9"
          value={jobDescription}
          onChangeText={setJobDescription}
        />
        <Text style={styles.label}>Select Working Days</Text>
        <FlatList
          data={daysOfWeek}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dayButton,
                availability[item] && styles.selectedDayButton
              ]}
              onPress={() => handleDayPress(item)}
            >
              <Text style={styles.dayText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
        {selectedDay && (
          <View style={styles.timeInputContainer}>
            <Text style={styles.label}>Set Time for {selectedDay}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter time (e.g., 9am-5pm)"
              placeholderTextColor="#A9A9A9"
              value={availability[selectedDay] || ''}
              onChangeText={handleTimeChange}
            />
          </View>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <View style={styles.availabilityContainer}>
          {Object.keys(availability).map((day) => (
            <View key={day} style={styles.availabilityItem}>
              <Text style={styles.availabilityText}>{day}: {availability[day]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Wazzifni. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#ddd',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#2e2e3e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#3a3a4a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  submitButton: {
    backgroundColor: '#4ecca3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    marginTop: 20,
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#4ecca3',
  },
  dayButton: {
    backgroundColor: '#2e2e3e',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#f39c12',
  },
  dayText: {
    color: '#fff',
  },
  timeInputContainer: {
    marginVertical: 20,
    width: '100%',
  },
  availabilityContainer: {
    marginTop: 20,
    width: '100%',
  },
  availabilityItem: {
    backgroundColor: '#2e2e3e',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  availabilityText: {
    color: '#ddd',
    fontSize: 16,
  },
  error: {
    color: '#ff0000',
    marginBottom: 10,
  },
});
