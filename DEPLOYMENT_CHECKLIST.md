# 🎯 Deployment Checklist - Travel Expense Tracker

## Pre-Deployment Setup

### Developer Accounts (Sign up once)
- [ ] GitHub account - https://github.com
- [ ] MongoDB Atlas - https://www.mongodb.com/cloud/atlas
- [ ] Render.com - https://render.com
- [ ] Google Cloud Console - https://console.cloud.google.com
- [ ] OpenAI Platform - https://platform.openai.com
- [ ] Google Play Developer - https://play.google.com/console ($25 fee)

---

## Step 1: MongoDB Atlas (15 minutes)

- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster (Asia - Mumbai preferred)
- [ ] Wait for cluster to be ready (3-5 minutes)
- [ ] Create database user: `travelbuddy`
- [ ] Save password securely
- [ ] Go to "Network Access" → Add IP `0.0.0.0/0`
- [ ] Click "Connect" → Copy connection string
- [ ] Replace `<password>` in connection string
- [ ] Save connection string (you'll need it in Render)

**Verify**: Try connecting with MongoDB Compass using connection string

---

## Step 2: Backend Deployment to Render (20 minutes)

### Prepare Backend
- [ ] Navigate to: `cd TravelExpenseApp/backend`
- [ ] Create `.gitignore` (or use provided)
- [ ] Verify `package.json` has correct scripts
- [ ] Create `render.yaml` file (provided)
- [ ] Initialize git: `git init`
- [ ] Commit code: `git add . && git commit -m "Initial"`

### Create GitHub Repository
- [ ] Go to https://github.com/new
- [ ] Name: `travel-expense-app`
- [ ] Make it **Private** (important!)
- [ ] Click "Create repository"
- [ ] Copy push commands
- [ ] Run in backend folder:
  ```bash
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/travel-expense-app.git
  git push -u origin main
  ```

### Deploy on Render
- [ ] Go to https://render.com
- [ ] Sign in with GitHub
- [ ] Click "New +"
- [ ] Select "Web Service"
- [ ] Click "Connect to GitHub"
- [ ] Select your `travel-expense-app` repository
- [ ] Set "Root Directory" to: `backend`
- [ ] Click "Create Web Service"
- [ ] Wait for automatic deployment (5-10 minutes)

### Add Environment Variables to Render
- [ ] In Render dashboard, click your service
- [ ] Go to "Environment" tab
- [ ] Click "Add Environment Variable" for each:
  ```
  MONGODB_URI = mongodb+srv://travelbuddy:PASSWORD@cluster.mongodb.net/travel-expense?retryWrites=true&w=majority
  JWT_SECRET = your-super-secret-key-12345
  GOOGLE_CLIENT_ID = [from Google Console]
  GOOGLE_CLIENT_SECRET = [from Google Console]
  GOOGLE_CALLBACK_URL = https://[YOUR_RENDER_URL]/api/auth/google/callback
  OPENAI_API_KEY = [from OpenAI]
  FRONTEND_URL = http://localhost:3000
  ```

### Get Backend URL
- [ ] From Render dashboard, copy your URL (e.g., `https://travel-expense-backend.onrender.com`)
- [ ] Verify it works: Visit `https://[YOUR_URL]/health`
- [ ] Should show: `{"status":"Server is running"}`

✅ **Backend Deployed!**

---

## Step 3: Google OAuth Setup (10 minutes)

### Create Google OAuth Credentials
- [ ] Go to https://console.cloud.google.com
- [ ] Create new project: "Travel Expense Tracker"
- [ ] Enable "Google+ API"
- [ ] Go to "Credentials"
- [ ] Click "Create Credentials" → "OAuth 2.0 Client ID"
- [ ] Choose "Web application"
- [ ] Add Authorized redirect URIs:
  ```
  http://localhost:3000/auth/callback
  http://localhost:5000/api/auth/google/callback
  https://[YOUR_RENDER_URL]/api/auth/google/callback
  ```
- [ ] Create credentials
- [ ] Copy Client ID and Client Secret
- [ ] Save both (you need them for Render and mobile app)

✅ **Google OAuth Ready!**

---

## Step 4: OpenAI API Key (2 minutes)

- [ ] Go to https://platform.openai.com/api-keys
- [ ] Click "Create new secret key"
- [ ] Copy the key
- [ ] Save it (you can't see it again!)
- [ ] Add to Render environment variables

✅ **OpenAI Ready!**

---

## Step 5: Update Mobile App (10 minutes)

### Update API URL
- [ ] Open `mobile/src/context/AuthContext.js`
- [ ] Replace `const API_URL = '...'` with:
  ```javascript
  const API_URL = 'https://[YOUR_RENDER_URL]/api';
  ```
- [ ] Do same in `mobile/src/context/TripContext.js`
- [ ] Do same in `mobile/src/screens/chat/ChatScreen.tsx`

### Test Locally First
- [ ] Run Android emulator or connect device
- [ ] Run: `npx react-native run-android`
- [ ] Test login, create trip, add expense
- [ ] Verify it connects to your backend

✅ **Mobile App Updated!**

---

## Step 6: Build Android APK (30 minutes)

### Prerequisites
- [ ] Android Studio installed
- [ ] Java JDK installed
- [ ] Android SDK installed
- [ ] ANDROID_HOME environment variable set

### Generate Signing Key
```bash
cd mobile/android/app
keytool -genkey -v -keystore travelbuddy-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias travel-expense
```
- [ ] Enter keystore password (save this!)
- [ ] Enter key password (same as keystore)
- [ ] Fill in name and organization details
- [ ] Key created at `mobile/android/app/travelbuddy-key.jks`

### Build APK
- [ ] Navigate to mobile folder: `cd mobile`
- [ ] Build release APK:
  ```bash
  cd android
  ./gradlew assembleRelease
  ```
- [ ] Wait 5-10 minutes for build
- [ ] APK created at: `android/app/build/outputs/apk/release/app-release.apk`

### Test APK
- [ ] Connect Android device
- [ ] Run: `adb install android/app/build/outputs/apk/release/app-release.apk`
- [ ] Open "Travel Buddy" app
- [ ] Test login and basic features
- [ ] Verify it connects to your backend

✅ **APK Built & Tested!**

---

## Step 7: Google Play Store Setup (30 minutes)

### Create Developer Account
- [ ] Go to https://play.google.com/console
- [ ] Sign in with Google account
- [ ] Accept terms and pay $25
- [ ] Complete account setup

### Create App
- [ ] Click "Create app"
- [ ] App name: "Travel Buddy"
- [ ] Default language: English
- [ ] Type: Productivity or Lifestyle
- [ ] Content rating: 3+
- [ ] Click "Create"

### Add Store Listing
- [ ] Go to "Store presence" → "Main store listing"
- [ ] App name: "Travel Buddy"
- [ ] Short description: "Track expenses on group trips with AI"
- [ ] Full description: (see DEPLOYMENT_GUIDE.md)
- [ ] Category: Finance or Productivity
- [ ] Contact email: your-email@gmail.com

### Add Media
- [ ] Screenshots: Upload 5 phone screenshots
  - Home screen with trips
  - Expense tracking
  - AI Travel Buddy chat
  - Settlement screen
  - Trip recap
- [ ] Feature image: 1024x500px
- [ ] Icon: 512x512px

### Content Rating
- [ ] Go to "Content rating"
- [ ] Answer questionnaire
- [ ] Get rating certificate

### Privacy Policy
- [ ] Go to "App content"
- [ ] Add privacy policy URL (use template if needed)
- [ ] Mark appropriate content permissions

### Pricing & Distribution
- [ ] Go to "Pricing & distribution"
- [ ] Select "Free"
- [ ] Select countries (start with India)
- [ ] Accept all agreements

### Upload APK
- [ ] Go to "Release" → "Production"
- [ ] Click "Create new release"
- [ ] Upload your APK file
- [ ] Add release notes:
  ```
  Version 1.0.0 - Initial Release
  
  ✨ Features:
  - AI-powered expense tracking
  - Group trip management
  - Smart cost splitting
  - Real-time payments
  - Trip recaps
  ```
- [ ] Click "Save"
- [ ] Click "Review release"
- [ ] Click "Rollout to production"

### Submit for Review
- [ ] Verify all store listing completed
- [ ] Go to "Dashboard"
- [ ] Check for any warnings or missing items
- [ ] Click "Submit app"
- [ ] Wait for email confirmation

✅ **App Submitted!**

---

## Step 8: Wait for Approval (24-48 hours)

- [ ] Monitor email for updates
- [ ] Check Play Store Console for status
- [ ] Once approved, app goes live!
- [ ] Get app link: Play Store search "Travel Buddy"

---

## Post-Launch Checklist

- [ ] Download app from Play Store
- [ ] Test complete flow (login → create trip → add expense → settle)
- [ ] Share with friends
- [ ] Ask for reviews and ratings
- [ ] Monitor crash reports in Play Console
- [ ] Setup analytics (Firebase, Mixpanel)
- [ ] Plan for next features

---

## Important Files & Locations

| File/Key | Location | Status |
|----------|----------|--------|
| MongoDB Connection String | Saved safely | ✅ |
| Render Backend URL | Dashboard | ✅ |
| Google Client ID | Google Console | ✅ |
| Google Client Secret | Render Env Vars | ✅ |
| OpenAI API Key | Render Env Vars | ✅ |
| Signing Key (travelbuddy-key.jks) | `mobile/android/app/` | ✅ |
| APK File | `mobile/android/app/build/outputs/apk/release/` | ✅ |
| GitHub Repository | `github.com/YOUR_USERNAME/travel-expense-app` | ✅ |

---

## Troubleshooting

### Backend deployment fails
```bash
# Check Render logs
# Solution: Verify MongoDB URI and all env vars
```

### Mobile app can't connect to backend
```bash
# Check API URL in mobile app
# Verify Render backend is running
# Test: curl https://[YOUR_URL]/health
```

### APK build fails
```bash
cd mobile
./gradlew clean
./gradlew assembleRelease
```

### Play Store rejects app
- Check for broken functionality
- Verify privacy policy is set
- Test all permissions
- Make sure no test/fake content

---

## Success Indicators

✅ Render backend running at `https://[YOUR_URL]`
✅ Android APK built and tested
✅ App submitted to Play Store
✅ Play Store approval received
✅ App live at Play Store!

---

## Time Estimates

| Phase | Time | Difficulty |
|-------|------|------------|
| MongoDB Setup | 15 min | Easy |
| Backend Deploy | 20 min | Easy |
| Google OAuth | 10 min | Easy |
| OpenAI Setup | 5 min | Easy |
| Mobile Update | 10 min | Easy |
| APK Build | 30 min | Medium |
| Play Store Setup | 30 min | Medium |
| Review Wait | 24-48 hrs | Passive |
| **TOTAL** | **~3-4 hours** | **Easy-Medium** |

---

## Support & Resources

- Stuck? Check `DEPLOYMENT_GUIDE.md` for detailed steps
- Backend issues? Check Render logs
- Mobile issues? Check Android logcat
- Play Store questions? Check their help center

**You've got this! 🚀**
