import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

type RideStatus = 'finding' | 'accepted' | 'arriving' | 'arrived' | 'in_progress' | 'completed';

interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: {
    model: string;
    color: string;
    plate: string;
  };
  location: {
    lat: number;
    lng: number;
  };
}

const MOCK_DRIVER: Driver = {
  id: 'driver_1',
  name: 'Rahul Kumar',
  phone: '+91 98765 43210',
  rating: 4.8,
  vehicle: {
    model: 'Swift Dzire',
    color: 'White',
    plate: 'KA-01-AB-1234',
  },
  location: {
    lat: 12.9716,
    lng: 77.5946,
  },
};

export default function TrackingScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const params = useLocalSearchParams<{
    rideId?: string;
    vehicleType?: string;
    pickupLat?: string;
    pickupLng?: string;
    dropLat?: string;
    dropLng?: string;
    pickupName?: string;
    dropName?: string;
  }>();

  const [status, setStatus] = useState<RideStatus>('finding');
  const [driver, setDriver] = useState<Driver | null>(null);
  const [otp, setOtp] = useState('');
  const [eta, setEta] = useState(5);

  const pickup = {
    lat: parseFloat(params.pickupLat || '12.9716'),
    lng: parseFloat(params.pickupLng || '77.5946'),
    name: params.pickupName || 'Pickup',
  };

  const drop = {
    lat: parseFloat(params.dropLat || '12.9816'),
    lng: parseFloat(params.dropLng || '77.6046'),
    name: params.dropName || 'Drop',
  };

  useEffect(() => {
    // Simulate ride flow
    const timers: NodeJS.Timeout[] = [];

    // Finding driver -> Accepted
    timers.push(setTimeout(() => {
      setStatus('accepted');
      setDriver(MOCK_DRIVER);
      setOtp(Math.floor(1000 + Math.random() * 9000).toString());
    }, 3000));

    // Accepted -> Arriving
    timers.push(setTimeout(() => {
      setStatus('arriving');
      setEta(3);
    }, 6000));

    // Arriving -> Arrived
    timers.push(setTimeout(() => {
      setStatus('arrived');
      setEta(0);
    }, 9000));

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (mapRef.current && driver) {
      const coordinates = [
        { latitude: pickup.lat, longitude: pickup.lng },
        { latitude: driver.location.lat, longitude: driver.location.lng },
      ];
      
      if (status === 'in_progress') {
        coordinates.push({ latitude: drop.lat, longitude: drop.lng });
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
        animated: true,
      });
    }
  }, [driver, status]);

  const handleCall = () => {
    if (driver) {
      Linking.openURL(`tel:${driver.phone}`);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => router.replace('/(main)/home'),
        },
      ]
    );
  };

  const handleSOS = () => {
    Alert.alert(
      'Emergency SOS',
      'This will alert emergency services and your emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send SOS', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const getStatusText = () => {
    switch (status) {
      case 'finding':
        return 'Finding your driver...';
      case 'accepted':
        return `${driver?.name} is on the way`;
      case 'arriving':
        return `Arriving in ${eta} minutes`;
      case 'arrived':
        return 'Driver has arrived!';
      case 'in_progress':
        return 'Trip in progress';
      case 'completed':
        return 'Trip completed';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: pickup.lat,
          longitude: pickup.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{ latitude: pickup.lat, longitude: pickup.lng }}
          title="Pickup"
          pinColor="green"
        />
        <Marker
          coordinate={{ latitude: drop.lat, longitude: drop.lng }}
          title="Drop"
          pinColor="red"
        />
        {driver && (
          <Marker
            coordinate={{ latitude: driver.location.lat, longitude: driver.location.lng }}
            title={driver.name}
          >
            <View style={styles.carMarker}>
              <Text style={styles.carMarkerText}>🚗</Text>
            </View>
          </Marker>
        )}
        {driver && (
          <Polyline
            coordinates={[
              { latitude: driver.location.lat, longitude: driver.location.lng },
              { latitude: pickup.lat, longitude: pickup.lng },
            ]}
            strokeColor="#FFD700"
            strokeWidth={4}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
          {status === 'finding' && (
            <View style={styles.loadingDots}>
              <View style={[styles.dot, styles.dotActive]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          )}
        </View>

        {driver && status !== 'finding' && (
          <>
            <View style={styles.driverCard}>
              <View style={styles.driverPhoto}>
                <Text style={styles.driverPhotoText}>👤</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverRating}>⭐ {driver.rating}</Text>
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleModel}>{driver.vehicle.color} {driver.vehicle.model}</Text>
                <Text style={styles.vehiclePlate}>{driver.vehicle.plate}</Text>
              </View>
            </View>

            {(status === 'accepted' || status === 'arriving' || status === 'arrived') && (
              <View style={styles.otpContainer}>
                <Text style={styles.otpLabel}>Share this OTP with driver</Text>
                <Text style={styles.otpCode}>{otp}</Text>
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                <Text style={styles.actionIcon}>📞</Text>
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.sosButton]} onPress={handleSOS}>
                <Text style={styles.actionIcon}>🆘</Text>
                <Text style={styles.actionText}>SOS</Text>
              </TouchableOpacity>
            </View>

            {status !== 'in_progress' && status !== 'completed' && (
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel Ride</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {status === 'finding' && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
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
    height: height * 0.5,
  },
  carMarker: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  carMarkerText: {
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
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingDots: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 2,
  },
  dotActive: {
    backgroundColor: '#FFD700',
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  driverPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverPhotoText: {
    fontSize: 28,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  driverRating: {
    color: '#FFD700',
    fontSize: 14,
  },
  vehicleInfo: {
    alignItems: 'flex-end',
  },
  vehicleModel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  vehiclePlate: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  otpLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  otpCode: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: 80,
  },
  sosButton: {
    backgroundColor: '#331111',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  cancelButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
});
