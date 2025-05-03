const express = require("express");
const path = require("path");

const app = express();

// ✅ Make the 'sites' folder publicly accessible
app.use('/sites', express.static(path.join(__dirname, 'sites')));

// Optional: home route or fallback
app.get("/", (req, res) => {
  res.send("<h1>Welcome to pfmdns</h1>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
