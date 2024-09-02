import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { url } from '../url'; // Make sure this points to your backend URL
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewsScreen() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${url}/api/news`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const renderNewsItem = ({ item }) => (
    <View style={styles.newsItem}>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsContent}>{item.content}</Text>
      {item.image && <Image source={{ uri: item.image }} style={styles.newsImage} />}
      <Text style={styles.newsCategory}>Category: {item.category}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Latest News</Text>
      <FlatList
        data={news}
        keyExtractor={(item) => item._id}
        renderItem={renderNewsItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No news available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#4ecca3',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  newsItem: {
    backgroundColor: '#2e2e3e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  newsTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newsContent: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  newsCategory: {
    fontSize: 14,
    color: '#4ecca3',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
  },
});
