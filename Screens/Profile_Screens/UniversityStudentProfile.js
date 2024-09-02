import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../url';
import * as ImagePicker from "expo-image-picker";

export default function UniversityStudentProfile({ user, onUserUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    universityName: user.universityName,
    major: user.major,
    location: user.location,
    year: user.year,
    phoneNumber: user.phoneNumber,
    profileImage: user.profilePicture, // Ensure this is set correctly
  });
  const [errorMas, setErrorMas] = useState('');

  // Default image URL
  const defaultProfileImage = require('../../assets/image.png');

  // Update formData when user prop changes
  useEffect(() => {
    setFormData({
      universityName: user.universityName,
      major: user.major,
      location: user.location,
      year: user.year,
      phoneNumber: user.phoneNumber,
      profileImage: user.profilePicture,
    });
  }, [user]);

  // Handle input change
  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleFormSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setErrorMas('No token found.');
        return;
      }
  
      // Create FormData object
      const form = new FormData();
      form.append('universityName', formData.universityName);
      form.append('major', formData.major);
      form.append('location', formData.location);
      form.append('year', formData.year);
      form.append('phoneNumber', formData.phoneNumber);
  
      // Handle image upload
      if (formData.profileImage) {
        const file = {
          uri: formData.profileImage,
          type: "image/jpeg", // Ensure this matches the file type
          name: "profileImage.jpg", // Adjust the file name as needed
        };
        form.append('image', file);
      }
  
      // Sending request
      const response = await fetch(`${url}/api/user/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: form,
      });
  
      if (!response.ok) {
        const responseText = await response.text();
        console.error('HTTP Error:', responseText);
        setErrorMas('Update failed.');
        return;
      }
  
      const updatedUser = await response.json();
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      setEditMode(false);
      setErrorMas('');
    } catch (error) {
      console.error('Error:', error);
      setErrorMas('An error occurred.');
    }
  };

  // Open image picker to select a new profile picture
  const pickImage = async () => {
    if (!editMode) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, profileImage: result.assets[0].uri });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={(formData.profileImage && formData.profileImage.length) ? { uri: formData.profileImage } : defaultProfileImage}
          style={styles.profilePicture}
        />
        <Text style={styles.nameText}>{user.name}</Text>
      </View>
      {editMode ? (
        <View style={styles.infoContainer}>
          <TextInput
            style={styles.input}
            placeholder="University Name"
            value={formData.universityName}
            onChangeText={(value) => handleInputChange('universityName', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Major"
            value={formData.major}
            onChangeText={(value) => handleInputChange('major', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Year"
            value={formData.year}
            onChangeText={(value) => handleInputChange('year', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
          />

          {/* Change Photo Button */}
          <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Change Photo</Text>
          </TouchableOpacity>

          {errorMas && <Text style={styles.error}>{errorMas}</Text>}
          <TouchableOpacity style={styles.cancelButton} onPress={handleFormSubmit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditMode(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Icon name="email" size={24} color="#008080" />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="school" size={24} color="#008080" />
              <Text style={styles.infoText}>{user.universityName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="book" size={24} color="#008080" />
              <Text style={styles.infoText}>{user.major}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="location-on" size={24} color="#008080" />
              <Text style={styles.infoText}>{user.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="calendar-today" size={24} color="#008080" />
              <Text style={styles.infoText}>{user.year} Year</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="phone" size={24} color="#008080" />
              <Text style={styles.infoText}>{user.phoneNumber}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

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
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#F9AA33',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  changePhotoButton: {
    backgroundColor: '#4ecca3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F9AA33',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
