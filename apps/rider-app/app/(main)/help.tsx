import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
  const router = useRouter();

  const helpCategories = [
    {
      id: '1',
      title: 'Trip Issues',
      items: [
        { id: 'trip1', icon: '🚗', title: 'I was charged incorrectly' },
        { id: 'trip2', icon: '📍', title: 'Route was incorrect' },
        { id: 'trip3', icon: '⏱️', title: 'Driver took too long' },
        { id: 'trip4', icon: '🚫', title: 'Driver cancelled my trip' },
      ],
    },
    {
      id: '2',
      title: 'Payment Issues',
      items: [
        { id: 'pay1', icon: '💳', title: 'Payment failed' },
        { id: 'pay2', icon: '🔄', title: 'Refund not received' },
        { id: 'pay3', icon: '👛', title: 'Wallet issues' },
      ],
    },
    {
      id: '3',
      title: 'Account & App',
      items: [
        { id: 'acc1', icon: '👤', title: 'Update my profile' },
        { id: 'acc2', icon: '📱', title: 'App not working properly' },
        { id: 'acc3', icon: '🔐', title: 'Login issues' },
      ],
    },
    {
      id: '4',
      title: 'Safety',
      items: [
        { id: 'safe1', icon: '🆘', title: 'Report a safety issue' },
        { id: 'safe2', icon: '📞', title: 'I left something in the car' },
        { id: 'safe3', icon: '⚠️', title: 'Report driver behavior' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Search for help</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>📞</Text>
            </View>
            <Text style={styles.quickActionText}>Call Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>💬</Text>
            </View>
            <Text style={styles.quickActionText}>Chat with us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>📧</Text>
            </View>
            <Text style={styles.quickActionText}>Email</Text>
          </TouchableOpacity>
        </View>

        {helpCategories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.items.map((item) => (
              <TouchableOpacity key={item.id} style={styles.helpItem}>
                <Text style={styles.helpItemIcon}>{item.icon}</Text>
                <Text style={styles.helpItemTitle}>{item.title}</Text>
                <Text style={styles.helpItemArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I change my phone number?</Text>
            <Text style={styles.faqArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I add a payment method?</Text>
            <Text style={styles.faqArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>How do I schedule a ride?</Text>
            <Text style={styles.faqArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What is TaxiGo Wallet?</Text>
            <Text style={styles.faqArrow}>›</Text>
          </TouchableOpacity>
        </View>

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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchPlaceholder: {
    color: '#888',
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionEmoji: {
    fontSize: 28,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  helpItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  helpItemTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  helpItemArrow: {
    color: '#666',
    fontSize: 24,
  },
  faqSection: {
    marginTop: 8,
  },
  faqTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  faqQuestion: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  faqArrow: {
    color: '#666',
    fontSize: 24,
  },
});
