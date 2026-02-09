import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Linking,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SettingsScreenProps } from '../types/navigation';
import {
  userSettingsService,
  US_STATES,
  PRICING_TIERS,
  type UserSettings,
  type SubscriptionTier,
} from '../services/userSettingsService';
import { paymentService } from '../services/paymentService';

// Design System Colors
const COLORS = {
  primary50: '#EFF6FF',
  primary500: '#3B82F6',
  primary600: '#2563EB',
  neutral50: '#FAFAF9',
  neutral100: '#F5F5F4',
  neutral200: '#E7E5E4',
  neutral400: '#A8A29E',
  neutral500: '#78716C',
  neutral600: '#57534E',
  neutral700: '#44403C',
  neutral800: '#292524',
  white: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingRow({ icon, title, subtitle, onPress, rightElement, danger }: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIconContainer, danger && { backgroundColor: '#FEE2E2' }]}>
        <Ionicons
          name={icon as IoniconsName}
          size={20}
          color={danger ? COLORS.error : COLORS.primary500}
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && { color: COLORS.error }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement ||
        (onPress && <Ionicons name="chevron-forward" size={20} color={COLORS.neutral400} />)}
    </TouchableOpacity>
  );
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [purchasing, setPurchasing] = useState<SubscriptionTier | null>(null);
  const [zipCodeInput, setZipCodeInput] = useState('');

  // Load user settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await userSettingsService.get();
    setUserSettings(settings);
    setZipCodeInput(settings.zipCode || '');
  };

  const handlePurchase = async (tier: SubscriptionTier) => {
    setPurchasing(tier);
    const result = await paymentService.purchaseTier(tier);
    setPurchasing(null);
    if (result.success) {
      await loadSettings();
      Alert.alert('Welcome!', result.message, [
        { text: 'Great!', onPress: () => setShowPricingModal(false) },
      ]);
    } else {
      Alert.alert('Oops', result.message);
    }
  };

  const handleStateSelect = async (stateCode: string) => {
    await userSettingsService.setState(stateCode);
    setUserSettings((prev) => (prev ? { ...prev, state: stateCode } : null));
    setShowStatePicker(false);
  };

  const handleZipCodeSave = async (text: string) => {
    // Only accept US zip codes (5 digits or 5+4 format)
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 5);
    setZipCodeInput(cleaned);
    if (cleaned.length === 5) {
      await userSettingsService.setZipCode(cleaned);
      setUserSettings((prev) => (prev ? { ...prev, zipCode: cleaned } : null));
    } else if (cleaned.length === 0) {
      await userSettingsService.setZipCode(null);
      setUserSettings((prev) => (prev ? { ...prev, zipCode: null } : null));
    }
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://thedentalangel.com/privacy');
  };

  const handleTerms = () => {
    Linking.openURL('https://thedentalangel.com/terms');
  };

  const handleSupport = () => {
    Linking.openURL('mailto:support@thedentalangel.com');
  };

  const handleClearData = () => {
    // TODO: Implement clear data functionality
  };

  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    if (userSettings && userSettings.subscriptionTier !== 'free') {
      userSettingsService.getDaysRemaining().then(setDaysRemaining);
    }
  }, [userSettings]);

  const currentTierName =
    userSettings?.subscriptionTier === 'free'
      ? 'Free Preview'
      : PRICING_TIERS[userSettings?.subscriptionTier as keyof typeof PRICING_TIERS]?.name ||
        'Free Preview';

  const tierSubtitle =
    userSettings?.subscriptionTier === 'free'
      ? currentTierName
      : `${currentTierName} — ${daysRemaining} days remaining`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Subscription Section */}
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="diamond-outline"
            title="Current Plan"
            subtitle={tierSubtitle}
            onPress={() => setShowPricingModal(true)}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="pricetag-outline"
            title="View Pricing"
            subtitle="See all available plans"
            onPress={() => setShowPricingModal(true)}
          />
        </View>

        {/* Location Section */}
        <Text style={styles.sectionTitle}>Your Location</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="location-outline"
            title="State/Region"
            subtitle={userSettingsService.getStateLabel(userSettings?.state || null)}
            onPress={() => setShowStatePicker(true)}
          />
          {userSettings?.state && userSettings.state !== 'international' && (
            <>
              <View style={styles.separator} />
              <View style={styles.settingRow}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="navigate-outline" size={20} color={COLORS.primary500} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Zip Code</Text>
                  <Text style={styles.settingSubtitle}>Helps with local fee estimates</Text>
                </View>
                <TextInput
                  style={styles.zipCodeInput}
                  value={zipCodeInput}
                  onChangeText={handleZipCodeSave}
                  placeholder="e.g. 90210"
                  placeholderTextColor={COLORS.neutral400}
                  keyboardType="number-pad"
                  maxLength={5}
                  returnKeyType="done"
                />
              </View>
            </>
          )}
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="person-outline"
            title="Sign In"
            subtitle="Save your conversations across devices"
            onPress={() => {}}
          />
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Reminders and updates"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.neutral200, true: COLORS.primary500 }}
                thumbColor={COLORS.white}
              />
            }
          />
          <View style={styles.separator} />
          <SettingRow
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => {}}
          />
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="help-circle-outline" title="Help & FAQ" onPress={() => {}} />
          <View style={styles.separator} />
          <SettingRow icon="mail-outline" title="Contact Support" onPress={handleSupport} />
          <View style={styles.separator} />
          <SettingRow icon="star-outline" title="Rate the App" onPress={() => {}} />
        </View>

        {/* Legal Section */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="shield-checkmark-outline"
            title="Terms of Service"
            onPress={handleTerms}
          />
        </View>

        {/* Data Section */}
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="time-outline"
            title="Conversation History"
            onPress={() => navigation.navigate('Home', { screen: 'History' })}
          />
          <View style={styles.separator} />
          <SettingRow
            icon="trash-outline"
            title="Clear All Data"
            subtitle="Delete all conversations"
            onPress={handleClearData}
            danger
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>The Dental Angel</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appTagline}>Powered by 40 years of clinical experience</Text>
        </View>
      </ScrollView>

      {/* State Picker Modal */}
      <Modal
        visible={showStatePicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowStatePicker(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Your State</Text>
            <TouchableOpacity onPress={() => setShowStatePicker(false)}>
              <Ionicons name="close" size={28} color={COLORS.neutral600} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>
            This helps us provide the right services for your location
          </Text>
          <FlatList
            data={[{ value: 'international', label: 'Outside the USA' }, ...US_STATES]}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.stateItem,
                  userSettings?.state === item.value && styles.stateItemSelected,
                ]}
                onPress={() => handleStateSelect(item.value)}
              >
                <Text
                  style={[
                    styles.stateItemText,
                    userSettings?.state === item.value && styles.stateItemTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {userSettings?.state === item.value && (
                  <Ionicons name="checkmark" size={24} color={COLORS.primary500} />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.stateList}
          />
        </SafeAreaView>
      </Modal>

      {/* Pricing Modal */}
      <Modal
        visible={showPricingModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPricingModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Your Plan</Text>
            <TouchableOpacity onPress={() => setShowPricingModal(false)}>
              <Ionicons name="close" size={28} color={COLORS.neutral600} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.pricingList}>
            {/* Free Tier */}
            <View style={styles.pricingCard}>
              <Text style={styles.pricingName}>{PRICING_TIERS.free.name}</Text>
              <Text style={styles.pricingPrice}>$0</Text>
              <Text style={styles.pricingDescription}>{PRICING_TIERS.free.description}</Text>
              {PRICING_TIERS.free.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark" size={18} color={COLORS.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Quick Answers */}
            <View style={styles.pricingCard}>
              <Text style={styles.pricingName}>{PRICING_TIERS.quick_answers.name}</Text>
              <Text style={styles.pricingPrice}>${PRICING_TIERS.quick_answers.price}</Text>
              <Text style={styles.pricingDuration}>
                {PRICING_TIERS.quick_answers.duration} days access
              </Text>
              <Text style={styles.pricingDescription}>
                {PRICING_TIERS.quick_answers.description}
              </Text>
              {PRICING_TIERS.quick_answers.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark" size={18} color={COLORS.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handlePurchase('quick_answers')}
                disabled={purchasing !== null}
              >
                {purchasing === 'quick_answers' ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buyButtonText}>
                    Get Started — ${PRICING_TIERS.quick_answers.price}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Full Prep - Recommended */}
            <View style={[styles.pricingCard, styles.pricingCardRecommended]}>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
              </View>
              <Text style={styles.pricingName}>{PRICING_TIERS.full_prep.name}</Text>
              <Text style={styles.pricingPrice}>${PRICING_TIERS.full_prep.price}</Text>
              <Text style={styles.pricingDuration}>
                {PRICING_TIERS.full_prep.duration} days access
              </Text>
              <Text style={styles.pricingDescription}>{PRICING_TIERS.full_prep.description}</Text>
              {PRICING_TIERS.full_prep.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark" size={18} color={COLORS.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.buyButton, styles.buyButtonRecommended]}
                onPress={() => handlePurchase('full_prep')}
                disabled={purchasing !== null}
              >
                {purchasing === 'full_prep' ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buyButtonText}>
                    Get Full Prep — ${PRICING_TIERS.full_prep.price}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Expert Tier */}
            <View style={styles.pricingCard}>
              <Text style={styles.pricingName}>{PRICING_TIERS.expert.name}</Text>
              <Text style={styles.pricingPrice}>${PRICING_TIERS.expert.price}</Text>
              <Text style={styles.pricingDuration}>
                {PRICING_TIERS.expert.duration} days access
              </Text>
              <Text style={styles.pricingDescription}>{PRICING_TIERS.expert.description}</Text>
              {PRICING_TIERS.expert.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark" size={18} color={COLORS.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handlePurchase('expert')}
                disabled={purchasing !== null}
              >
                {purchasing === 'expert' ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buyButtonText}>Get Expert Review — $149</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.expertNote}>
                Dr. Angel will personally review your case and provide educational insights based on
                40 years of experience.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral500,
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral800,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.neutral200,
    marginLeft: 64,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 32,
  },
  appName: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral400,
    marginTop: 4,
  },
  appTagline: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral400,
    marginTop: 8,
    fontStyle: 'italic',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral200,
    backgroundColor: COLORS.white,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    padding: 16,
    paddingBottom: 8,
  },
  // State picker
  stateList: {
    padding: 16,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 8,
  },
  stateItemSelected: {
    backgroundColor: COLORS.primary50,
    borderWidth: 2,
    borderColor: COLORS.primary500,
  },
  stateItemText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral700,
  },
  stateItemTextSelected: {
    color: COLORS.primary600,
  },
  zipCodeInput: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral800,
    backgroundColor: COLORS.neutral100,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 100,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.neutral200,
  },
  // Pricing modal
  pricingList: {
    padding: 16,
  },
  pricingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pricingCardRecommended: {
    borderWidth: 2,
    borderColor: COLORS.primary500,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: COLORS.primary500,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  recommendedBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  pricingName: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    marginBottom: 4,
  },
  pricingPrice: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: COLORS.primary500,
    marginBottom: 4,
  },
  pricingDuration: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginBottom: 8,
  },
  pricingDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral700,
    lineHeight: 20,
  },
  buyButton: {
    backgroundColor: COLORS.primary500,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buyButtonRecommended: {
    backgroundColor: COLORS.primary600,
  },
  buyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  expertNote: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default SettingsScreen;
