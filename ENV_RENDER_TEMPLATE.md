# Environment Variables for Render Deployment
# Copy these to Render Dashboard → Your Service → Environment

# Database
MONGODB_URI=mongodb+srv://travelbuddy:YOUR_PASSWORD@cluster.mongodb.net/travel-expense?retryWrites=true&w=majority

# Server
PORT=10000
NODE_ENV=production

# Security
JWT_SECRET=change-this-to-a-long-random-string-12345678901234567890
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-from-console.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-service-name.onrender.com/api/auth/google/callback

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here
AI_MODEL=gpt-3.5-turbo

# Frontend URLs
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_DIR=/tmp/uploads
MAX_FILE_SIZE=5242880

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Maps (OpenStreetMap - Free)
OPENSTREETMAP_API=https://nominatim.openstreetmap.org
