import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../url';


export default function ManagerInfoScreen({ route,navigation }) {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const {email,password,role}=route.params;
  

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${url}/api/auth/register`, {
      email,
      password,
      role,
      name,
      business,
      location,
      phoneNumber,
      profilePicture
      });
      console.log(res);
      console.log('Navigating to HomePage with role:', role);
      await AsyncStorage.setItem('userToken', res.data.token);
      navigation.navigate('HomePage', { userRole: role });
          } catch (error) {
      if (error.response) {
        console.log('Response error:', error.response.data);
      } else if (error.request) {
        console.log('Request error:', error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log('Error config:', error.config);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.stepIndicator}>2/2</Text>
      <Text style={styles.title}>Manager Information</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, focusedField === 'name' && styles.inputFocused]}
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField('')}
        />
        <TextInput
          style={[styles.input, focusedField === 'business' && styles.inputFocused]}
          placeholder="Business Type (e.g., Restaurant, Cafe)"
          placeholderTextColor="#aaa"
          value={business}
          onChangeText={setBusiness}
          onFocus={() => setFocusedField('business')}
          onBlur={() => setFocusedField('')}
        />
        <TextInput
          style={[styles.input, focusedField === 'location' && styles.inputFocused]}
          placeholder="Business Location"
          placeholderTextColor="#aaa"
          value={location}
          onChangeText={setLocation}
          onFocus={() => setFocusedField('location')}
          onBlur={() => setFocusedField('')}
        />
        <TextInput
          style={[styles.input, focusedField === 'phoneNumber' && styles.inputFocused]}
          placeholder="Phone Number"
          placeholderTextColor="#aaa"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          onFocus={() => setFocusedField('phoneNumber')}
          onBlur={() => setFocusedField('')}
        />
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'black',
    
  },
  stepIndicator: {
    position: 'absolute',
    top: 60,
    left: 10,
    fontSize: 18,
    color: '#F9AA33',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    color: '#333',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  inputFocused: {
    borderColor: '#007bff',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    width: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  finishButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    width: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
