import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CATEGORIES,
  VIDEOS,
  getVideosByCategory,
  searchVideos,
  getYouTubeSearchUrl,
  type Video,
  type VideoCategory,
  type CategoryInfo,
} from '../constants/videoLibrary';
import { COLORS } from '../constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function VideosScreen() {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getDisplayedVideos = useCallback((): Video[] => {
    if (searchQuery.trim()) {
      return searchVideos(searchQuery);
    }
    if (selectedCategory === 'all') {
      return VIDEOS;
    }
    return getVideosByCategory(selectedCategory);
  }, [selectedCategory, searchQuery]);

  const handleVideoPress = async (video: Video) => {
    try {
      const url = getYouTubeSearchUrl(video.searchQuery);
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Unable to Open', 'Could not open YouTube. Please try again later.');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong while opening YouTube.');
    }
  };

  const displayedVideos = getDisplayedVideos();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Video Library</Text>
          <Text style={styles.subtitle}>Learn about dental procedures in plain language</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.neutral500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search videos..."
            placeholderTextColor={COLORS.neutral500}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.neutral500} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          <TouchableOpacity
            style={[styles.categoryPill, selectedCategory === 'all' && styles.categoryPillActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Ionicons
              name="grid-outline"
              size={16}
              color={selectedCategory === 'all' ? COLORS.white : COLORS.neutral600}
            />
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === 'all' && styles.categoryPillTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {CATEGORIES.map((category: CategoryInfo) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryPill,
                selectedCategory === category.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as IconName}
                size={16}
                color={selectedCategory === category.id ? COLORS.white : COLORS.neutral600}
              />
              <Text
                style={[
                  styles.categoryPillText,
                  selectedCategory === category.id && styles.categoryPillTextActive,
                ]}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {displayedVideos.length} topic{displayedVideos.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </Text>
        </View>

        {/* Video Cards */}
        <View style={styles.videoList}>
          {displayedVideos.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="videocam-off-outline" size={48} color={COLORS.neutral500} />
              <Text style={styles.emptyTitle}>No videos found</Text>
              <Text style={styles.emptySubtitle}>Try a different search term or category</Text>
            </View>
          ) : (
            displayedVideos.map((video) => (
              <VideoCard key={video.id} video={video} onPress={() => handleVideoPress(video)} />
            ))
          )}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.neutral500} />
          <Text style={styles.disclaimerText}>
            Tapping a topic opens YouTube search results. Videos are for educational purposes only.
            Always consult with your dentist for personalized advice.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface VideoCardProps {
  video: Video;
  onPress: () => void;
}

function VideoCard({ video, onPress }: VideoCardProps) {
  const categoryInfo = CATEGORIES.find((c) => c.id === video.category);

  return (
    <TouchableOpacity style={styles.videoCard} onPress={onPress} activeOpacity={0.8}>
      {/* Thumbnail placeholder with icon */}
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnailPlaceholder}>
          <Ionicons
            name={(categoryInfo?.icon || 'play-circle') as IconName}
            size={32}
            color={COLORS.primary500}
          />
        </View>
        {/* Duration Badge */}
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={12} color={COLORS.white} />
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
        {/* Play Button Overlay */}
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Ionicons name="logo-youtube" size={28} color={COLORS.white} />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.videoContent}>
        <View style={styles.categoryBadge}>
          <Ionicons
            name={(categoryInfo?.icon || 'folder-outline') as IconName}
            size={12}
            color={COLORS.primary600}
          />
          <Text style={styles.categoryBadgeText}>{categoryInfo?.title || 'General'}</Text>
        </View>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {video.description}
        </Text>
        <View style={styles.watchButton}>
          <Text style={styles.watchButtonText}>Watch on YouTube</Text>
          <Ionicons name="open-outline" size={14} color={COLORS.primary500} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: COLORS.neutral800,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral200,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral800,
    marginLeft: 12,
    marginRight: 8,
  },
  categoryScroll: {
    marginTop: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral200,
    marginRight: 8,
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary500,
    borderColor: COLORS.primary500,
  },
  categoryPillText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral600,
  },
  categoryPillTextActive: {
    color: COLORS.white,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral500,
  },
  videoList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  videoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  durationText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.white,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContent: {
    padding: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.primary600,
  },
  videoTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    marginBottom: 6,
    lineHeight: 24,
  },
  videoDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    lineHeight: 20,
    marginBottom: 12,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  watchButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.primary500,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginTop: 4,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.neutral100,
    borderRadius: 12,
    gap: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});

export default VideosScreen;
