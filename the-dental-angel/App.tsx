import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { sendMessageToAngel, analyzeImage } from './src/services/aiService';
import { conversationService, Conversation } from './src/services/conversationService';
import { INITIAL_GREETING } from './src/constants/angelPersonality';

const Stack = createNativeStackNavigator();
const DentalAngelImage = require('./assets/dental-angel.jpg');

// ============ ANGEL AVATAR COMPONENT ============
function AngelAvatar({ size = 'large' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizes = {
    small: { container: 36, tooth: 18, halo: 22, wings: 10 },
    medium: { container: 60, tooth: 30, halo: 36, wings: 16 },
    large: { container: 100, tooth: 50, halo: 60, wings: 26 },
  };
  const s = sizes[size];

  return (
    <View style={[styles.angelAvatarContainer, { width: s.container, height: s.container }]}>
      {/* Halo */}
      <View style={[styles.halo, { width: s.halo, height: s.halo / 3, top: -s.halo / 6 }]} />
      {/* Wings */}
      <Text style={[styles.wing, styles.leftWing, { fontSize: s.wings, left: -s.wings / 2 }]}>
        𓆩
      </Text>
      <Text style={[styles.wing, styles.rightWing, { fontSize: s.wings, right: -s.wings / 2 }]}>
        𓆪
      </Text>
      {/* Tooth emoji as the main icon */}
      <Text style={{ fontSize: s.tooth }}>🦷</Text>
      {/* Sparkles */}
      <Text style={[styles.sparkle, styles.sparkleTopLeft, { fontSize: s.wings / 1.5 }]}>✨</Text>
      <Text style={[styles.sparkle, styles.sparkleBottomRight, { fontSize: s.wings / 1.5 }]}>
        ✨
      </Text>
    </View>
  );
}

// ============ WELCOME SCREEN ============
function WelcomeScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.welcomeContainer}>
      <Image source={DentalAngelImage} style={styles.welcomeImage} resizeMode="cover" />
      <Text style={styles.welcomeTitle}>The Dental Angel</Text>
      <Text style={styles.welcomeSubtitle}>Your friendly guide to understanding dental care</Text>

      <View style={styles.featuresBox}>
        <Text style={styles.featureItem}>💬 Ask questions about dental procedures</Text>
        <Text style={styles.featureItem}>📷 Upload x-rays and treatment plans</Text>
        <Text style={styles.featureItem}>❓ Get questions to ask your dentist</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('Home')}>
        <Text style={styles.primaryButtonText}>Get Started →</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>For educational purposes only</Text>
    </ScrollView>
  );
}

// ============ HOME SCREEN ============
function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.homeContainer}>
      <View style={styles.homeHeader}>
        <Image source={DentalAngelImage} style={styles.dentalAngelImage} resizeMode="cover" />
        <Text style={styles.homeTitle}>The Dental Angel</Text>
        <Text style={styles.homeSubtitle}>How can I help you today?</Text>
      </View>

      <View style={styles.homeActions}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubbles" size={24} color="white" />
          <Text style={styles.primaryButtonText}>Ask a Question</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Camera')}
        >
          <Ionicons name="camera" size={24} color="#4A9BC7" />
          <Text style={styles.secondaryButtonText}>Upload X-Ray or Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
        >
          <Ionicons name="time" size={24} color="#64748B" />
          <Text style={styles.historyButtonText}>Your Conversations</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        For educational purposes only. Always consult your own dentist.
      </Text>
    </SafeAreaView>
  );
}

