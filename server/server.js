const express = require("express");
const talentRoutes = require("./routes/talentRoutes");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the SewaMandala API!");
});

app.use(express.json());

app.use("/api/talents", talentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});