import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, FlatList, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker from the correct package

import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from './Profile_Screens/ProfileScreen';
import BusinessManagerScreen from './userDashboard/BusinessManagerScreen';
import UniversityStudentScreen from './userDashboard/UniversityStudentScreen';
import MyRequestsScreen from './userLists/MyRequestsScreen';
import MyJobsListScreen from './userLists/MyJobsListScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../url';
import Chats from './chats_Screens/Chats';  
import Chat from './chats_Screens/Chat';  
import { createStackNavigator } from '@react-navigation/stack';
import ChatSupportScreen from './chats_Screens/ChatSupportScreen';
import Icon from 'react-native-vector-icons/FontAwesome';  
import NewsScreen from './NewsScreen';
import JobApplicationsPage from './JobApplicationsPage';
import UserProfileScreen from './Profile_Screens/UserProfileScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function HomePage({ route, navigation }) {
  const { userRole } = route.params || {};
  const [jobs, setJobs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [notifications, setNotifications] = useState([]); 
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false); 
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState({});
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isRankModalVisible, setIsRankModalVisible] = useState(false);
  const [selectedRequestOrJob, setSelectedRequestOrJob] = useState(null);

  useEffect(() => {
    fetchUserDetails();
    retrieveUserId();
    fetchNotifications(); 
    if (userRole === 'University Student') {
      fetchJobs();
    } else if (userRole === 'Business Manager') {
      fetchRequests();
    }
  }, [userRole]);

  const fetchUserDetails = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/user`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setUsername(data.name);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const retrieveUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);
  };

  const fetchJobs = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/jobPost/myJobs`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const applyForJob = async (jobId) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/JobApplication/apply-job/${jobId}`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to apply for job, response:', responseText);
        return;
      }
      
      const data = await response.json();
      alert(data.message); 
  
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  const fetchRequests = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/studentRequest/myRequests`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
   // Fetch my specific jobs if I am a manager
   const fetchMyJobs = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/jobPost/myJobsOnly`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setMyJobs(data);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
    }
  };

  // Fetch my specific requests if I am a student
  const fetchMyRequests = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/studentRequest/myRequestsOnly`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setMyRequests(data);
    } catch (error) {
      console.error('Error fetching my requests:', error);
    }
  };

  const fetchNotifications = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/notification`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Error fetching notifications, response:', responseText);
        return;
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleAvailabilityChange = (day) => {
    setAvailabilityFilter((prev) => {
      if (prev[day]) {
        const updatedFilter = { ...prev };
        delete updatedFilter[day];
        return updatedFilter;
      } else {
        return { ...prev, [day]: true };
      }
    });
  };

  const markAsRead = async (notificationId) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${url}/api/notification/read/${notificationId}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId ? { ...notification, read: true } : notification
          )
        );
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  useEffect(() => {
    if (isRankModalVisible) {
      // Fetch user-specific data when the rank modal is visible
      if (userRole === 'University Student') {
        fetchMyRequests();
      } else if (userRole === 'Business Manager') {
        fetchMyJobs();
      }
    }
  }, [isRankModalVisible, userRole]);
  const CustomCheckbox = ({ label, isChecked, onChange }) => {
    return (
      <TouchableOpacity onPress={onChange} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
          {isChecked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const applyFilters = () => {
    let filteredJobs = jobs;
    let filteredRequests = requests;

    if (locationFilter) {
      filteredJobs = filteredJobs.filter(job => job.location.toLowerCase().includes(locationFilter.toLowerCase()));
      filteredRequests = filteredRequests.filter(request => request.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    if (jobTypeFilter) {
      filteredJobs = filteredJobs.filter(job => job.jobDescription.toLowerCase().includes(jobTypeFilter.toLowerCase()));
      filteredRequests = filteredRequests.filter(request => request.formerExperience.toLowerCase().includes(jobTypeFilter.toLowerCase()));
    }

    if (genderFilter && userRole === 'Business Manager') {
      filteredRequests = filteredRequests.filter(request => request.studentGender.toLowerCase() === genderFilter.toLowerCase());
    }

    if (Object.keys(availabilityFilter).length > 0) {
      filteredJobs = filteredJobs.filter(job => {
        return Object.keys(availabilityFilter).every(day => job.availability[day]);
      });

      filteredRequests = filteredRequests.filter(request => {
        return Object.keys(availabilityFilter).every(day => request.availability[day]);
      });
    }

    return { filteredJobs, filteredRequests };
  };

  const rankMostCompatible = async () => {
    if (!selectedRequestOrJob) {
      alert('Please select a request or job first.');
      return;
    }
  
    const token = await AsyncStorage.getItem('userToken');
  
    try {
      const response = await fetch(`${url}/api/matching/rank`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedRequestId: selectedRequestOrJob }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error in ranking:', errorText);
        alert('Failed to rank. Please try again.');
        return;
      }
  
      const data = await response.json();
  
      // Update the UI based on the user's role
      if (userRole === 'University Student') {
        setJobs(data.map(item => item.job));
      } else if (userRole === 'Business Manager') {
        setRequests(data.map(item => item.request));
      }
  
      setIsRankModalVisible(false); // Close the modal after ranking
    } catch (error) {
      console.error('Error ranking:', error);
    }
  };
  

  const { filteredJobs, filteredRequests } = applyFilters();

  function ChatsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Chats" component={Chats} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  function JobApplicationStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="JobApplications" component={JobApplicationsPage} options={{ headerShown: false }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => markAsRead(item._id)}
    >
      <Text style={styles.notificationText}>{item.message}</Text>
      {!item.read && <Text style={styles.unreadIndicator}>•</Text>}
    </TouchableOpacity>
  );

  const markNotificationsAsRead = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const response = await fetch(`${url}/api/notification/mark-as-read`, {
            method: 'PUT',
            headers: {
                'x-auth-token': token,
            },
        });

        if (response.ok) {
            setNotifications(prevNotifications => 
                prevNotifications.map(notification => ({
                    ...notification,
                    read: true
                }))
            );
            setIsNotificationsVisible(true);  
        } else {
            console.error('Failed to mark notifications as read');
        }
    } catch (error) {
        console.error('Error marking notifications as read:', error);
    }
  };

  const handleNotificationIconClick = () => {
    if (!isNotificationsVisible) {
        markNotificationsAsRead();
    } else {
        setIsNotificationsVisible(false);
    }
  };

  return (
    <NavigationContainer independent={true}>
      <StatusBar barStyle="light-content" backgroundColor="#317c76" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#317c76',
          },
          headerTintColor: '#eaeaea',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationIconClick}>
                <Icon name="bell" size={25} color="#fff" />
                {notifications.some(notification => !notification.read) && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.badgeText}>{notifications.filter(notification => !notification.read).length}</Text>
                    </View>
                )}
              </TouchableOpacity>
              {isNotificationsVisible && (
                <View style={styles.notificationDropdown}>
                  <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderNotificationItem}
                    ListEmptyComponent={<Text style={styles.emptyNotificationText}>No new notifications</Text>}
                  />
                </View>
              )}
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity style={styles.menuIcon} onPress={() => navigation.openDrawer()}>
              <Text style={styles.menuText}>☰</Text>
            </TouchableOpacity>
          ),
        })}
      >
        <Drawer.Screen name="Home">
          {() => (
            <View style={styles.container}>
              <View style={styles.content}>
                <Text style={styles.welcomeText}>Welcome, {username}!</Text>

                {/* Filter Button */}
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setIsFilterVisible(prev => !prev)}
                >
                  <Text style={styles.filterButtonText}>Filters</Text>
                </TouchableOpacity>

                {/* Rank Button */}
                <TouchableOpacity
                  style={styles.rankButton}
                  onPress={() => setIsRankModalVisible(true)} // Open the modal for selecting a request/job
                >
                  <Text style={styles.rankButtonText}>Rank the Most Compatible</Text>
                </TouchableOpacity>

                {/* Filters Section */}
                {isFilterVisible && (
                  <View style={styles.filtersContainer}>
                    <Text style={styles.filterLabel}>Location:</Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="Enter city"
                      placeholderTextColor="#aaa"
                      value={locationFilter}
                      onChangeText={setLocationFilter}
                    />
                    <Text style={styles.filterLabel}>Job Type / Experience:</Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="Enter job type or experience"
                      placeholderTextColor="#aaa"
                      value={jobTypeFilter}
                      onChangeText={setJobTypeFilter}
                    />
                    {userRole === 'Business Manager' && (
                      <>
                        <Text style={styles.filterLabel}>Gender:</Text>
                        <TextInput
                          style={styles.filterInput}
                          placeholder="Enter gender (e.g., male, female)"
                          placeholderTextColor="#aaa"
                          value={genderFilter}
                          onChangeText={setGenderFilter}
                        />
                      </>
                    )}
                    <Text style={styles.filterLabel}>Availability:</Text>
                    <View style={styles.availabilityContainer}>
                      {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                        <CustomCheckbox
                          key={day}
                          label={day}
                          isChecked={availabilityFilter[day]}
                          onChange={() => handleAvailabilityChange(day)}
                        />
                      ))}
                    </View>
                  </View>
                )}

                {userRole === 'University Student' ? (
                  <>
                    <Text style={styles.headerText}>Available Jobs</Text>
                    <FlatList
                      data={filteredJobs}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => renderJob({ item, navigation, userId, applyForJob })}
                      ListEmptyComponent={<Text style={styles.emptyText}>No jobs available</Text>}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.headerText}>Student Requests</Text>
                    <FlatList
                      data={filteredRequests}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => renderRequest({ item, navigation, userId })}
                      ListEmptyComponent={<Text style={styles.emptyText}>No requests available</Text>}
                    />
                  </>
                )}
              </View>
            </View>
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        {userRole === 'Business Manager' ? (
          <>
            <Drawer.Screen name="Create Job" component={BusinessManagerScreen} />
            <Drawer.Screen name="My Jobs List">
              {props => (
                <MyJobsListScreen
                  {...props}
                  route={{ params: { userRole: 'Business Manager' } }}
                />
              )}
            </Drawer.Screen>
          </>
        ) : (
          <>
            <Drawer.Screen name="Create Request" component={UniversityStudentScreen} />
            <Drawer.Screen name="My Requests">
              {props => (
                <MyRequestsScreen
                  {...props}
                  route={{ params: { userRole: 'University Student' } }}
                />
              )}
            </Drawer.Screen>
          </>
        )}
        <Drawer.Screen name="Chat Support" component={ChatSupportScreen} />
        <Drawer.Screen name="Conversions" component={ChatsStack} />
        <Drawer.Screen name="News" component={NewsScreen} />
        <Drawer.Screen name="JobApplicationsStack" component={JobApplicationStack} options={{ headerTitle: 'Job Applications', drawerLabel: 'Job Applications' }} />
      </Drawer.Navigator>

      {/* Ranking Modal */}
      <Modal
        visible={isRankModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsRankModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Request/Job to Rank</Text>
            <Picker
              selectedValue={selectedRequestOrJob}
              onValueChange={(itemValue) => setSelectedRequestOrJob(itemValue)}
              style={styles.picker}
            >
              {(userRole === 'University Student' ? myRequests : myJobs).map((item) => (
                <Picker.Item key={item._id} label={item.jobDescription || item.formerExperience} value={item._id} />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={rankMostCompatible}
            >
              <Text style={styles.modalButtonText}>Rank Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setIsRankModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#317c76',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rankButton: {
    backgroundColor: '#4ecca3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  rankButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filtersContainer: {
    width: '100%',
    marginBottom: 20,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  filterInput: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#2e2e3e',
    borderRadius: 10,
    color: '#fff',
  },
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 15,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  notificationDropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#2e2e3e',
    borderRadius: 10,
    padding: 10,
    width: 200,
    maxHeight: 300,
    zIndex: 1000,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4ecca3',
  },
  notificationText: {
    color: '#fff',
  },
  emptyNotificationText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
  menuIcon: {
    paddingRight: 10,
    paddingLeft: 20,
  },
  menuText: {
    fontSize: 24,
    color: '#fff',
  },
  headerText: {
    fontSize: 20,
    color: '#4ecca3',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
  },
  chatButton: {
    backgroundColor: '#317c76',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    minWidth: 100,
    marginRight:25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'top',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCheckbox: {
    width: 12,
    height: 12,
    backgroundColor: '#4ecca3',
  },
  checkboxChecked: {
    borderColor: '#4ecca3',
  },
  checkboxLabel: {
    color: '#fff',
    fontSize: 16,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#2e2e3e',
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nameText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#4ecca3',
    fontWeight: 'bold',
  },
  itemText: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 17,
    lineHeight: 24,
  },
  unreadIndicator: {
    color: '#ff0000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonCont:{
    display:"flex",
    flexDirection:'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    color: '#fff',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4ecca3',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: '#ff4c4c',
    fontSize: 16,
  },
});

const formatAvailability = (availability) => {
  return `\n${Object.entries(availability)
    .map(([day, hours]) => `${day}: ${hours}`)
    .join('\n')}`;
};

// Render a single job item
const renderJob = ({ item, navigation, userId ,applyForJob}) => (
  <View style={styles.itemContainer}>
    <TouchableOpacity 
      onPress={() => navigation.navigate('UserProfile', { userId: item.managerId })}
      style={styles.imageContainer}>
      <Image source={{ uri: item.managerPicture }} style={styles.image} />
      <Text style={styles.nameText}>{item.managerName}</Text>
    </TouchableOpacity>
    
    <View style={styles.rowContainer}>
      <Icon name="map-marker" size={30} color="#fff" style={styles.icon} />
      <Text style={styles.itemText}>  Location: {item.location}</Text>
    </View>
    
    <View style={styles.rowContainer}>
      <Icon name="info-circle" size={25} color="#fff" style={styles.icon} />
      <Text style={styles.itemText}> Description: {item.jobDescription}</Text>
    </View>
    
    <View style={styles.rowContainer}>
      <Icon name="calendar" size={25} color="#fff" style={styles.icon} />
      <Text style={styles.itemText}>Availability: {formatAvailability(item.availability)}</Text>
    </View>
    <View style={styles.buttonCont}>
    <TouchableOpacity
      style={styles.chatButton}
      onPress={() => navigation.navigate('Chat', { recipientId: item.managerId, contextId: item._id, userId })}
    >
      <Text style={styles.buttonText}>Chat</Text>
    </TouchableOpacity>
    <TouchableOpacity
     style={styles.chatButton}
     onPress={() => {
     applyForJob(item._id);
  }}
>
      <Text style={styles.buttonText}>Apply This Job</Text>
    </TouchableOpacity>
    </View>
  </View>
);

// Render a single request item
const renderRequest = ({ item, navigation, userId }) => (
  <View style={styles.itemContainer}>
    <TouchableOpacity 
      onPress={() => navigation.navigate('UserProfile', { userId: item.studentId })}
      style={styles.imageContainer}>
      <Image source={{ uri: item.studentPicture }} style={styles.image} />
      <Text style={styles.nameText}>{item.studentName}</Text>
    </TouchableOpacity>
    
    <View style={styles.rowContainer}>
      <Icon name="user" size={25} color="#fff" style={styles.icon} />
      <Text style={styles.itemText}>  Gender: {item.studentGender}</Text>
    </View>
    
    <View style={styles.divider} />
    
    <View style={styles.rowContainer}>
      <Icon name="map-marker" size={30} color="#fff" style={styles.icon} />
      <Text style={styles.itemText}>  Location: {item.location}</Text>
    </View>
    
    <View style={styles.divider} />
    
    <View style={styles.rowContainer}>
      <Icon name="briefcase" size={25} color="#fff" style={styles.icon} />
      <Text style={styles.itemText}>Former Experience: {item.formerExperience}</Text>
    </View>
    
    <View style={styles.divider} />
    
    <View style={styles.rowContainer}>
      <Icon name="calendar" size={25} color="#fff" style={styles.icon} />
      <Text style={styles.itemText}>Availability: {formatAvailability(item.availability)}</Text>
    </View>
    
    <TouchableOpacity
      style={styles.chatButton}
      onPress={() => navigation.navigate('Chat', { recipientId: item.studentId, contextId: item._id, userId })}
    >
      <Text style={styles.buttonText}>Chat</Text>
    </TouchableOpacity>
  </View>
);

