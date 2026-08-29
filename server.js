require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const expenseRoutes = require('./routes/expenses');
const chatRoutes = require('./routes/chat');

const app = express();
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => res.send('Payanam API is running 🚋'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Payanam backend running on port ${PORT}`));