// ============ CAMERA SCREEN ============
function CameraScreen({ navigation }: any) {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
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
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const analyzePhoto = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const response = await analyzeImage(selectedImage);
      // Navigate to chat with the analysis result
      navigation.navigate('Chat', {
        imageUri: selectedImage,
        initialAnalysis: response.message,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.cameraContainer}>
      <ScrollView contentContainerStyle={styles.cameraContent}>
        <Text style={styles.cameraTitle}>Upload Your Image</Text>
        <Text style={styles.cameraSubtitle}>
          Share an x-ray, treatment plan, or photo of your teeth
        </Text>

        {/* Image Preview */}
        <View style={styles.imagePreviewContainer}>
          {selectedImage ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.clearImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Ionicons name="close-circle" size={28} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={60} color="#94A3B8" />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        {!selectedImage ? (
          <View style={styles.cameraButtons}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
              <Ionicons name="camera" size={28} color="white" />
              <Text style={styles.cameraButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
              <Ionicons name="images" size={28} color="#4A9BC7" />
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
              <Ionicons name="refresh" size={24} color="#4A9BC7" />
              <Text style={styles.galleryButtonText}>Choose Different Image</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>📸 Tips for best results:</Text>
          <Text style={styles.tipItem}>
            • For photos of a tooth in the mouth, have someone take it for you or upload the photo
            from your dentist
          </Text>
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

// ============ HISTORY SCREEN ============
function HistoryScreen({ navigation }: any) {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadConversations();
  }, []);

  // Reload when screen comes into focus
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadConversations();
    });
    return unsubscribe;
  }, [navigation]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const convos = await conversationService.getAll();
      setConversations(convos);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (id: string) => {
    Alert.alert('Delete Conversation', 'Are you sure you want to delete this conversation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await conversationService.delete(id);
          loadConversations();
        },
      },
    ]);
  };

  const openConversation = (conversation: Conversation) => {
    navigation.navigate('Chat', { conversationId: conversation.id });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.historyContainer}>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#6BB3D9" />
          <Text style={styles.loadingCenterText}>Loading your conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (conversations.length === 0) {
    return (
      <SafeAreaView style={styles.historyContainer}>
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={60} color="#B8DCF0" />
          <Text style={styles.emptyTitle}>No Conversations Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your chats with The Dental Angel will appear here
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Ionicons name="chatbubbles" size={24} color="white" />
            <Text style={styles.primaryButtonText}>Start a Chat</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.historyContainer}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.historyList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationCard}
            onPress={() => openConversation(item)}
            onLongPress={() => deleteConversation(item.id)}
          >
            <View style={styles.conversationHeader}>
              <Text style={styles.conversationTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.conversationDate}>
                {conversationService.formatDate(item.updatedAt)}
              </Text>
            </View>
            <Text style={styles.conversationPreview} numberOfLines={2}>
              {item.preview || 'No messages yet'}
            </Text>
            <View style={styles.conversationFooter}>
              <Text style={styles.messageCount}>
                {item.messages.length} {item.messages.length === 1 ? 'message' : 'messages'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.historyHint}>Tip: Press and hold a conversation to delete it</Text>
    </SafeAreaView>
  );
}

