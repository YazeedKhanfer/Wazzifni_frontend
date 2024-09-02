import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet ,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../url';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from './Chat';  // Import the Chats component
import { useFocusEffect } from '@react-navigation/native';

const Chats = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState('');
  const Stack = createStackNavigator();
  useFocusEffect(
    useCallback(() => {
      const fetchChats = async () => {
        const token = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        setUserId(userId);

        const response = await fetch(`${url}/api/chat/rooms/${userId}`, {
          method: 'GET',
          headers: {
            'x-auth-token': token,
          },
        });

        const data = await response.json();
        setChats(data.rooms);
      };

      fetchChats();
    }, [])
  );

  const renderChatItem = ({ item }) =>{
    
    const id2=item.room.split("_");
    const currentUser= item?.user?._id===id2[0]? id2[1] : id2[0];

    return(
      
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', {  userId: currentUser ,recipientId: item.user._id })}
    >
      
      <View style={styles.chatItemContainer}>
        <Image source={{ uri: item.user.profilePicture }} style={styles.chatItemImage} />
        <Text style={styles.chatItemText}>{item.user.name}</Text>
      </View>
    </TouchableOpacity>
    )
  };

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.room}
      renderItem={renderChatItem}
      style={styles.chatList}
    />
  );
};

const styles = StyleSheet.create({
  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatItemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatItemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white',
  },
  chatList: {
    backgroundColor: '#1a1a2e',
  },
});

export default Chats;
