import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet ,ScrollView,StatusBar  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { url } from '../../url';

const UserProfileScreen = ({ route ,navigation}) => {
  const { userId } = route.params;
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${url}/api/user/${userId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  if (!userDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: userDetails.profilePicture }}
          style={styles.profilePicture}
        />
        <Text style={styles.nameText}>{userDetails.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        {userDetails.email && (
          <View style={styles.infoRow}>
            <Icon name="email" size={24} color="#008080" />
            <Text style={styles.infoText}>{userDetails.email}</Text>
          </View>
        )}
        {userDetails.universityName && (
          <View style={styles.infoRow}>
            <Icon name="school" size={24} color="#008080" />
            <Text style={styles.infoText}>{userDetails.universityName}</Text>
          </View>
        )}
        {userDetails.major && (
          <View style={styles.infoRow}>
            <Icon name="book" size={24} color="#008080" />
            <Text style={styles.infoText}>{userDetails.major}</Text>
          </View>
        )}
        {userDetails.location && (
          <View style={styles.infoRow}>
            <Icon name="location-on" size={24} color="#008080" />
            <Text style={styles.infoText}>{userDetails.location}</Text>
          </View>
        )}
        {userDetails.year && (
          <View style={styles.infoRow}>
            <Icon name="calendar-today" size={24} color="#008080" />
            <Text style={styles.infoText}>{userDetails.year} Year</Text>
          </View>
        )}
        {userDetails.phoneNumber && (
          <View style={styles.infoRow}>
            <Icon name="phone" size={24} color="#008080" />
            <Text style={styles.infoText}>{userDetails.phoneNumber}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 25,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#1a1a2e',
    padding: 10,
    borderRadius: 40,
  },
  profilePicture: {
    width: 250,
    height: 250,
    borderRadius: 300,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: '#b2d8d8',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#b2d8d8',
    padding: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
  },
  infoText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'black',
  },
});

export default UserProfileScreen;
