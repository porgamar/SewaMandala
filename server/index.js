const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const path = require("path");

const usersRoutes = require("./routes/users");
const talentRoutes = require("./routes/talentRoutes");
const authRoutes = require('./routes/auth');
// const profileRoutes = require('./routes/profile');
const contactRoutes = require('./routes/contact');
const profileRoutes = require('./routes/profileRoutes');
const jobsRoutes = require("./routes/jobsRoutes");

const talentsRouter = require("./routes/talentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/users", usersRoutes);
app.use('/api/profileRoutes', profileRoutes);
app.use("/api/talents", talentsRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/talents", talentRoutes);
app.use("/api/jobs", jobsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});