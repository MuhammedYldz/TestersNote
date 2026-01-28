require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');
const cloudinaryConfig = require('./config/cloudinaryConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary yapılandırması
cloudinaryConfig.setup();

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

// Routes
app.use('/api/notes', noteRoutes);

// Ana route
app.get('/', (req, res) => {
  res.send('Testers Note API çalışıyor');
});

// Server başlatma
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});