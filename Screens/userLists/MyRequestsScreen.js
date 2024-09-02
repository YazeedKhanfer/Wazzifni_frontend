import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {jwtDecode} from 'jwt-decode';
import { url } from '../../url';

const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function MyRequestsScreen({ route, navigation }) {
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [location, setLocation] = useState('');
  const [formerExperience, setFormerExperience] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [availability, setAvailability] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRequests = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const decodedToken = jwtDecode(token);

    const userEmail = decodedToken.user.email;
    console.log('Token:', token);
    console.log('User Email:', userEmail); // Ensure this line prints the correct email
    try {
      const response = await fetch(`${url}/api/studentRequest/myRequestsOnly`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      console.log('Fetch Requests Response:', data);

      // Filter requests to only include those made by the signed-in user
      const userRequests = data.filter(request => request.studentEmail === userEmail);
      setRequests(userRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  useEffect(() => {
    if (route.params?.refresh) {
      fetchRequests();
    }
  }, [route.params?.refresh]);

  const handleEdit = (request) => {
    setEditingRequest(request._id);
    setLocation(request.location);
    setFormerExperience(request.formerExperience);
    setAvailability(request.availability);
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
      const response = await fetch(`${url}/api/studentRequest/updateRequest/${editingRequest}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          location,
          formerExperience,
          availability,
        }),
      });
      if (response.ok) {
        fetchRequests(); // Refresh request list
        setEditingRequest(null);
        Alert.alert('Success', 'Request updated successfully');
      } else {
        const responseText = await response.text();
        console.error('HTTP Error:', responseText);
        setErrorMessage('Error updating request details.');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      setErrorMessage('An error occurred.');
    }
  };

  const handleDelete = async (requestId) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/studentRequest/deleteRequest/${requestId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });
      if (response.ok) {
        setRequests(requests.filter(request => request._id !== requestId));
        Alert.alert('Success', 'Request deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const formatAvailability = (availability) => {
    return `\n${Object.entries(availability)
      .map(([day, hours]) => `${day}: ${hours}`)
      .join('\n')}`;
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text style={styles.requestText}>Location: {item.location}</Text>
      <Text style={styles.requestText}>Former Experience: {item.formerExperience}</Text>
      <Text style={styles.requestText}>Availability: {formatAvailability(item.availability)}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      {editingRequest === item._id && (
        <View style={styles.editContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            placeholderTextColor="#A9A9A9"
            value={location}
            onChangeText={setLocation}
          />
          <Text style={styles.label}>Former Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your former experience"
            placeholderTextColor="#A9A9A9"
            value={formerExperience}
            onChangeText={setFormerExperience}
          />
          <Text style={styles.label}>Select Available Days</Text>
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
                placeholder="Enter time (e.g., 2pm-6pm)"
                placeholderTextColor="#A9A9A9"
                value={availability[selectedDay] || ''}
                onChangeText={handleTimeChange}
              />
            </View>
          )}
          <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update Request</Text>
          </TouchableOpacity>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={renderRequest}
        ListEmptyComponent={<Text style={styles.noRequestsText}>No requests available</Text>}
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
  requestContainer: {
    padding: 15,
    backgroundColor: '#2e2e3e',
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  requestText: {
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
  noRequestsText: {
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