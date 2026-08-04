const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require("path");

const talentRoutes = require("./routes/talentRoutes");
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profileRoutes', profileRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/talents", talentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
