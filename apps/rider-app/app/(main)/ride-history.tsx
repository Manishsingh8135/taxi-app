import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RideHistoryScreen() {
  const router = useRouter();

  const rides = [
    {
      id: '1',
      date: 'Today',
      time: '2:30 PM',
      pickup: 'Home - 123 Main Street',
      drop: 'Airport Terminal 1',
      fare: '₹450',
      status: 'completed',
      vehicleType: 'Sedan',
    },
    {
      id: '2',
      date: 'Yesterday',
      time: '9:15 AM',
      pickup: 'Work - Tech Park',
      drop: 'Central Mall',
      fare: '₹180',
      status: 'completed',
      vehicleType: 'Mini',
    },
    {
      id: '3',
      date: 'Dec 28, 2025',
      time: '6:45 PM',
      pickup: 'City Hospital',
      drop: 'Home - 123 Main Street',
      fare: '₹220',
      status: 'completed',
      vehicleType: 'Mini',
    },
    {
      id: '4',
      date: 'Dec 25, 2025',
      time: '11:00 AM',
      pickup: 'Home - 123 Main Street',
      drop: 'Railway Station',
      fare: '₹320',
      status: 'cancelled',
      vehicleType: 'Sedan',
    },
    {
      id: '5',
      date: 'Dec 22, 2025',
      time: '3:30 PM',
      pickup: 'University Campus',
      drop: 'Coffee House, Koramangala',
      fare: '₹150',
      status: 'completed',
      vehicleType: 'Mini',
    },
    {
      id: '6',
      date: 'Dec 20, 2025',
      time: '8:00 PM',
      pickup: 'Restaurant, Indiranagar',
      drop: 'Home - 123 Main Street',
      fare: '₹280',
      status: 'completed',
      vehicleType: 'Premium',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#ff4444';
      default:
        return '#888';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Mini':
        return '🚗';
      case 'Sedan':
        return '🚙';
      case 'Premium':
        return '🚘';
      case 'XL':
        return '🚐';
      default:
        return '🚗';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride History</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>All Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Cancelled</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {rides.map((ride) => (
          <TouchableOpacity key={ride.id} style={styles.rideCard}>
            <View style={styles.rideHeader}>
              <View style={styles.rideDate}>
                <Text style={styles.rideDateText}>{ride.date}</Text>
                <Text style={styles.rideTimeText}>{ride.time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ride.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(ride.status) }]}>
                  {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.rideRoute}>
              <View style={styles.routePoint}>
                <View style={styles.pickupDot} />
                <Text style={styles.routeText} numberOfLines={1}>{ride.pickup}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routePoint}>
                <View style={styles.dropDot} />
                <Text style={styles.routeText} numberOfLines={1}>{ride.drop}</Text>
              </View>
            </View>

            <View style={styles.rideFooter}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleIcon}>{getVehicleIcon(ride.vehicleType)}</Text>
                <Text style={styles.vehicleType}>{ride.vehicleType}</Text>
              </View>
              <Text style={styles.rideFare}>{ride.fare}</Text>
            </View>
          </TouchableOpacity>
        ))}

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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 18,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rideCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideDateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  rideTimeText: {
    color: '#888',
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  rideRoute: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  dropDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff4444',
    marginRight: 12,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#333',
    marginLeft: 4,
    marginVertical: 4,
  },
  routeText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  vehicleType: {
    color: '#888',
    fontSize: 14,
  },
  rideFare: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
