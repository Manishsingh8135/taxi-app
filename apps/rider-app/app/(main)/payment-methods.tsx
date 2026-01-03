import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('1');

  const paymentMethods = [
    { id: '1', type: 'card', name: 'HDFC Credit Card', details: '•••• 4532', icon: '💳', isDefault: true },
    { id: '2', type: 'card', name: 'ICICI Debit Card', details: '•••• 8901', icon: '💳', isDefault: false },
    { id: '3', type: 'upi', name: 'Google Pay', details: 'manish@okaxis', icon: '📱', isDefault: false },
    { id: '4', type: 'wallet', name: 'TaxiGo Wallet', details: '₹1,250 available', icon: '👛', isDefault: false },
    { id: '5', type: 'cash', name: 'Cash', details: 'Pay with cash', icon: '💵', isDefault: false },
  ];

  const getCardBrand = (details: string) => {
    const lastFour = details.replace('•••• ', '');
    if (lastFour.startsWith('4')) return 'VISA';
    if (lastFour.startsWith('5')) return 'MASTERCARD';
    return 'CARD';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.walletSection}>
          <View style={styles.walletCard}>
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>TaxiGo Wallet</Text>
              <Text style={styles.walletBalance}>₹1,250</Text>
            </View>
            <TouchableOpacity style={styles.addMoneyButton}>
              <Text style={styles.addMoneyText}>+ Add Money</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment Options</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentCard,
              selectedMethod === method.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={styles.radioButton}>
              {selectedMethod === method.id && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.paymentIcon}>
              <Text style={styles.iconText}>{method.icon}</Text>
            </View>
            <View style={styles.paymentInfo}>
              <View style={styles.paymentHeader}>
                <Text style={styles.paymentName}>{method.name}</Text>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.paymentDetails}>{method.details}</Text>
            </View>
            {method.type === 'card' && (
              <Text style={styles.cardBrand}>{getCardBrand(method.details)}</Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.addSection}>
          <TouchableOpacity style={styles.addOption}>
            <View style={styles.addIconContainer}>
              <Text style={styles.addIcon}>💳</Text>
            </View>
            <Text style={styles.addText}>Add Credit/Debit Card</Text>
            <Text style={styles.addArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addOption}>
            <View style={styles.addIconContainer}>
              <Text style={styles.addIcon}>📱</Text>
            </View>
            <Text style={styles.addText}>Link UPI ID</Text>
            <Text style={styles.addArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addOption}>
            <View style={styles.addIconContainer}>
              <Text style={styles.addIcon}>🏦</Text>
            </View>
            <Text style={styles.addText}>Add Net Banking</Text>
            <Text style={styles.addArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Promotions</Text>
          <TouchableOpacity style={styles.promoInput}>
            <Text style={styles.promoPlaceholder}>Enter promo code</Text>
            <Text style={styles.promoApply}>Apply</Text>
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
  walletSection: {
    marginBottom: 24,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFD700',
    borderRadius: 16,
    padding: 20,
  },
  walletInfo: {},
  walletLabel: {
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
  },
  walletBalance: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
  },
  addMoneyButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addMoneyText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#FFD700',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  defaultText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
  paymentDetails: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  cardBrand: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  addSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  addIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addIcon: {
    fontSize: 18,
  },
  addText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  addArrow: {
    color: '#666',
    fontSize: 24,
  },
  promoSection: {
    marginBottom: 24,
  },
  promoTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  promoInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  promoPlaceholder: {
    flex: 1,
    color: '#666',
    fontSize: 16,
  },
  promoApply: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
});
