import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../url';
import { useFocusEffect } from '@react-navigation/native';
import ProfileScreen from './Profile_Screens/ProfileScreen';
import UserProfile from './Profile_Screens/UserProfileScreen';

const JobApplicationsPage = ({ navigation }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondedApplications, setRespondedApplications] = useState({});
 

  


  const fetchApplications = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${url}/api/JobApplication/job-applications`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchApplications();
    }, [fetchApplications])
  );

  const handleResponse = async (applicationId, status) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${url}/api/JobApplication/respond-application`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit response.');
      }

      setRespondedApplications(prevState => ({ ...prevState, [applicationId]: status }));

      alert(`Application ${status} successfully!`);
      fetchApplications();
    } catch (error) {
      console.error('Error in handleResponse:', error);
      alert('Failed to submit response.');
    }
  };
//   <TouchableOpacity 
//   onPress={() => navigation.navigate('UserProfile', { userId: item.studentId })}
//   style={styles.imageContainer}>
//   <Image source={{ uri: item.studentPicture }} style={styles.image} />
//   <Text style={styles.nameText}>{item.studentName}</Text>
// </TouchableOpacity>

  const renderItem = ({ item, navigation  }) => (
    <View style={styles.applicationContainer}>
      <TouchableOpacity
        onPress={() => {
          console.log('Navigating to UserProfile with studentId:', item.studentId._id);
          navigation.navigate('UserProfile', { userId: item.studentId._id });
        }}
      >
        <Text style={styles.applicationTitle}>Applicant: {item.studentId.name}</Text>
      </TouchableOpacity>
      <Text style={styles.jobDescription}>Job Description: {item.jobId.jobDescription}</Text>
      <View style={styles.buttonContainer}>
        {respondedApplications[item._id] ? (
          <Text style={styles.responseMessage}>
            {respondedApplications[item._id] === 'accepted' ? 'Accepted successfully' : 'Rejected successfully'}
          </Text>
        ) : (
          <>
            <Button title="Accept" onPress={() => handleResponse(item._id, 'accepted')} color="#4CAF50" />
            <Button title="Reject" onPress={() => handleResponse(item._id, 'rejected')} color="#F44336" />
          </>
        )}
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;

  return (
    <FlatList
      data={applications}
      renderItem={({ item }) => renderItem({ item, navigation })}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  applicationContainer: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#2a2a3a',
    borderColor: '#4ecca3',
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  applicationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  jobDescription: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  responseMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50', 
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
  },
});

export default JobApplicationsPage;
