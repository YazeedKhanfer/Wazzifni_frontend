import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUpScreen from './SignUpData/SignUpScreen';
import StudentInfoScreen from './SignUpData/StudentInfoScreen';
import ManagerInfoScreen from './SignUpData/ManagerInfoScreen';
import BusinessManagerScreen from './Screens/userDashboard/BusinessManagerScreen';
import UniversityStudentScreen from './Screens/userDashboard/UniversityStudentScreen';
import ProfileScreen from './Screens/Profile_Screens/ProfileScreen';
import HomePage from './Screens/HomePage';
import UniversityStudentProfile from './Screens/Profile_Screens/UniversityStudentProfile';
import BusinessManagerProfile from './Screens/Profile_Screens/BusinessManagerProfile';
import {url} from './url'
import { StatusBar } from 'react-native';
import Chat from './Screens/chats_Screens/Chat';
import ChatSupportScreen from './Screens/chats_Screens/ChatSupportScreen';
import UserProfileScreen from './Screens/Profile_Screens/UserProfileScreen';
import AboutUsScreen from './Screens/AboutUsScreen'; 
import JobApplicationsPage from './Screens/JobApplicationsPage';




const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errorMas,setErrorMas]=useState('');


  const handleSignIn = async () => {
    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('HTTP Error:', errorData);
        // alert(errorData.message || 'Invalid Email or Password');
        setErrorMas('Invalid Email or Password.');
        return;
      }
      
      const data = await response.json();
      console.log('Response Data:', data);

      if (data.token) {
        const decoded = jwtDecode(data.token);
        const userId = decoded.user.id; // Extract user ID from the decoded token
        const role = decoded.user.role;
        console.log('Navigating to HomePage with role:', role);
        await AsyncStorage.setItem('userToken', data.token); // Ensure token is correctly stored
        await AsyncStorage.setItem('userId', userId);
        navigation.navigate('HomePage', { userRole: role });

      } else {
        alert(data.message || 'Sign-in failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };
  

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor="#02050e" />
      <View style={styles.overlay} />
      <Image 
        source={require('./assets/logo.png')}
        style={{ width: 300, marginTop: 15 }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Making Opportunities Changing Communities</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, emailFocused && styles.inputFocused]}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
          <TextInput
            style={[styles.input, passwordFocused && styles.inputFocused]}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          {
            errorMas && < Text style={styles.error} >{errorMas}</Text>
          }
          <TouchableOpacity >
            <Text style={styles.forgotPasswordText}></Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportButton} onPress={() => navigation.navigate('AboutUs')}>
            <Text style={styles.supportButtonText}>About Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentInfo" component={StudentInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ManagerInfo" component={ManagerInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BusinessManager" component={BusinessManagerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UniversityStudent" component={UniversityStudentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UniversityStudentProfile" component={UniversityStudentProfile} />
        <Stack.Screen name="BusinessManagerProfile" component={BusinessManagerProfile} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
        <Stack.Screen name="Chat Support" component={ChatSupportScreen} options={{ headerShown: false }} />  
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerShown: true, title: 'About Us' }} />
        <Stack.Screen name="JobApplications" component={JobApplicationsPage} options={{ headerShown: true }}/>  
        
  
        </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: '#02050e',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // overlay: {
  //   position: 'absolute',
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: 'rgba(0, 0, 0 )',
  // },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4BF0FC',
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
  error :{
    width:'100%',
    fontWeight:'bold',
    color:'#F9AA33',
    paddingHorizontal:8,
    borderRadius:10,
    marginTop:1,
    marginBottom:8,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'right',
    width: '100%',
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: '#F9AA33',
    paddingVertical: 12,
    color: 'black',
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    width: '65%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  signUpButton: {
    backgroundColor: '#37966F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
    width: '65%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  supportButton: {
    backgroundColor: '#F0E68C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    width: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#232F34',
    fontSize: 18,
    fontWeight: 'bold',
  },
  supportButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
