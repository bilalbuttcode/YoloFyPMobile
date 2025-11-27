import React from 'react';
import { View, Image, Text, ScrollView, StyleSheet } from 'react-native';

const ShowImageScreen = ({ route }) => {
  const { imageUrl, detections } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Detections:</Text>
      {detections.length > 0 ? (
        detections.map((item, index) => (
          <Text key={index} style={styles.item}>
            {index + 1}. {item.label} ({(item.confidence * 100).toFixed(1)}%)
          </Text>
        ))
      ) : (
        <Text>No objects detected.</Text>
      )}
    </ScrollView>
  );
};

export default ShowImageScreen;

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  image: { width: '100%', height: 300, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  item: { fontSize: 16, marginBottom: 5 },
});
