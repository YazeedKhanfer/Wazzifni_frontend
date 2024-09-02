import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {jwtDecode} from 'jwt-decode';
import { url } from '../../url';

const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function MyJobsListScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [location, setLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [availability, setAvailability] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );

  const fetchJobs = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const decodedToken = jwtDecode(token);

    const userEmail = decodedToken.user.email;
    console.log('Token:', token);
    console.log('User Email:', userEmail); // Add this line
    try {
      const response = await fetch(`${url}/api/jobPost/myJobsOnly`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      console.log('Fetch Jobs Response:', data);

      // Filter jobs to only include those created by the signed-in user
      const userJobs = data.filter(job => job.managerEmail === userEmail);
      setJobs(userJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job._id);
    setLocation(job.location);
    setJobDescription(job.jobDescription);
    setAvailability(job.availability);
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

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/jobPost/updateJob/${editingJob}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          location,
          jobDescription,
          availability,
        }),
      });
      if (response.ok) {
        fetchJobs(); // Refresh job list
        setEditingJob(null);
        Alert.alert('Success', 'Job updated successfully');
      } else {
        const responseText = await response.text();
        console.error('HTTP Error:', responseText);
        setErrorMessage('Error updating job details.');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setErrorMessage('An error occurred.');
    }
  };

  const handleDelete = async (jobId) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/jobPost/deleteJob/${jobId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });
      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== jobId));
        Alert.alert('Success', 'Job deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const formatAvailability = (availability) => {
    return `\n${Object.entries(availability)
      .map(([day, hours]) => `${day}: ${hours}`)
      .join('\n')}`;
  };

  const renderJob = ({ item }) => (
    <View style={styles.jobContainer}>
      <Text style={styles.jobText}>Location: {item.location}</Text>
      <Text style={styles.jobText}>Description: {item.jobDescription}</Text>
      <Text style={styles.jobText}>Availability: {formatAvailability(item.availability)}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      {editingJob === item._id && (
        <View style={styles.editContainer}>
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
                onPress={() => setSelectedDay(item)}
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
          <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update Job</Text>
          </TouchableOpacity>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item._id}
        renderItem={renderJob}
        ListEmptyComponent={<Text style={styles.noJobsText}>No jobs available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  jobContainer: {
    padding: 15,
    backgroundColor: '#2e2e3e',
    borderRadius: 10,
    marginBottom: 15,
  },
  jobText: {
    color: '#fff',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4ecca3',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  noJobsText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  editContainer: {
    marginTop: 20,
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 10,
    borderColor: '#4ecca3',
    borderWidth: 1,
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
    width: '100%',
    marginTop: 20,
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
  error: {
    color: '#ff0000',
    marginBottom: 10,
  },
});