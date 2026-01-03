import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    })();
  }, []);

  const handleSearchPress = () => {
    router.push({
      pathname: '/(main)/search',
      params: { type: 'drop' },
    });
  };

  const handleQuickPlace = (place: string) => {
    // Navigate to booking with saved place
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location?.coords.latitude || 12.9716,
          longitude: location?.coords.longitude || 77.5946,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
          >
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationDot} />
            </View>
          </Marker>
        )}
      </MapView>

      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.notificationButton}>
        <Text style={styles.notificationIcon}>🔔</Text>
      </TouchableOpacity>

      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchText}>Where to?</Text>
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
          <TouchableOpacity style={styles.placeItem}>
            <View style={styles.placeIconContainer}>
              <Text style={styles.placeIcon}>⏱️</Text>
            </View>
            <Text style={styles.placeText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent</Text>
          <TouchableOpacity style={styles.recentItem}>
            <View style={styles.recentIconContainer}>
              <Text style={styles.recentIcon}>📍</Text>
            </View>
            <View style={styles.recentText}>
              <Text style={styles.recentName}>Airport Terminal 1</Text>
              <Text style={styles.recentAddress}>International Airport</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.recentItem}>
            <View style={styles.recentIconContainer}>
              <Text style={styles.recentIcon}>📍</Text>
            </View>
            <View style={styles.recentText}>
              <Text style={styles.recentName}>Central Mall</Text>
              <Text style={styles.recentAddress}>MG Road, Downtown</Text>
            </View>
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
  map: {
    width: width,
    height: height * 0.55,
  },
  currentLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  menuButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    color: '#fff',
    fontSize: 20,
  },
  notificationButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
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
    justifyContent: 'space-between',
    marginBottom: 24,
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
  recentSection: {
    flex: 1,
  },
  recentTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 12,
    textTransform: 'uppercase',
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
});
