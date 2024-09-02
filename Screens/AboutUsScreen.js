import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutUsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.paragraph}>
        Welcome to our app! This platform is dedicated to making opportunities and changing communities.
        Our mission is to connect university students with business managers to create a mutually beneficial
        relationship where students can find job opportunities that fit their schedules, and businesses
        can find talented individuals to join their teams.
      </Text>
      <Text style={styles.paragraph}>
        We believe in the power of community and collaboration, and we are committed to providing the best
        possible experience for both students and business managers. Thank you for being a part of this journey!
      </Text>
      {/* Add more paragraphs or sections as needed */}
    </ScrollView>
  );
}

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#02050e',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4BF0FC',
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'justify',
  },
});
