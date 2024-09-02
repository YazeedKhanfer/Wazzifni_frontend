import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url } from '../url';

export default function StudentInfoScreen({ route, navigation }) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(null);
  const [gender,setGender]= useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [universityName, setUniversityName] = useState('');
  const [major, setMajor] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [year, setYear] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const {email,password,role}=route.params;
  

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthday(currentDate);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${url}/api/auth/register`, {
        email,
        password,
        role,
        name,
        birthday,
        gender,
        universityName,
        major,
        location,
        year,
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
      <Text style={styles.title}>Student Information</Text>
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
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, focusedField === 'birthday' && styles.inputFocused]}
        >
          <Text style={styles.dateText}>
            {birthday ? birthday.toLocaleDateString() : 'Birth Date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthday || new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        <View style={[styles.input, focusedField === 'universityName' && styles.inputFocused]}>
          <Picker
            selectedValue={universityName}
            onValueChange={(itemValue) => setUniversityName(itemValue)}
            style={{ color: '#333',height:25,paddingTop:45}}
          >
            <Picker.Item label="Select University" value="" />
            <Picker.Item label="Arab American University" value="Arab American University" />
            <Picker.Item label="An-Najah National University" value="An-Najah National University" />
            <Picker.Item label="Birzeit University" value="Birzeit University" />
          </Picker>
        </View>

        <View style={[styles.input, focusedField === 'gender' && styles.inputFocused]}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={{ color: '#333',height:25,paddingTop:45}}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male ♂" value="Male" />
            <Picker.Item label="Female ♀" value="Female" />
          </Picker>
        </View>

        <TextInput
          style={[styles.input, focusedField === 'major' && styles.inputFocused]}
          placeholder="University Major"
          placeholderTextColor="#aaa"
          value={major}
          onChangeText={setMajor}
          onFocus={() => setFocusedField('major')}
          onBlur={() => setFocusedField('')}
        />
        <TextInput
          style={[styles.input, focusedField === 'location' && styles.inputFocused]}
          placeholder="Location"
          placeholderTextColor="#aaa"
          value={location}
          onChangeText={setLocation}
          onFocus={() => setFocusedField('location')}
          onBlur={() => setFocusedField('')}
        />
        <TextInput
          style={[styles.input, focusedField === 'year' && styles.inputFocused]}
          placeholder="Year in University"
          placeholderTextColor="#aaa"
          value={year}
          onChangeText={setYear}
          onFocus={() => setFocusedField('year')}
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
    paddingVertical: 10,
    paddingHorizontal: 15,
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
  dateText: {
    color: '#aaa',
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
