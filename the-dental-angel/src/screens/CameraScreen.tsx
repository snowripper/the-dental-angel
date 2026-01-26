import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, fontSize, borderRadius, shadows } from '../constants/theme';

interface CameraScreenProps {
  navigation: any;
}

export default function CameraScreen({ navigation }: CameraScreenProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Needed',
        'Please allow camera access to take photos of your treatment plan.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Photo Library Permission Needed',
        'Please allow access to your photos to upload your treatment plan.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const analyzeImage = () => {
    // Navigate to chat with the image - The Dental Angel will analyze it
    navigation.navigate('Chat', { imageUri: selectedImage });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Treatment Plan</Text>
        <Text style={styles.subtitle}>
          Take a photo or choose from your library, and I'll help you understand what's recommended.
        </Text>
      </View>

      {selectedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.preview} />
          <TouchableOpacity style={styles.clearButton} onPress={() => setSelectedImage(null)}>
            <Ionicons name="close-circle" size={32} color={colors.neutral.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.uploadArea}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.primary.main} />
          </View>
          <Text style={styles.uploadText}>Your treatment plan image will appear here</Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        {!selectedImage ? (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color={colors.neutral.white} />
              <Text style={styles.primaryButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
              <Ionicons name="images" size={24} color={colors.primary.dark} />
              <Text style={styles.secondaryButtonText}>Choose from Library</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={analyzeImage}>
              <Ionicons name="sparkles" size={24} color={colors.neutral.white} />
              <Text style={styles.primaryButtonText}>Help Me Understand This</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setSelectedImage(null)}>
              <Ionicons name="refresh" size={24} color={colors.primary.dark} />
              <Text style={styles.secondaryButtonText}>Choose Different Image</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Tips for best results:</Text>
        <View style={styles.tip}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent.success} />
          <Text style={styles.tipText}>Make sure the text is clearly visible</Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent.success} />
          <Text style={styles.tipText}>Include the entire treatment plan in the photo</Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent.success} />
          <Text style={styles.tipText}>Good lighting helps a lot!</Text>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.neutral.gray} />
        <Text style={styles.disclaimerText}>
          Your images are processed securely and never shared.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.lightest,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary.darkest,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.neutral.darkGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  uploadArea: {
    marginHorizontal: spacing.lg,
    height: 200,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary.light,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.angel.glow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  uploadText: {
    fontSize: fontSize.sm,
    color: colors.neutral.gray,
  },
  previewContainer: {
    marginHorizontal: spacing.lg,
    height: 200,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  clearButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
  },
  buttonsContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.medium,
  },
  primaryButtonText: {
    color: colors.neutral.white,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.neutral.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary.light,
    gap: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.primary.dark,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  tipsContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
  },
  tipsTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.neutral.charcoal,
    marginBottom: spacing.sm,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: fontSize.sm,
    color: colors.neutral.darkGray,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginTop: 'auto',
    gap: spacing.xs,
  },
  disclaimerText: {
    fontSize: fontSize.xs,
    color: colors.neutral.gray,
  },
});
