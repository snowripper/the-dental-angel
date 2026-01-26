# Testing The Dental Angel on Your Phone

This guide walks you through testing the app on your real iPhone or Android phone.

---

## What You'll Need

1. **Your phone** (iPhone or Android)
2. **Expo Go app** installed on your phone
   - iPhone: Download from the App Store (search "Expo Go")
   - Android: Download from Google Play Store (search "Expo Go")
3. **Your computer** connected to the same WiFi as your phone

---

## Step-by-Step Instructions

### Step 1: Start the App on Your Computer

1. Open a terminal/command prompt
2. Navigate to the project folder:
   ```
   cd "C:\Users\18183\OneDrive\Desktop\Billion dollar dental App\the-dental-angel"
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Wait for a QR code to appear in the terminal

### Step 2: Open on Your Phone

**iPhone:**
1. Open the Camera app
2. Point it at the QR code on your computer screen
3. Tap the notification that appears to open in Expo Go

**Android:**
1. Open the Expo Go app
2. Tap "Scan QR Code"
3. Point at the QR code on your computer screen

### Step 3: Test Everything

Go through this checklist and make sure everything works:

---

## Testing Checklist

### Welcome Screen
- [ ] App opens to the Welcome screen
- [ ] Dr. Angel image displays correctly
- [ ] "Get Started" button is visible and tappable
- [ ] Tapping "Get Started" takes you to the Home screen

### Home Screen
- [ ] Dr. Angel image displays correctly
- [ ] All three buttons are visible:
  - "Ask a Question"
  - "Upload X-Ray or Photo"
  - "Your Conversations"
- [ ] Tapping each button takes you to the correct screen

### Chat Screen (Ask a Question)
- [ ] Dr. Angel's greeting appears
- [ ] Keyboard appears when you tap the text input
- [ ] You can type a question
- [ ] Tapping the send button (arrow) sends your message
- [ ] Dr. Angel responds (may take a few seconds)
- [ ] Response sounds warm and friendly
- [ ] Disclaimer appears at the bottom

Try asking:
- "What is a dental crown?"
- "Why do I need a root canal?"
- "What should I ask my dentist about cavities?"

### Camera/Photo Upload
- [ ] Permission popup appears the first time
- [ ] You can take a photo with the camera
- [ ] You can select a photo from your gallery
- [ ] Photo preview appears after selection
- [ ] "Help Me Understand This" button works
- [ ] Dr. Angel analyzes and explains the image

Try uploading:
- A photo of any dental paperwork
- An x-ray image (if you have one)
- Even a random photo (Dr. Angel should explain what it sees)

### Conversation History
- [ ] Shows your past conversations
- [ ] Conversation titles are correct
- [ ] Tapping a conversation reopens it
- [ ] Long-pressing shows delete option
- [ ] Delete actually removes the conversation

### General
- [ ] App never crashes
- [ ] Text is readable (not too small)
- [ ] Buttons are easy to tap
- [ ] Everything loads in a reasonable time
- [ ] Colors look calming and professional

---

## What to Report

If something doesn't work, please note:

1. **What screen** were you on?
2. **What did you try to do?**
3. **What happened instead?**
4. **Any error messages** that appeared?

Take screenshots if possible!

---

## Building for App Stores (Next Step)

Once testing is complete and everything works, we'll build the actual app files:

```bash
# Build for both iOS and Android
npm run build:preview

# Or build for just one platform
npm run build:preview:ios
npm run build:preview:android
```

This creates real app files you can install directly on your phone (not through Expo Go).

---

## Common Issues

### "Network request failed"
- Make sure your phone and computer are on the same WiFi network
- Try pressing 'r' in the terminal to reload

### App is slow to load
- First load takes longer (downloading JavaScript)
- Subsequent loads should be faster

### Camera doesn't work
- Make sure you granted camera permission
- Try restarting the app

### AI responses don't appear
- Check your internet connection
- The API may be slow sometimes

---

## Questions?

Let me know what issues you find and we'll fix them together!
