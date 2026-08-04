const express = require("express");
const cors = require("cors");
const path = require("path");

const talentRoutes = require("./routes/talentRoutes");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to the SewaMandala API!");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/talents", talentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});