// ============ CHAT SCREEN ============
function ChatScreen({ navigation, route }: any) {
  const imageUri = route.params?.imageUri;
  const initialAnalysis = route.params?.initialAnalysis;
  const loadedConversationId = route.params?.conversationId;

  const [conversation, setConversation] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const flatListRef = React.useRef<FlatList>(null);

  // Initialize conversation
  React.useEffect(() => {
    const initConversation = async () => {
      if (loadedConversationId) {
        // Load existing conversation
        const loaded = await conversationService.get(loadedConversationId);
        if (loaded) {
          setConversation(loaded);
          // Convert stored messages to display format
          const displayMessages = loaded.messages.map((m) => ({
            id: m.id,
            text: m.content,
            isUser: m.role === 'user',
            imageUri: m.imageUri,
          }));
          setMessages(displayMessages);
          return;
        }
      }

      // Create new conversation
      const newConvo = conversationService.createConversation();
      setConversation(newConvo);

      // Set initial messages based on context
      if (imageUri && initialAnalysis) {
        const welcomeMsg = {
          id: '1',
          text: "I've analyzed your image. Here's what I can help you understand:",
          isUser: false,
        };
        const analysisMsg = { id: '2', text: initialAnalysis, isUser: false, imageUri: imageUri };
        setMessages([welcomeMsg, analysisMsg]);

        // Save to conversation
        let updated = conversationService.addMessage(newConvo, 'assistant', welcomeMsg.text);
        updated = conversationService.addMessage(updated, 'assistant', initialAnalysis, imageUri);
        setConversation(updated);
        conversationService.save(updated);
      } else {
        const welcomeMsg = { id: '1', text: INITIAL_GREETING, isUser: false };
        setMessages([welcomeMsg]);

        // Save welcome message to conversation
        const updated = conversationService.addMessage(newConvo, 'assistant', INITIAL_GREETING);
        setConversation(updated);
        conversationService.save(updated);
      }
    };

    initConversation();
  }, [loadedConversationId, imageUri, initialAnalysis]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !conversation) return;

    const userText = inputText.trim();
    const userMessage = { id: Date.now().toString(), text: userText, isUser: true };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Save user message to conversation
    let updatedConvo = conversationService.addMessage(conversation, 'user', userText);
    setConversation(updatedConvo);
    conversationService.save(updatedConvo);

    try {
      const history = messages.map((m) => ({
        role: m.isUser ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const response = await sendMessageToAngel(userText, history);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Save AI response to conversation
      updatedConvo = conversationService.addMessage(updatedConvo, 'assistant', response.message);
      setConversation(updatedConvo);
      conversationService.save(updatedConvo);
    } catch (error) {
      const errorText = 'Oops! I had a little hiccup there. Could you try asking again?';
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Save error message to conversation
      updatedConvo = conversationService.addMessage(updatedConvo, 'assistant', errorText);
      setConversation(updatedConvo);
      conversationService.save(updatedConvo);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.chatContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }: any) => (
            <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
              {!item.isUser && (
                <View style={styles.chatAngelIcon}>
                  <Text style={styles.chatAngelEmoji}>🦷</Text>
                </View>
              )}
              <View
                style={[styles.messageContent, item.isUser ? styles.userContent : styles.aiContent]}
              >
                {item.imageUri && (
                  <Image source={{ uri: item.imageUri }} style={styles.chatImage} />
                )}
                <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
                  {item.text}
                </Text>
              </View>
            </View>
          )}
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.chatAngelIcon}>
              <Text style={styles.chatAngelEmoji}>🦷</Text>
            </View>
            <View style={styles.loadingBubble}>
              <ActivityIndicator size="small" color="#6BB3D9" />
              <Text style={styles.loadingText}>The Dental Angel is thinking...</Text>
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.cameraIconButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Ionicons name="camera" size={24} color="#6BB3D9" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about dental care..."
            placeholderTextColor="#94A3B8"
            multiline
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.chatDisclaimer}>
          Educational guidance only. Always follow your dentist's advice.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============ MAIN APP ============
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: '#E8F4FC' },
          headerTintColor: '#2D7BA8',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#E8F4FC' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={({ navigation }) => ({
            title: 'Upload Image',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 8 }}>
                <Ionicons name="home-outline" size={22} color="#2D7BA8" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation }) => ({
            title: 'The Dental Angel',
            headerRight: () => (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Home')}
                  style={{ padding: 8 }}
                >
                  <Ionicons name="home-outline" size={22} color="#2D7BA8" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Chat')} style={{ padding: 8 }}>
                  <Ionicons name="add-circle-outline" size={24} color="#2D7BA8" />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={({ navigation }) => ({
            title: 'Your Conversations',
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Chat')} style={{ padding: 8 }}>
                <Ionicons name="add-circle-outline" size={24} color="#2D7BA8" />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ============ STYLES ============
const styles = StyleSheet.create({
  // Angel Avatar Component
  angelAvatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  halo: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    borderRadius: 100,
    opacity: 0.8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  wing: {
    position: 'absolute',
    color: '#B8DCF0',
    opacity: 0.9,
  },
  leftWing: { top: '30%' },
  rightWing: { top: '30%' },
  sparkle: { position: 'absolute' },
  sparkleTopLeft: { top: 0, left: 0 },
  sparkleBottomRight: { bottom: 0, right: 0 },

  // Welcome Screen
  welcomeContainer: {
    flexGrow: 1,
    backgroundColor: '#E8F4FC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  welcomeImage: {
    width: 180,
    height: 240,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#B8DCF0',
    backgroundColor: '#E2E8F0',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D7BA8',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 30 },
  featuresBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  featureItem: { fontSize: 16, color: '#334155', marginBottom: 12 },

  // Buttons
  primaryButton: {
    backgroundColor: '#6BB3D9',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  primaryButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#B8DCF0',
  },
  secondaryButtonText: { color: '#4A9BC7', fontSize: 18, fontWeight: '600' },

  // Home Screen
  homeContainer: { flex: 1, backgroundColor: '#E8F4FC', padding: 24 },
  homeHeader: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  dentalAngelImage: {
    width: 120,
    height: 160,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#B8DCF0',
    backgroundColor: '#E2E8F0',
  },
  homeTitle: { fontSize: 28, fontWeight: 'bold', color: '#2D7BA8', marginBottom: 8, marginTop: 8 },
  homeSubtitle: { fontSize: 16, color: '#64748B' },
  homeActions: { gap: 16 },
  historyButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  historyButtonText: { color: '#64748B', fontSize: 16, fontWeight: '500' },

  // Camera Screen
  cameraContainer: { flex: 1, backgroundColor: '#E8F4FC' },
  cameraContent: { padding: 24, alignItems: 'center' },
  cameraTitle: { fontSize: 24, fontWeight: 'bold', color: '#2D7BA8', marginBottom: 8 },
  cameraSubtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  uploadTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#D4EDFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
  uploadTipText: { flex: 1, fontSize: 14, color: '#4A9BC7', lineHeight: 20 },
  imagePreviewContainer: { width: '100%', marginBottom: 24 },
  imageWrapper: { position: 'relative' },
  imagePreview: { width: '100%', height: 250, borderRadius: 16, backgroundColor: '#E2E8F0' },
  clearImageButton: { position: 'absolute', top: 8, right: 8 },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#B8DCF0',
    borderStyle: 'dashed',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#94A3B8', marginTop: 12, fontSize: 16 },
  cameraButtons: { width: '100%', gap: 12 },
  cameraButton: {
    backgroundColor: '#6BB3D9',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cameraButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  galleryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#B8DCF0',
  },
  galleryButtonText: { color: '#4A9BC7', fontSize: 18, fontWeight: '600' },
  analyzeButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonDisabled: { opacity: 0.7 },
  tipsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginTop: 24,
  },
  tipsTitle: { fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 8 },
  tipItem: { fontSize: 14, color: '#64748B', marginBottom: 4 },
  privacyNote: { fontSize: 12, color: '#94A3B8', marginTop: 16, textAlign: 'center' },

  // History Screen
  historyContainer: { flex: 1, backgroundColor: '#E8F4FC' },
  historyList: { padding: 16 },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingCenterText: { marginTop: 12, color: '#64748B', fontSize: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#334155', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  conversationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationTitle: { fontSize: 17, fontWeight: '600', color: '#1E293B', flex: 1, marginRight: 8 },
  conversationDate: { fontSize: 13, color: '#94A3B8' },
  conversationPreview: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 8 },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageCount: { fontSize: 12, color: '#94A3B8' },
  historyHint: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  // Chat Screen
  chatContainer: { flex: 1, backgroundColor: '#E8F4FC' },
  messagesList: { padding: 16, paddingBottom: 8 },
  messageBubble: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  chatAngelIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#B8DCF0',
  },
  chatAngelEmoji: {
    fontSize: 18,
  },
  messageContent: { maxWidth: '75%', padding: 14, borderRadius: 16 },
  userContent: { backgroundColor: '#6BB3D9', borderBottomRightRadius: 4, marginLeft: 'auto' },
  aiContent: { backgroundColor: 'white', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: 'white' },
  aiText: { color: '#334155' },
  chatImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },

  // Loading
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    gap: 8,
  },
  loadingText: { color: '#64748B', fontStyle: 'italic' },

  // Input
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'flex-end',
  },
  cameraIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: '#334155',
  },
  sendButton: {
    backgroundColor: '#6BB3D9',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#B8DCF0',
  },
  chatDisclaimer: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: 'white',
  },

  // Common
  disclaimer: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
  },
});
