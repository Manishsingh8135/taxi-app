import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️ Map will render here</Text>
        {location && (
          <Text style={styles.coordsText}>
            {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      <View style={styles.bottomSheet}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(main)/search')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Where to?</Text>
        </TouchableOpacity>

        <View style={styles.quickPlaces}>
          <TouchableOpacity style={styles.placeItem}>
            <Text style={styles.placeIcon}>🏠</Text>
            <Text style={styles.placeText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.placeItem}>
            <Text style={styles.placeIcon}>💼</Text>
            <Text style={styles.placeText}>Work</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#666',
    fontSize: 18,
  },
  coordsText: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
  bottomSheet: {
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchText: {
    color: '#888',
    fontSize: 18,
  },
  quickPlaces: {
    flexDirection: 'row',
    gap: 12,
  },
  placeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  placeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  placeText: {
    color: '#fff',
    fontSize: 16,
  },
});
