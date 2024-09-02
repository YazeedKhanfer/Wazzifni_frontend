import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../url';

const supportTopics = {
  UniversityStudent: [
    { label: 'How to create a request', key: 'createRequest' },
    { label: 'How to find a good job', key: 'findJob' },
    { label: 'How to edit my information', key: 'editInfo' },
    { label: 'How to use filters', key: 'useFilters' },
    { label: 'How to edit my request', key: 'editRequest' },
  ],
  BusinessManager: [
    { label: 'How to create a job', key: 'createJob' },
    { label: 'How to find applicable employees', key: 'findEmployee' },
    { label: 'How to edit my information', key: 'editInfo' },
    { label: 'How to use filters', key: 'useFilters' },
    { label: 'How to edit my job', key: 'editJob' },
  ],
};

const topicDescriptions = {
  createRequest: 'To create a request, start from the home page by clicking the drawer button (☰) on the top left of the screen, then press "Create Request".\n\nYou will be taken to the Student Dashboard Screen. Enter the location where you need the service, fill out the request details, select the days you are available, and then submit. This is how you can create a request.',
  createJob: 'To create a job, start from the home page by clicking the drawer button (☰) on the top left of the screen, then press "Create Job".\n\nYou will be taken to the Manager Dashboard Screen. Enter the job location, fill out the job description, select the working days you require from the employee, and then submit. This is how you can create a job.',
  findJob: 'To find a good job, browse through available jobs, use filters to narrow down your search, and apply to jobs that match your skills.',
  findEmployee: 'To find applicable employees, browse through student requests from the home page, use filters to find suitable candidates, and contact them.',
  editInfo: 'To edit your information, click the drawer button (☰) on the top left, then select "Profile." Click the "Edit" button, update the fields you want to change, and save the changes.',
  useFilters: 'To use filters, click on the "Filters" button, select the criteria that match your preferences, and apply the filters to see relevant results.',
  editRequest: 'To edit your request, click the drawer button (☰) at the top left, go to the "My Requests" section, select the request you want to edit, make the necessary changes, and save.',
  editJob: 'To edit your job, click the drawer button (☰) at the top left, go to the "My Jobs List" section, select the job you want to edit, make the necessary changes, and save.',
};

const ChatSupportScreen = () => {
  const [userRole, setUserRole] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${url}/api/user`, {
          method: 'GET',
          headers: {
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        const sanitizedRole = data.role.trim().replace(/\s/g, ''); 
        setUserRole(sanitizedRole);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserRole();
  }, []);

  if (!userRole) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
     <StatusBar barStyle="light-content" backgroundColor="#317c76" />
      <Text style={styles.header}>Support Topics</Text>
      <View style={styles.buttonContainer}>
        {supportTopics[userRole]?.map((topic) => (
          <TouchableOpacity
            key={topic.key}
            style={styles.button}
            onPress={() => setSelectedTopic(topic.key)}
          >
            <Text style={styles.buttonText}>{topic.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTopic && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {topicDescriptions[selectedTopic]}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({

    container: {
      padding: 20,
      height:1000,
      backgroundColor: '#1a1a2e', 
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff', 
      marginBottom: 20,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#317c76',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    descriptionContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#2e2e4d', 
        borderRadius: 15, 
        borderColor: '#4ecca3', 
        borderWidth: 1, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8, 
      },
      descriptionText: {
        fontSize: 16,
        color: '#f5f5f5', 
        lineHeight: 24, 
        textAlign: 'justify', 
      },
    loadingText: {
      color: '#fff', 
      textAlign: 'center',
      marginTop: 20,
      fontSize: 18,
    },
  });
  
  export default ChatSupportScreen;
