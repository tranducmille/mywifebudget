import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Shield, Bell, Palette, Download, Upload, CircleHelp as HelpCircle, Mail, Star, Smartphone, Lock, Eye, Database, ChevronRight, LogOut, CreditCard, Globe, Trash2 } from 'lucide-react-native';

export default function Settings() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [darkMode, setDarkMode] = useState(isDark);
  const [dataSync, setDataSync] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  const handleExportData = async () => {
    try {
      const result = await Share.share({
        message: 'Your HomeBudget Pro data export will be prepared and sent to your email.',
        title: 'Export Financial Data',
      });
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // Handle account deletion
          Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
        }},
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {
          // Handle logout
          Alert.alert('Signed Out', 'You have been signed out successfully.');
        }},
      ]
    );
  };

  const SettingsSection = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({ icon: Icon, title, subtitle, onPress, rightElement }: any) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIcon}>
          <Icon size={20} color="#007AFF" />
        </View>
        <View style={styles.settingsContent}>
          <Text style={styles.settingsTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightElement || <ChevronRight size={18} color={isDark ? '#8E8E93' : '#8E8E93'} />}
      </View>
    </TouchableOpacity>
  );

  const ToggleItem = ({ icon: Icon, title, subtitle, value, onValueChange }: any) => (
    <View style={styles.settingsItem}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.settingsIcon}>
          <Icon size={20} color="#007AFF" />
        </View>
        <View style={styles.settingsContent}>
          <Text style={styles.settingsTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: isDark ? '#2C2C2E' : '#E5E5EA', true: '#007AFF' }}
        thumbColor={value ? '#FFF' : isDark ? '#FFF' : '#FFF'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your preferences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Section */}
        <SettingsSection title="Profile">
          <SettingsItem
            icon={User}
            title="Personal Information"
            subtitle="Name, email, and profile details"
            onPress={() => Alert.alert('Profile', 'Edit profile functionality would be implemented here')}
          />
          <SettingsItem
            icon={CreditCard}
            title="Payment Methods"
            subtitle="Manage linked accounts and cards"
            onPress={() => Alert.alert('Payment Methods', 'Manage payment methods')}
          />
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection title="Security & Privacy">
          <ToggleItem
            icon={Shield}
            title="Biometric Authentication"
            subtitle="Use Face ID or Touch ID"
            value={biometrics}
            onValueChange={setBiometrics}
          />
          <SettingsItem
            icon={Lock}
            title="Change Passcode"
            subtitle="Update your app passcode"
            onPress={() => Alert.alert('Passcode', 'Change passcode functionality')}
          />
          <SettingsItem
            icon={Eye}
            title="Privacy Settings"
            subtitle="Control data visibility and sharing"
            onPress={() => Alert.alert('Privacy', 'Privacy settings would be shown here')}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          <ToggleItem
            icon={Bell}
            title="Push Notifications"
            subtitle="Receive app notifications"
            value={notifications}
            onValueChange={setNotifications}
          />
          <ToggleItem
            icon={Bell}
            title="Budget Alerts"
            subtitle="Get notified when approaching budget limits"
            value={budgetAlerts}
            onValueChange={setBudgetAlerts}
          />
          <SettingsItem
            icon={Smartphone}
            title="Notification Schedule"
            subtitle="Set quiet hours and frequency"
            onPress={() => Alert.alert('Schedule', 'Configure notification timing')}
          />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          <SettingsItem
            icon={Palette}
            title="Theme"
            subtitle={isDark ? 'Dark mode' : 'Light mode'}
            onPress={() => Alert.alert('Theme', 'Theme selection would be implemented here')}
          />
          <SettingsItem
            icon={Globe}
            title="Language & Region"
            subtitle="English (US)"
            onPress={() => Alert.alert('Language', 'Language selection would be shown here')}
          />
        </SettingsSection>

        {/* Data & Backup Section */}
        <SettingsSection title="Data & Backup">
          <ToggleItem
            icon={Database}
            title="Cloud Sync"
            subtitle="Automatically backup data to cloud"
            value={dataSync}
            onValueChange={setDataSync}
          />
          <SettingsItem
            icon={Download}
            title="Export Data"
            subtitle="Download your financial data"
            onPress={handleExportData}
          />
          <SettingsItem
            icon={Upload}
            title="Import Data"
            subtitle="Import from other apps or files"
            onPress={() => Alert.alert('Import', 'Import functionality would be implemented here')}
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support & Feedback">
          <SettingsItem
            icon={HelpCircle}
            title="Help Center"
            subtitle="FAQ and user guides"
            onPress={() => Alert.alert('Help', 'Help center would open here')}
          />
          <SettingsItem
            icon={Mail}
            title="Contact Support"
            subtitle="Get help from our team"
            onPress={() => Alert.alert('Support', 'Contact support functionality')}
          />
          <SettingsItem
            icon={Star}
            title="Rate the App"
            subtitle="Share your feedback on the App Store"
            onPress={() => Alert.alert('Rate App', 'App Store rating would open here')}
          />
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon={LogOut}
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
          />
          <SettingsItem
            icon={Trash2}
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
            rightElement={<ChevronRight size={18} color="#FF3B30" />}
          />
        </SettingsSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>HomeBudget Pro</Text>
          <Text style={styles.appVersion}>Version 1.0.0 (Build 100)</Text>
          <Text style={styles.appCopyright}>© 2025 HomeBudget Pro. All rights reserved.</Text>
        </View>

        {/* Premium Upgrade */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>Upgrade to Pro</Text>
            <Text style={styles.premiumSubtitle}>
              Unlock AI insights, unlimited budgets, and advanced analytics
            </Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000' : '#F2F2F7',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA',
  },
  settingsItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  settingsItemRight: {
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: isDark ? '#8E8E93' : '#8E8E93',
    marginBottom: 8,
  },
  appCopyright: {
    fontSize: 12,
    color: isDark ? '#8E8E93' : '#8E8E93',
    textAlign: 'center',
  },
  premiumCard: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  premiumContent: {
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 20,
    lineHeight: 22,
  },
  premiumButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});