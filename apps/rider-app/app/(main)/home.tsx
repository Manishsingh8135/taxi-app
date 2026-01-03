import { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  ScrollView,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const COLLAPSED_HEIGHT = height * 0.35;
const HALF_HEIGHT = height * 0.55;
const EXPANDED_HEIGHT = height * 0.85;

export default function HomeScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const sheetHeight = useRef(new Animated.Value(HALF_HEIGHT)).current;
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sheetHeight.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        const newHeight = -gestureState.dy;
        sheetHeight.setValue(newHeight);
      },
      onPanResponderRelease: (_, gestureState) => {
        sheetHeight.flattenOffset();
        const currentHeight = (sheetHeight as any)._value;
        
        let snapTo = HALF_HEIGHT;
        if (gestureState.dy > 50) {
          snapTo = currentHeight < HALF_HEIGHT ? COLLAPSED_HEIGHT : HALF_HEIGHT;
        } else if (gestureState.dy < -50) {
          snapTo = currentHeight > HALF_HEIGHT ? EXPANDED_HEIGHT : HALF_HEIGHT;
        } else {
          if (currentHeight < (COLLAPSED_HEIGHT + HALF_HEIGHT) / 2) {
            snapTo = COLLAPSED_HEIGHT;
          } else if (currentHeight < (HALF_HEIGHT + EXPANDED_HEIGHT) / 2) {
            snapTo = HALF_HEIGHT;
          } else {
            snapTo = EXPANDED_HEIGHT;
          }
        }

        Animated.spring(sheetHeight, {
          toValue: snapTo,
          useNativeDriver: false,
          tension: 50,
          friction: 10,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const handleSearchPress = () => {
    router.push({
      pathname: '/(main)/search',
      params: { type: 'drop' },
    });
  };

  const handleQuickPlace = (place: string) => {
    router.push({
      pathname: '/(main)/booking',
      params: {
        pickupName: 'Current Location',
        pickupLat: location?.coords.latitude.toString() || '12.9716',
        pickupLng: location?.coords.longitude.toString() || '77.5946',
        dropName: place,
        dropAddress: place === 'Home' ? '123 Main Street' : '456 Business Park',
        dropLat: place === 'Home' ? '12.9616' : '12.9816',
        dropLng: place === 'Home' ? '77.5846' : '77.6046',
      },
    });
  };

  const handleMenuPress = () => {
    router.push('/(main)/profile' as any);
  };

  const recentPlaces = [
    { id: '1', name: 'Airport Terminal 1', address: 'International Airport', lat: 12.9941, lng: 77.7096 },
    { id: '2', name: 'Central Mall', address: 'MG Road, Downtown', lat: 12.9758, lng: 77.6096 },
    { id: '3', name: 'Tech Park', address: 'Whitefield, Electronic City', lat: 12.9698, lng: 77.7500 },
  ];

  const handleRecentPlace = (place: typeof recentPlaces[0]) => {
    router.push({
      pathname: '/(main)/booking',
      params: {
        pickupName: 'Current Location',
        pickupLat: location?.coords.latitude.toString() || '12.9716',
        pickupLng: location?.coords.longitude.toString() || '77.5946',
        dropName: place.name,
        dropAddress: place.address,
        dropLat: place.lat.toString(),
        dropLng: place.lng.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location?.coords.latitude || 12.9716,
          longitude: location?.coords.longitude || 77.5946,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      />

      <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.notificationButton}>
        <Text style={styles.notificationIcon}>🔔</Text>
      </TouchableOpacity>

      <Animated.View 
        style={[styles.bottomSheet, { height: sheetHeight }]}
      >
        <View {...panResponder.panHandlers} style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <ScrollView 
          style={styles.sheetContent} 
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchText}>Where to?</Text>
            <View style={styles.searchNow}>
              <Text style={styles.searchNowText}>Now ▼</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.quickPlaces}>
            <TouchableOpacity style={styles.placeItem} onPress={() => handleQuickPlace('Home')}>
              <View style={styles.placeIconContainer}>
                <Text style={styles.placeIcon}>🏠</Text>
              </View>
              <Text style={styles.placeText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.placeItem} onPress={() => handleQuickPlace('Work')}>
              <View style={styles.placeIconContainer}>
                <Text style={styles.placeIcon}>💼</Text>
              </View>
              <Text style={styles.placeText}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.placeItem} onPress={() => router.push('/(main)/saved-places' as any)}>
              <View style={styles.placeIconContainer}>
                <Text style={styles.placeIcon}>⭐</Text>
              </View>
              <Text style={styles.placeText}>Saved</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.placeItem}>
              <View style={styles.placeIconContainer}>
                <Text style={styles.placeIcon}>⏱️</Text>
              </View>
              <Text style={styles.placeText}>Schedule</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.suggestionsSection}>
            <Text style={styles.sectionTitle}>Suggestions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
              <TouchableOpacity style={styles.suggestionCard}>
                <Text style={styles.suggestionIcon}>🚗</Text>
                <Text style={styles.suggestionTitle}>Ride</Text>
                <Text style={styles.suggestionSubtitle}>Go anywhere</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.suggestionCard}>
                <Text style={styles.suggestionIcon}>📦</Text>
                <Text style={styles.suggestionTitle}>Package</Text>
                <Text style={styles.suggestionSubtitle}>Send items</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.suggestionCard}>
                <Text style={styles.suggestionIcon}>🚐</Text>
                <Text style={styles.suggestionTitle}>Rental</Text>
                <Text style={styles.suggestionSubtitle}>By the hour</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Places</Text>
              <TouchableOpacity onPress={() => router.push('/(main)/ride-history' as any)}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            {recentPlaces.map((place) => (
              <TouchableOpacity 
                key={place.id} 
                style={styles.recentItem}
                onPress={() => handleRecentPlace(place)}
              >
                <View style={styles.recentIconContainer}>
                  <Text style={styles.recentIcon}>📍</Text>
                </View>
                <View style={styles.recentText}>
                  <Text style={styles.recentName}>{place.name}</Text>
                  <Text style={styles.recentAddress}>{place.address}</Text>
                </View>
                <Text style={styles.recentArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.promoSection}>
            <View style={styles.promoCard}>
              <Text style={styles.promoIcon}>🎁</Text>
              <View style={styles.promoText}>
                <Text style={styles.promoTitle}>Invite friends, earn rewards</Text>
                <Text style={styles.promoSubtitle}>Get ₹100 off on your next ride</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  menuButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 20,
  },
  notificationButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationIcon: {
    fontSize: 20,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  handleContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
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
    flex: 1,
  },
  searchNow: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  searchNowText: {
    color: '#fff',
    fontSize: 12,
  },
  quickPlaces: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  placeItem: {
    alignItems: 'center',
    flex: 1,
  },
  placeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeIcon: {
    fontSize: 24,
  },
  placeText: {
    color: '#fff',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#1a1a1a',
    marginVertical: 16,
  },
  suggestionsSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  suggestionsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  suggestionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 100,
    alignItems: 'center',
  },
  suggestionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  suggestionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  suggestionSubtitle: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#FFD700',
    fontSize: 14,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  recentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentIcon: {
    fontSize: 16,
  },
  recentText: {
    flex: 1,
  },
  recentName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 2,
  },
  recentAddress: {
    color: '#888',
    fontSize: 14,
  },
  recentArrow: {
    color: '#666',
    fontSize: 24,
  },
  promoSection: {
    marginTop: 16,
    marginBottom: 20,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
  },
  promoIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  promoText: {
    flex: 1,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  promoSubtitle: {
    color: '#888',
    fontSize: 14,
  },
});
