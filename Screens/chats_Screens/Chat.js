import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, StatusBar, Image } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../url';

const socket = io(url); // Connect to your backend URL

const Chat = ({ route }) => {
    const { recipientId, userId } = route.params;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState({});
    const flatListRef = useRef(null);

    useEffect(() => {
        socket.emit('joinRoom', { userId, recipientId });

        // Fetch chat history and recipient details
        const fetchChatData = async () => {
            const token = await AsyncStorage.getItem('userToken');

            // Fetch chat history
            const historyResponse = await fetch(`${url}/api/user/history/${recipientId}`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                },
            });

            const historyData = await historyResponse.json();
            
            setMessages(historyData);
              
            // Fetch recipient details
            const recipientResponse = await fetch(`${url}/api/user/${recipientId}`, {
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                },
            });

            const recipientData = await recipientResponse.json();
            setRecipient(recipientData);
        };

        fetchChatData();

        socket.on('message', (msg) => {
            console.log(msg);
            setMessages((prevMessages) => [...prevMessages, msg]);

        });

        return () => {
            socket.off('message');
        };
    }, [recipientId, userId]);

    const sendMessage = async () => {
        if (message.trim()) {
            socket.emit('chatMessage', { userId, recipientId, message });
            setMessage('');

            // Save the message to the database immediately
            const token = await AsyncStorage.getItem('userToken');
            await fetch(`${url}/api/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ recipientId, message }),
            });
        } else {
            console.error('Message is empty');
        }
    };

    const renderItem = ({ item }) => {
        const isMyMessage = item?.sender?._id === userId;
        const senderName = isMyMessage ? "YOU" : item?.sender?.name;
        
        // console.log(item?.sender?._id);
        // console.log('user',userId);


        return (
            <View
                style={[
                    styles.messageContainer,
                    isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
                ]}
            >
                <Text style={[styles.senderName, isMyMessage ? styles.mySenderName : styles.theirSenderName]}>
                    {senderName}
                </Text>
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
        );
    };

    useEffect(() => {
        // Scroll to bottom whenever messages change
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
            {/* Chat Header */}
            <View style={styles.headerContainer}>
                <Image source={{ uri: recipient.profilePicture }} style={styles.recipientImage} />
                <Text style={styles.recipientName}>{recipient.name}</Text>
            </View>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
                ref={flatListRef}
                style={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#1a1a2e',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom:5,
    },
    recipientImage: {
        width: 50,
        height: 50,
        borderRadius: 20,
        marginRight: 10,
    },
    recipientName: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    messageList: {
        paddingHorizontal: 10,
    },
    messageContainer: {
        maxWidth: '75%',
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
        backgroundColor: '#4ecca3',
        borderTopRightRadius: 0,
    },
    theirMessageContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5e5',
        borderTopLeftRadius: 0,
    },
    messageText: {
        color: '#000',
        fontSize: 16,
    },
    senderName: {
        fontSize: 12,
        marginBottom: 2,
        fontWeight:'bold'
    },
    mySenderName: {
        color: '#fff',
        textAlign: 'right',
    },
    theirSenderName: {
        color: '#2b6e29',
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#1a1a2e',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
    },
    sendButton: {
        marginLeft: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#4ecca3',
        borderRadius: 20,
    },
    sendButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default Chat;
