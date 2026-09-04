const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const path = require('path');


dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/series', require('./routes/seriesRoutes'));
//app.use('/api/movies', require('./routes/movieRoutes'));
//app.use('/api/series', require('./routes/seriesRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.use('/api/discussions', require('./routes/discussionRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
//app.use('/api/discussions', require('./routes/discussionRoutes'));
//app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/users', require('./routes/userListRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));

app.get('/', (req, res) => {
  res.send('Cinema Review Platform API running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));