import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface VehicleType {
  id: string;
  name: string;
  icon: string;
  description: string;
  capacity: number;
  baseFare: number;
  perKm: number;
  perMin: number;
  eta: number;
}

const VEHICLE_TYPES: VehicleType[] = [
  { id: 'mini', name: 'TaxiGo Mini', icon: '🚗', description: 'Affordable', capacity: 4, baseFare: 30, perKm: 8, perMin: 1, eta: 5 },
  { id: 'sedan', name: 'TaxiGo Sedan', icon: '🚙', description: 'Comfortable', capacity: 4, baseFare: 50, perKm: 12, perMin: 1.5, eta: 3 },
  { id: 'xl', name: 'TaxiGo XL', icon: '🚐', description: 'Extra space', capacity: 6, baseFare: 80, perKm: 16, perMin: 2, eta: 8 },
  { id: 'premium', name: 'TaxiGo Premium', icon: '✨', description: 'Luxury', capacity: 4, baseFare: 100, perKm: 20, perMin: 2.5, eta: 10 },
];

export default function BookingScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const params = useLocalSearchParams<{
    pickupName?: string;
    pickupAddress?: string;
    pickupLat?: string;
    pickupLng?: string;
    dropName?: string;
    dropAddress?: string;
    dropLat?: string;
    dropLng?: string;
  }>();

  const [selectedVehicle, setSelectedVehicle] = useState<string>('sedan');
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(5.5); // km - mock
  const [duration, setDuration] = useState(18); // min - mock

  const pickup = {
    name: params.pickupName || 'Current Location',
    address: params.pickupAddress || 'Your location',
    lat: parseFloat(params.pickupLat || '12.9716'),
    lng: parseFloat(params.pickupLng || '77.5946'),
  };

  const drop = {
    name: params.dropName || 'Select destination',
    address: params.dropAddress || '',
    lat: parseFloat(params.dropLat || '12.9816'),
    lng: parseFloat(params.dropLng || '77.6046'),
  };

  useEffect(() => {
    if (mapRef.current && pickup.lat && drop.lat) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: pickup.lat, longitude: pickup.lng },
          { latitude: drop.lat, longitude: drop.lng },
        ],
        {
          edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
          animated: true,
        }
      );
    }
  }, [pickup.lat, drop.lat]);

  const calculateFare = (vehicle: VehicleType) => {
    const fare = vehicle.baseFare + (distance * vehicle.perKm) + (duration * vehicle.perMin);
    return Math.round(fare);
  };

  const handleBookRide = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(main)/tracking',
        params: {
          rideId: 'ride_' + Date.now(),
          vehicleType: selectedVehicle,
          pickupLat: pickup.lat.toString(),
          pickupLng: pickup.lng.toString(),
          dropLat: drop.lat.toString(),
          dropLng: drop.lng.toString(),
          pickupName: pickup.name,
          dropName: drop.name,
        },
      });
    }, 1500);
  };

  const selectedVehicleData = VEHICLE_TYPES.find(v => v.id === selectedVehicle)!;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: pickup.lat,
          longitude: pickup.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: pickup.lat, longitude: pickup.lng }}
          title="Pickup"
          pinColor="green"
        />
        {drop.address && (
          <Marker
            coordinate={{ latitude: drop.lat, longitude: drop.lng }}
            title="Drop"
            pinColor="red"
          />
        )}
        {drop.address && (
          <Polyline
            coordinates={[
              { latitude: pickup.lat, longitude: pickup.lng },
              { latitude: drop.lat, longitude: drop.lng },
            ]}
            strokeColor="#FFD700"
            strokeWidth={4}
          />
        )}
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <View style={styles.bottomSheet}>
        <View style={styles.locationContainer}>
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => router.push({ pathname: '/(main)/search', params: { type: 'pickup' } })}
          >
            <View style={[styles.dot, styles.greenDot]} />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationName}>{pickup.name}</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => router.push({ pathname: '/(main)/search', params: { type: 'drop' } })}
          >
            <View style={[styles.dot, styles.redDot]} />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Drop-off</Text>
              <Text style={styles.locationName}>{drop.name}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Choose a ride</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleList}>
          {VEHICLE_TYPES.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehicleCard,
                selectedVehicle === vehicle.id && styles.vehicleCardSelected,
              ]}
              onPress={() => setSelectedVehicle(vehicle.id)}
            >
              <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleDesc}>{vehicle.description}</Text>
              <Text style={styles.vehicleEta}>{vehicle.eta} min</Text>
              <Text style={styles.vehiclePrice}>₹{calculateFare(vehicle)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.fareBreakdown}>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Distance</Text>
            <Text style={styles.fareValue}>{distance} km</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Est. time</Text>
            <Text style={styles.fareValue}>{duration} min</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Total fare</Text>
            <Text style={styles.fareTotal}>₹{calculateFare(selectedVehicleData)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleBookRide}
          disabled={loading || !drop.address}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.bookButtonText}>
              Book {selectedVehicleData.name}
            </Text>
          )}
        </TouchableOpacity>
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
    height: height * 0.45,
  },
  backButton: {
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
  backText: {
    color: '#FFD700',
    fontSize: 24,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
  },
  locationContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  greenDot: {
    backgroundColor: '#4CAF50',
  },
  redDot: {
    backgroundColor: '#F44336',
  },
  locationText: {
    flex: 1,
  },
  locationLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  },
  locationName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
    marginLeft: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  vehicleList: {
    marginBottom: 16,
  },
  vehicleCard: {
    width: 120,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  vehicleCardSelected: {
    borderColor: '#FFD700',
  },
  vehicleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  vehicleName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  vehicleDesc: {
    color: '#888',
    fontSize: 10,
    marginBottom: 4,
  },
  vehicleEta: {
    color: '#4CAF50',
    fontSize: 11,
    marginBottom: 4,
  },
  vehiclePrice: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fareBreakdown: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fareLabel: {
    color: '#888',
    fontSize: 14,
  },
  fareValue: {
    color: '#fff',
    fontSize: 14,
  },
  fareTotal: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
