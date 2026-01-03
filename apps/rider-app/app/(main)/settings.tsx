import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [faceId, setFaceId] = useState(false);

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { id: 'phone', icon: '📱', title: 'Phone Number', value: '+91 98765 43210', type: 'link' },
        { id: 'email', icon: '📧', title: 'Email', value: 'manish@example.com', type: 'link' },
        { id: 'password', icon: '🔐', title: 'Change Password', type: 'link' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', icon: '🔔', title: 'Push Notifications', type: 'toggle', value: notifications, setter: setNotifications },
        { id: 'location', icon: '📍', title: 'Share Live Location', type: 'toggle', value: locationSharing, setter: setLocationSharing },
        { id: 'dark', icon: '🌙', title: 'Dark Mode', type: 'toggle', value: darkMode, setter: setDarkMode },
        { id: 'language', icon: '🌐', title: 'Language', value: 'English', type: 'link' },
      ],
    },
    {
      title: 'Security',
      items: [
        { id: 'faceid', icon: '👤', title: 'Face ID / Touch ID', type: 'toggle', value: faceId, setter: setFaceId },
        { id: 'devices', icon: '📱', title: 'Logged in Devices', type: 'link' },
        { id: '2fa', icon: '🔒', title: 'Two-Factor Authentication', type: 'link' },
      ],
    },
    {
      title: 'About',
      items: [
        { id: 'rate', icon: '⭐', title: 'Rate TaxiGo', type: 'link' },
        { id: 'share', icon: '📤', title: 'Share App', type: 'link' },
        { id: 'privacy', icon: '📄', title: 'Privacy Policy', type: 'link' },
        { id: 'terms', icon: '📋', title: 'Terms of Service', type: 'link' },
        { id: 'version', icon: 'ℹ️', title: 'App Version', value: '1.0.0', type: 'info' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsGroups.map((group) => (
          <View key={group.title} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupItems}>
              {group.items.map((item: any, index: number) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    index === group.items.length - 1 && styles.lastItem,
                  ]}
                  disabled={item.type === 'toggle' || item.type === 'info'}
                >
                  <Text style={styles.settingIcon}>{item.icon}</Text>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.setter}
                      trackColor={{ false: '#333', true: '#FFD700' }}
                      thumbColor={item.value ? '#000' : '#888'}
                    />
                  ) : item.type === 'link' ? (
                    <View style={styles.settingValue}>
                      {item.value && <Text style={styles.valueText}>{item.value}</Text>}
                      <Text style={styles.settingArrow}>›</Text>
                    </View>
                  ) : (
                    <Text style={styles.valueText}>{item.value}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete Account</Text>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  groupItems: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    color: '#888',
    fontSize: 14,
    marginRight: 8,
  },
  settingArrow: {
    color: '#666',
    fontSize: 24,
  },
  deleteButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '500',
  },
});
