import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { url } from '../../url';
import UniversityStudentProfile from './UniversityStudentProfile';
import BusinessManagerProfile from './BusinessManagerProfile';


export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${url}/api/user`, {
        headers: {
          'x-auth-token': token,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data', error.response || error.message || error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Failed to load user data</Text>
      </View>
    );
  }

  if (user.role === 'University Student') {
    return (
      <UniversityStudentProfile
        user={user}
        onUserUpdate={(updatedUser) => setUser(updatedUser)} // Pass the callback function
      />
    );
  } else if (user.role === 'Business Manager') {
    return (
      <BusinessManagerProfile
        user={user}
        onUserUpdate={(updatedUser) => setUser(updatedUser)} // Pass the callback function
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Unknown user role</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#000',
    marginBottom: 10,
  },
});
