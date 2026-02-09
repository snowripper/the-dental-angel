import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/theme';
import { analyzeImage } from '../services/aiService';
import { parseTreatmentItems, saveTreatmentPlan } from '../services/treatmentPlanService';
import { paymentService } from '../services/paymentService';
import { PaywallModal } from '../components/PaywallModal';
import type { CameraScreenProps } from '../types/navigation';

/**
 * Camera Screen
 * Allows users to upload x-rays, treatment plans, or photos of their teeth
 * for analysis by The Dental Angel
 */
export function CameraScreen({ navigation }: CameraScreenProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const analyzePhoto = async () => {
    if (!selectedImage) return;

    // Check if user has access to image analysis
    const canUpload = await paymentService.canUploadImage();
    if (!canUpload) {
      setShowPaywall(true);
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await analyzeImage(selectedImage);

      // Parse and save any treatment items found in the analysis
      const { treatments, cleanText } = parseTreatmentItems(response.message);
      if (treatments.length > 0) {
        await saveTreatmentPlan(treatments, cleanText, selectedImage);
      }

      navigation.navigate('Chat', {
        imageUri: selectedImage,
        initialAnalysis: cleanText,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.cameraContainer}>
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onPurchaseComplete={() => setShowPaywall(false)}
        context="upload"
      />
      <ScrollView contentContainerStyle={styles.cameraContent}>
        <Text style={styles.cameraTitle}>Share What You've Got</Text>
        <Text style={styles.cameraSubtitle}>
          Treatment plan, x-ray, or photo — I'll help you understand it
        </Text>

        <View style={styles.imagePreviewContainer}>
          {selectedImage ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.clearImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={28} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={60} color={COLORS.neutral400} />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        {!selectedImage ? (
          <View style={styles.cameraButtons}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
              <Ionicons name="camera" size={28} color="white" />
              <Text style={styles.cameraButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
              <Ionicons name="images" size={28} color={COLORS.primary500} />
              <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraButtons}>
            <TouchableOpacity
              style={[styles.analyzeButton, isAnalyzing && styles.buttonDisabled]}
              onPress={analyzePhoto}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <ActivityIndicator color="white" />
                  <Text style={styles.cameraButtonText}>Analyzing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="sparkles" size={24} color="white" />
                  <Text style={styles.cameraButtonText}>Help Me Understand This</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
              <Ionicons name="refresh" size={24} color={COLORS.primary500} />
              <Text style={styles.galleryButtonText}>Choose Different Image</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>📸 Tips for best results:</Text>
          <Text style={styles.tipItem}>• Good lighting helps a lot</Text>
          <Text style={styles.tipItem}>• Make sure text is clearly visible</Text>
          <Text style={styles.tipItem}>• Include the entire document or area</Text>
        </View>

        <Text style={styles.privacyNote}>
          🔒 Your images are processed securely and never shared
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  cameraContent: {
    padding: 24,
    alignItems: 'center',
  },
  cameraTitle: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.primary700,
    marginBottom: 8,
  },
  cameraSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginBottom: 16,
  },
  imagePreviewContainer: {
    width: '100%',
    marginBottom: 24,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: COLORS.neutral200,
  },
  clearImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary200,
    borderStyle: 'dashed',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.neutral400,
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  cameraButtons: {
    width: '100%',
    gap: 12,
  },
  cameraButton: {
    backgroundColor: COLORS.primary500,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 48,
  },
  cameraButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  galleryButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary200,
    minHeight: 48,
  },
  galleryButtonText: {
    color: COLORS.primary500,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  analyzeButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  tipsContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginTop: 24,
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
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginBottom: 4,
    lineHeight: 20,
  },
  privacyNote: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginTop: 16,
    textAlign: 'center',
  },
});
