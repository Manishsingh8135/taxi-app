import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function SavedPlacesScreen() {
  const router = useRouter();
  const [places, setPlaces] = useState([
    { id: '1', type: 'home', name: 'Home', address: '123 Main Street, Koramangala', icon: '🏠' },
    { id: '2', type: 'work', name: 'Work', address: '456 Tech Park, Whitefield', icon: '💼' },
    { id: '3', type: 'favorite', name: 'Gym', address: 'Fitness First, Indiranagar', icon: '💪' },
    { id: '4', type: 'favorite', name: 'Mom\'s Place', address: '789 Garden View, JP Nagar', icon: '❤️' },
    { id: '5', type: 'favorite', name: 'Coffee Shop', address: 'Third Wave Coffee, HSR Layout', icon: '☕' },
  ]);

  const handleAddPlace = () => {
    router.push({
      pathname: '/(main)/search',
      params: { mode: 'save-place' },
    });
  };

  const handleEditPlace = (placeId: string) => {
    // Navigate to edit place screen
  };

  const handleDeletePlace = (placeId: string) => {
    setPlaces(places.filter(p => p.id !== placeId));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Places</Text>
        <TouchableOpacity onPress={handleAddPlace} style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.primaryPlaces}>
          <Text style={styles.sectionTitle}>Primary</Text>
          {places.filter(p => p.type === 'home' || p.type === 'work').map((place) => (
            <TouchableOpacity key={place.id} style={styles.placeCard}>
              <View style={styles.placeIconContainer}>
                <Text style={styles.placeIcon}>{place.icon}</Text>
              </View>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{place.address}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEditPlace(place.id)}>
                <Text style={styles.editIcon}>✏️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.favoritePlaces}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          {places.filter(p => p.type === 'favorite').map((place) => (
            <TouchableOpacity key={place.id} style={styles.placeCard}>
              <View style={styles.placeIconContainer}>
                <Text style={styles.placeIcon}>{place.icon}</Text>
              </View>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{place.address}</Text>
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePlace(place.id)}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addPlaceCard} onPress={handleAddPlace}>
          <View style={styles.addPlaceIconContainer}>
            <Text style={styles.addPlaceIcon}>+</Text>
          </View>
          <Text style={styles.addPlaceText}>Add a new place</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 8,
  },
  primaryPlaces: {
    marginBottom: 24,
  },
  favoritePlaces: {
    marginBottom: 24,
  },
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  placeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeIcon: {
    fontSize: 24,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  placeAddress: {
    color: '#888',
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  editIcon: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
  addPlaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  addPlaceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addPlaceIcon: {
    fontSize: 24,
    color: '#FFD700',
  },
  addPlaceText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
  },
});
