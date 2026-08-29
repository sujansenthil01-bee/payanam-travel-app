# Payanam 🚋 — Travel Planner App

A full-stack mobile app (React Native/Expo) + Node/Express backend + PostgreSQL,
matching your Figma screenshots exactly, with:

- 🟠 Splash screen with the orange sky/plane/train logo (screenshot 1)
- 📋 Trip dashboard with glowing stat cards: Estimated total / Per person / Trip length (screenshot 2)
- ✍️ "Make room for more" trip planning form with **fully editable date pickers** (screenshots 3 & 4)
- 💰 All amounts in **₹ Indian Rupees**
- 🗺️ **India-centered map** using FREE OpenStreetMap tiles + Nominatim geocoding (no API key needed to start)
- 🔐 Auth: Email/Password **and** "Continue with Google"
- 💸 Expense tracking: equal splits, **custom/unequal splits**, receipt photos, settle-up balances
- 👥 Crew invites via shareable link
- 📸 Receipt photos attached to any expense
- 🎉 Trip Recap: shareable one-page summary (spend + map + best moments)
- 🤖 **Travel Buddy** — AI chatbot that logs expenses from natural language ("add ₹500 for auto"),
  answers budget questions, and gives itinerary ideas — powered by OpenAI (swappable for any LLM)

## Project structure

```
payanam-app/
├── backend/                  # Node.js + Express + PostgreSQL API
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/auth.js    # JWT auth guard
│   ├── routes/
│   │   ├── auth.js           # signup / login / google
│   │   ├── trips.js          # CRUD, invites, places, recap
│   │   ├── expenses.js       # equal & custom splits, receipts, balances
│   │   └── chat.js           # Travel Buddy AI assistant
│   ├── database/schema.sql   # Full Postgres schema
│   └── .env.example
└── mobile/                   # React Native (Expo) app
    ├── App.js
    └── src/
        ├── screens/
        │   ├── SplashScreen.js       (screenshot 1)
        │   ├── LoginScreen.js / SignupScreen.js
        │   ├── TripDashboardScreen.js (screenshot 2)
        │   ├── PlanTripScreen.js      (screenshots 3 & 4, editable dates)
        │   ├── ExpenseScreen.js       (splits, receipts, balances)
        │   ├── MapScreen.js           (India map, free tiles)
        │   ├── ChatBotScreen.js       (Travel Buddy)
        │   └── RecapScreen.js
        ├── navigation/AppNavigator.js
        ├── context/AuthContext.js
        ├── api/api.js, geocode.js
        └── theme/colors.js
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, GOOGLE_CLIENT_ID
createdb payanam             # or use a hosted Postgres (Neon/Supabase/Render — all have free tiers)
npm run migrate              # runs database/schema.sql
npm run dev                  # starts on http://localhost:5000
```

**Getting the keys:**
- `JWT_SECRET`: any long random string.
- `GOOGLE_CLIENT_ID`: create an OAuth 2.0 Client ID at console.cloud.google.com (type: Web application for Expo Go, or Android/iOS for a standalone build).
- `OPENAI_API_KEY`: from platform.openai.com — powers Travel Buddy. You can swap this for any other LLM by editing `routes/chat.js`.

## 2. Mobile app setup

```bash
cd mobile
npm install
npx expo install react-native-maps @react-native-community/datetimepicker
```

Edit `src/api/api.js` → set `API_BASE_URL` to your backend's URL (use your computer's local IP,
e.g. `http://192.168.1.5:5000/api`, when testing on a physical phone with Expo Go —
`localhost` only works in a simulator).

Edit `src/screens/LoginScreen.js` → replace `YOUR_GOOGLE_EXPO_CLIENT_ID` with your real Google client ID.

```bash
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) to run it as a real mobile app.

## 3. Map notes

The map uses `react-native-maps` with free OpenStreetMap raster tiles and free
Nominatim search — **no billing, no API key** required, and it's centered on India
by default. When you're ready for Google Maps, add your key to `app.json` →
`android.config.googleMaps.apiKey`, add `provider={PROVIDER_GOOGLE}` to the
`<MapView>` in `MapScreen.js`, and remove the `<UrlTile>` line — nothing else changes.

## 4. Travel Buddy (AI assistant)

Talk to it in plain English inside the app:
- *"Add ₹800 for lunch, paid by Ravi"* → logs the expense and splits it automatically
- *"What's my budget left?"* → answers using live trip data
- *"Suggest a day plan for Pondicherry"* → itinerary ideas

It's implemented server-side in `backend/routes/chat.js` so your OpenAI key never
ships inside the app. Swap models/providers there freely.

## 5. Deploying for a demo

- Backend: Render / Railway / Fly.io (all have free tiers) — just set the same env vars.
- Database: Neon.tech or Supabase (free Postgres).
- Mobile: `eas build` for a shareable APK, or just demo live via Expo Go + QR code.
