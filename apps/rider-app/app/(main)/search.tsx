import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';

interface Place {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

const RECENT_PLACES: Place[] = [
  { id: '1', name: 'Home', address: '123 Main Street, City' },
  { id: '2', name: 'Work', address: '456 Business Park, Downtown' },
  { id: '3', name: 'Airport', address: 'International Airport Terminal 1' },
];

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const isPickup = params.type === 'pickup';
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setCurrentLocation(loc);
      }
    })();
  }, []);

  const searchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Mock search results - replace with Google Places API
    setTimeout(() => {
      const mockResults: Place[] = [
        { id: 'p1', name: text + ' Station', address: '123 ' + text + ' Road', lat: 12.9716, lng: 77.5946 },
        { id: 'p2', name: text + ' Mall', address: '456 ' + text + ' Avenue', lat: 12.9616, lng: 77.6046 },
        { id: 'p3', name: text + ' Park', address: '789 ' + text + ' Street', lat: 12.9516, lng: 77.5846 },
      ];
      setResults(mockResults);
      setLoading(false);
    }, 500);
  };

  const selectPlace = (place: Place) => {
    Keyboard.dismiss();
    router.navigate({
      pathname: '/(main)/booking',
      params: {
        [isPickup ? 'pickupName' : 'dropName']: place.name,
        [isPickup ? 'pickupAddress' : 'dropAddress']: place.address,
        [isPickup ? 'pickupLat' : 'dropLat']: place.lat?.toString() || '12.9716',
        [isPickup ? 'pickupLng' : 'dropLng']: place.lng?.toString() || '77.5946',
      },
    });
  };

  const useCurrentLocation = () => {
    if (currentLocation) {
      router.navigate({
        pathname: '/(main)/booking',
        params: {
          pickupName: 'Current Location',
          pickupAddress: 'Your current location',
          pickupLat: currentLocation.coords.latitude.toString(),
          pickupLng: currentLocation.coords.longitude.toString(),
        },
      });
    }
  };

  const renderPlaceItem = ({ item }: { item: Place }) => (
    <TouchableOpacity style={styles.placeItem} onPress={() => selectPlace(item)}>
      <View style={styles.placeIcon}>
        <Text style={styles.placeIconText}>📍</Text>
      </View>
      <View style={styles.placeDetails}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{isPickup ? 'Set pickup' : 'Where to?'}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a place..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={searchPlaces}
          autoFocus
        />
        {loading && <ActivityIndicator style={styles.loader} color="#FFD700" />}
      </View>

      {isPickup && currentLocation && (
        <TouchableOpacity style={styles.currentLocationBtn} onPress={useCurrentLocation}>
          <Text style={styles.currentLocationIcon}>📍</Text>
          <Text style={styles.currentLocationText}>Use current location</Text>
        </TouchableOpacity>
      )}

      {query.length === 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Places</Text>
          <FlatList
            data={RECENT_PLACES}
            keyExtractor={(item) => item.id}
            renderItem={renderPlaceItem}
            scrollEnabled={false}
          />
        </View>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderPlaceItem}
          style={styles.resultsList}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    color: '#FFD700',
    fontSize: 24,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  loader: {
    position: 'absolute',
    right: 36,
  },
  currentLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  currentLocationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  currentLocationText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  resultsList: {
    flex: 1,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  placeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeIconText: {
    fontSize: 18,
  },
  placeDetails: {
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
});
