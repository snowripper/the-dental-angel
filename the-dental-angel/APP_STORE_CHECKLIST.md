# App Store Submission Checklist

## Documents Created (Ready)

- [x] **Privacy Policy** - `PRIVACY_POLICY.md`
- [x] **Terms of Service** - `TERMS_OF_SERVICE.md`
- [x] **App Store Descriptions** - `APP_STORE_CONTENT.md`
  - App name and subtitle
  - Short description (Google Play)
  - Full description
  - Keywords
  - Categories
  - What's New text
  - Screenshot text suggestions

---

## Developer Accounts Needed

### Apple App Store
- [ ] Apple Developer Account - **$99/year**
- Sign up at: https://developer.apple.com/programs/enroll/

### Google Play Store
- [ ] Google Play Developer Account - **$25 one-time**
- Sign up at: https://play.google.com/console/signup

---

## App Icons Needed

### For iOS (App Store)
- [ ] **App Icon** - 1024 x 1024 pixels (PNG, no transparency)

### For Android (Google Play)
- [ ] **High-res Icon** - 512 x 512 pixels
- [ ] **Feature Graphic** - 1024 x 500 pixels (promotional banner)

### Current Icons (Placeholders)
The app currently has placeholder icons in `/assets/`:
- `icon.png` - Main app icon
- `adaptive-icon.png` - Android adaptive icon
- `splash-icon.png` - Splash screen
- `favicon.png` - Web favicon

**Recommendation:** Create a professional icon featuring:
- The tooth with halo/wings concept (like the avatar in the app)
- Soft blue colors matching the app theme (#6BB3D9, #E8F4FC)
- Simple, recognizable at small sizes

---

## Screenshots Needed

### iOS Screenshots (iPhone)
Required sizes:
- [ ] 6.7" Display (iPhone 15 Pro Max) - 1290 x 2796 pixels
- [ ] 6.5" Display (iPhone 14 Plus) - 1284 x 2778 pixels
- [ ] 5.5" Display (iPhone 8 Plus) - 1242 x 2208 pixels

**Recommended screenshots (5-10):**
1. Welcome screen with "Your Friendly Dental Guide"
2. Home screen showing main options
3. Chat showing a question about crowns
4. Chat showing Dr. Angel's friendly response
5. Camera/upload screen
6. Image analysis result
7. Conversation history screen

### Android Screenshots (Google Play)
- [ ] Phone screenshots - minimum 2, up to 8
- [ ] 7-inch tablet (optional)
- [ ] 10-inch tablet (optional)

---

## Before Submitting

### Legal Review
- [ ] Have a healthcare attorney review Terms of Service
- [ ] Confirm medical disclaimer language is sufficient
- [ ] Verify compliance with health app regulations

### Technical Checks
- [x] All tests passing
- [x] TypeScript clean
- [x] App runs on iOS and Android
- [ ] Test on multiple device sizes
- [ ] Performance testing

### Content Checks
- [x] AI responses include proper disclaimers
- [x] No diagnostic or prescriptive language
- [x] Always redirects to "ask your dentist"

---

## Build Commands

Once developer accounts are set up and icons/screenshots are ready:

```bash
# Navigate to project
cd "C:\Users\18183\OneDrive\Desktop\Billion dollar dental App\the-dental-angel"

# Build for both platforms
npm run build:production

# Or build individually
npm run build:production:ios
npm run build:production:android

# Submit to stores
npm run submit:ios
npm run submit:android
```

---

## EAS Configuration Needed

Update `eas.json` with your Apple credentials:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-id@email.com",
      "ascAppId": "your-app-store-connect-app-id"
    },
    "android": {
      "serviceAccountKeyPath": "./path-to-google-service-account.json"
    }
  }
}
```

---

## Timeline Estimate

| Step | Status |
|------|--------|
| Privacy Policy | Done |
| Terms of Service | Done |
| App Descriptions | Done |
| App Icons | Need design |
| Screenshots | Need to capture |
| Apple Developer Account | Need to sign up |
| Google Developer Account | Need to sign up |
| Legal Review | Recommended before launch |
| Submit to Apple | After above complete |
| Submit to Google | After above complete |
| Apple Review | 1-3 days typically |
| Google Review | 1-7 days typically |

---

## Notes

- Apple review can take 1-3 days, sometimes longer for health-related apps
- Google review is typically faster (hours to a few days)
- First submission may require additional documentation about the app's purpose
- The "educational only" positioning should help with approval

---

## Questions?

The app is ready to build and submit once:
1. Developer accounts are created
2. Professional app icons are designed
3. Screenshots are captured
4. (Recommended) Legal review is complete
