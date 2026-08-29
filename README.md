# Travel Expense Tracker - Complete Project

A full-stack mobile app for tracking expenses on group trips with AI assistance, real-time settlements, and India-focused features.

## Project Structure

```
TravelExpenseApp/
├── backend/                 # Node.js Express backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── config/             # Configuration files
│   ├── server.js           # Entry point
│   ├── package.json        # Dependencies
│   └── .env.example        # Environment variables
│
├── mobile/                  # React Native mobile app
│   ├── src/
│   │   ├── screens/        # UI screens
│   │   ├── context/        # React context (auth, trips)
│   │   └── components/     # Reusable components
│   ├── App.tsx             # Main app
│   └── package.json        # Dependencies
│
└── README.md
```

## Features Implemented

### ✅ Backend API
- **Authentication**: Email/Password + Google OAuth
- **Trips**: Create, read, update, delete trips
- **Expenses**: Add, edit, delete expenses with photos
- **Expense Splits**: Equal and custom splits
- **Payments**: Mark payments, settle up
- **Invites**: Share trips with unique invite codes
- **AI Assistant**: Travel Buddy chatbot using OpenAI
- **Map Integration**: India-focused geocoding with OpenStreetMap
- **Trip Recaps**: Generate shareable trip summaries

### ✅ Mobile App (React Native)
- Login/Registration screens
- Home dashboard with trips overview
- Trip creation and joining
- Expense tracking and photo upload
- Payment settlement interface
- AI Travel Buddy chat
- User profile management
- Bottom tab navigation

### ✅ Database (MongoDB)
- User schema with preferences
- Trip schema with destination info
- Expense schema with splits and photos
- Payment tracking
- Chat messages
- Trip recaps
- Invite codes

## Setup Instructions

### Backend Setup

1. **Install Node.js** (v14 or higher)

2. **Navigate to backend directory**
```bash
cd backend
npm install
```

3. **Create .env file** (copy from .env.example)
```bash
cp .env.example .env
```

4. **Configure environment variables in .env**:
```
MONGODB_URI=mongodb://localhost:27017/travel-expense
PORT=5000
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
```

5. **Install MongoDB** locally or use MongoDB Atlas cloud

6. **Start the backend server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Mobile App Setup

1. **Install React Native CLI**
```bash
npm install -g react-native-cli
# or
npm install -g expo-cli
```

2. **Navigate to mobile directory**
```bash
cd mobile
npm install
```

3. **Update API URL** in `src/context/AuthContext.js` and `src/context/TripContext.js`
```javascript
const API_URL = 'http://your-backend-url/api';
```

4. **For iOS**
```bash
npx react-native run-ios
```

5. **For Android**
```bash
npx react-native run-android
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Google OAuth initiate
- `GET /api/auth/verify` - Verify JWT token

### Trips
- `POST /api/trips` - Create trip
- `GET /api/trips` - Get user's trips
- `GET /api/trips/:tripId` - Get trip details
- `PUT /api/trips/:tripId` - Update trip
- `DELETE /api/trips/:tripId` - Delete trip
- `GET /api/trips/:tripId/summary` - Get settlement summary

### Expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses/trip/:tripId` - Get trip expenses
- `PUT /api/expenses/:expenseId` - Update expense
- `DELETE /api/expenses/:expenseId` - Delete expense

### Payments
- `POST /api/payments` - Record payment
- `GET /api/payments/trip/:tripId` - Get payment summary
- `PUT /api/payments/:paymentId/accept` - Accept payment
- `PUT /api/payments/:paymentId/reject` - Reject payment

### Invites
- `POST /api/invites` - Create invite link
- `POST /api/invites/accept/:inviteCode` - Join via invite
- `GET /api/invites/trip/:tripId` - Get trip invites

### Chat (AI Travel Buddy)
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/trip/:tripId` - Get chat history
- `GET /api/chat/trip/:tripId/suggestions` - Get budget suggestions

### Map
- `GET /api/map/search?query=...` - Search locations in India
- `GET /api/map/reverse?latitude=...&longitude=...` - Reverse geocoding
- `GET /api/map/destinations` - Popular destinations
- `POST /api/map/distance` - Calculate distance

### Trip Recaps
- `POST /api/recaps/generate/:tripId` - Generate recap
- `GET /api/recaps/:tripId` - Get trip recap
- `GET /api/recaps/share/:recapId` - Public recap link

## Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  avatar: String,
  phone: String,
  upiId: String,
  bankAccount: { accountNumber, ifscCode, accountHolder },
  preferences: { currency, language, theme },
  friends: [ObjectId]
}
```

### Trip
```javascript
{
  name: String,
  destination: { place, coordinates, country, state, city },
  startDate: Date,
  endDate: Date,
  owner: ObjectId,
  members: [{ userId, joinedAt, isAdmin }],
  expenses: [ObjectId],
  totalSpent: Number,
  currency: String,
  status: 'planning' | 'ongoing' | 'completed'
}
```

### Expense
```javascript
{
  tripId: ObjectId,
  description: String,
  amount: Number,
  category: String,
  paidBy: ObjectId,
  date: Date,
  receipt: { photoUrl, uploadedAt },
  splits: [{ userId, amount, percentage }],
  location: { name, coordinates }
}
```

## Authentication Flow

### Email/Password
1. User registers with email, password, and name
2. Backend hashes password with bcrypt
3. JWT token generated and sent
4. Token stored in AsyncStorage on mobile
5. Token sent in Authorization header for requests

### Google OAuth
1. Mobile app initiates Google sign-in
2. User authenticates with Google
3. Google token sent to backend
4. Backend verifies and creates/finds user
5. JWT token returned for session

## AI Travel Buddy Features

The chatbot can:
- Help log expenses naturally ("I spent 500 on lunch")
- Suggest fair splits ("How should we split this?")
- Provide budget tips ("We're spending too much on food")
- Answer travel questions ("Best places in Goa?")
- Remind about settlements ("You owe Raj ₹500")

## Deployment

### Backend (Heroku/Render)
```bash
git push heroku main
```

### Mobile (Play Store/App Store)
```bash
# Build APK for Android
npx react-native build-android

# Build IPA for iOS
npx react-native build-ios
```

## Environment Variables Needed

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=your-mongodb-connection

# Authentication
JWT_SECRET=your-secret
JWT_EXPIRE=7d

# Google
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

# AI
OPENAI_API_KEY=your-openai-key
AI_MODEL=gpt-3.5-turbo

# Frontend
FRONTEND_URL=http://localhost:3000
```

## Key Dependencies

### Backend
- express
- mongoose
- jsonwebtoken
- passport
- openai
- axios
- multer

### Mobile
- react-native
- @react-navigation
- axios
- react-native-maps
- react-native-image-picker

## Testing

### Backend Tests
```bash
npm test
```

### Mobile Tests
```bash
npm test
```

## Common Issues & Solutions

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env

2. **API Not Responding**
   - Check if backend server is running on correct port
   - Update API_URL in mobile app

3. **Image Upload Failing**
   - Check upload directory permissions
   - Ensure file size is within limit (5MB)

4. **Google Sign-In Not Working**
   - Verify Google Client ID and Secret
   - Check redirect URI matches backend

## Future Enhancements

- [ ] Real-time notifications
- [ ] Push notifications for payments
- [ ] Group chat for trip members
- [ ] Photo gallery and shared albums
- [ ] Budget forecasting with ML
- [ ] Expense categorization with ML
- [ ] Dark mode support
- [ ] Multiple currency support
- [ ] Calendar view for expenses
- [ ] Recurring expenses

## License

MIT

## Support

For issues or questions, please create an issue or contact support.
