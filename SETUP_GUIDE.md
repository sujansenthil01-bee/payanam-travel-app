# Quick Start Guide - Travel Expense Tracker

## Prerequisites

- **Node.js** v14+ and npm
- **MongoDB** (local or Atlas cloud)
- **React Native CLI** or Expo CLI
- **Android Studio** and **Xcode** (for mobile development)
- **Postman** (optional, for testing APIs)

## Step 1: Backend Setup (5 minutes)

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb-org

# Start MongoDB service
```

**Option B: MongoDB Atlas Cloud** (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### 1.3 Create Environment File
```bash
cp .env.example .env
```

### 1.4 Edit .env with your details
```env
MONGODB_URI=mongodb://localhost:27017/travel-expense
PORT=5000
JWT_SECRET=your-secret-key-change-this
GOOGLE_CLIENT_ID=get-from-google-console
GOOGLE_CLIENT_SECRET=get-from-google-console
OPENAI_API_KEY=get-from-openai
```

### 1.5 Start Backend Server
```bash
npm run dev
```

✅ Backend running on `http://localhost:5000`

Test with: `curl http://localhost:5000/health`

---

## Step 2: Get API Keys (10 minutes)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project "Travel Expense App"
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web + Mobile)
5. Copy Client ID and Secret to .env

### OpenAI
1. Go to [OpenAI](https://platform.openai.com)
2. Create API key
3. Add to .env as `OPENAI_API_KEY`

---

## Step 3: Mobile App Setup (10 minutes)

### 3.1 Install Dependencies
```bash
cd mobile
npm install
```

### 3.2 Update API URL
Edit `src/context/AuthContext.js` and `src/context/TripContext.js`:
```javascript
const API_URL = 'http://192.168.x.x:5000/api'; // Use your machine IP
```

### 3.3 Run on Android
```bash
npx react-native run-android
```

### 3.4 Run on iOS
```bash
npx react-native run-ios
```

---

## Testing the App

### 1. Test Backend APIs with Postman

**Register User**
```
POST http://localhost:5000/api/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Create Trip**
```
POST http://localhost:5000/api/trips
Authorization: Bearer <token>
{
  "name": "Goa Vacation",
  "startDate": "2024-12-20",
  "endDate": "2024-12-25",
  "destination": {
    "place": "Goa, India"
  }
}
```

### 2. Test Mobile App
1. Login with registered email
2. Create a trip
3. Add an expense
4. Test AI Travel Buddy chat
5. Generate trip recap

---

## Project Structure Quick Reference

```
TravelExpenseApp/
├── backend/
│   ├── models/          → Database schemas
│   ├── routes/          → API endpoints
│   ├── config/          → Auth config
│   └── server.js        → Main server
├── mobile/
│   ├── src/
│   │   ├── screens/     → UI pages
│   │   ├── context/     → State management
│   │   └── services/    → API calls
│   └── App.tsx          → Main app file
└── README.md
```

---

## Common Issues & Solutions

### Issue: Backend won't start
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service or update MONGODB_URI in .env

### Issue: API calls failing from mobile
```
Error: Network Error
```
**Solution**: 
- Use machine IP instead of localhost
- Check firewall settings
- Ensure backend is running

### Issue: Auth not working
```
Error: JWT verification failed
```
**Solution**: Make sure JWT_SECRET matches between requests

### Issue: Google Sign-in not working
```
Error: Invalid client ID
```
**Solution**: Verify Google Client ID in .env and Google Console setup

---

## Environment Setup Checklist

- [ ] Node.js and npm installed
- [ ] MongoDB running locally or Atlas connection string added
- [ ] .env file created with all keys
- [ ] Google OAuth credentials obtained
- [ ] OpenAI API key obtained
- [ ] Backend server starting without errors
- [ ] Mobile app installed and running
- [ ] Successfully logged in to mobile app
- [ ] Created a test trip
- [ ] Added an expense
- [ ] Chat with Travel Buddy works

---

## Next Steps

1. **Customize UI** - Update colors and logos in App.tsx
2. **Add More Features** - Implement all placeholder screens
3. **Deploy Backend** - Push to Heroku/Render/Railway
4. **Deploy Mobile** - Build APK/IPA and submit to stores
5. **Add Analytics** - Track usage and errors
6. **User Testing** - Get feedback and iterate

---

## Useful Commands

```bash
# Backend
npm run dev              # Start with nodemon
npm run start            # Start production
npm test                 # Run tests
npm run migrate          # Run migrations

# Mobile
npx react-native start   # Start dev server
npx react-native log-android  # View Android logs
npx react-native log-ios       # View iOS logs

# Database
mongo                    # Connect to local MongoDB
```

---

## Documentation & Resources

- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [React Native Docs](https://reactnative.dev)
- [JWT Auth](https://jwt.io)
- [OpenAI API](https://platform.openai.com/docs)

---

## Support

If you encounter issues:
1. Check error logs
2. Review .env configuration
3. Verify all services are running
4. Check network connectivity
5. Review database connection

For detailed help, refer to README.md

Happy coding! 🚀
