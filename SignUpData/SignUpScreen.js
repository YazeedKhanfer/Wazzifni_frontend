import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Image } from 'react-native';
import { url } from '../url';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [errorMas,setErrorMas]=useState('');
  const [errorType,setErrorType]=useState('');


  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleNext = () => {
    if (!validateEmail(email)) {
      setErrorMas('Invalid Email address.');
      setErrorType('email');
      return;
    }
    if (password.length < 8) {
      setErrorMas('Password should be at least 8 characters long.');
      setErrorType('pass');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMas('Password Mismatch');
      setErrorType('confirm');
      return;
    }
    if (role === '') {
      setErrorMas('Role Not Selected , Please select a role.');
      setErrorType('role');
      return;
    }
    if (role === 'Business Manager') {
      navigation.navigate('ManagerInfo', { email, password, role });
    } else if (role === 'University Student') {
      navigation.navigate('StudentInfo', { email, password, role });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.stepIndicator}>1/2</Text>
      <Image 
        source={require('../assets/logo.png')}
        style={{ width: 300, marginTop: -40, paddingBottom: 200 }}
      />
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
        
        <TextInput
          style={[styles.input, focusedField === 'email' && styles.inputFocused]}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField('')}
        />
        {
            errorMas && errorType==='email' && <Text style={styles.error} > {errorMas}</Text>
        }
        <TextInput
          style={[styles.input, focusedField === 'password' && styles.inputFocused]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField('')}
        />
        {
            errorMas && errorType==='pass' && < Text style={styles.error} >{errorMas}</Text>
        }
        <TextInput
          style={[styles.input, focusedField === 'confirmPassword' && styles.inputFocused]}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          onFocus={() => setFocusedField('confirmPassword')}
          onBlur={() => setFocusedField('')}
        />
        {
            errorMas && errorType==='confirm' && <Text style={styles.error} > {errorMas}</Text>
        }
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'Business Manager' && styles.roleButtonSelected]}
            onPress={() => setRole('Business Manager')}
          >
            <Text style={styles.roleButtonText}>Business Manager</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'University Student' && styles.roleButtonSelected]}
            onPress={() => setRole('University Student')}
          >
            <Text style={styles.roleButtonText}>University Student</Text>
          </TouchableOpacity>
        </View>
        {
            errorMas && errorType==='role' && < Text style={styles.error} >{errorMas}</Text>
        }
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
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
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },

  error :{
    width:'100%',
    fontWeight:'bold',
    color:'#F9AA33',
    paddingHorizontal:8,
    borderRadius:10,
    marginTop:3,
    marginBottom:-5,
  },

  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 15,
    borderRadius: 25,
    marginTop: 15,
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
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom:3 ,
  },
  roleButton: {
    backgroundColor: '#6699cc',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop:15,
  },
  roleButtonSelected: {
    backgroundColor: '#F9AA33',
    marginTop:15,
  },
  roleButtonText: {
    color: '#333300',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  nextButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  nextButtonText: {
    color: '#333300',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
