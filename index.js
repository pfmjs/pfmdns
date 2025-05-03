const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Middleware: extract subdomain
app.use((req, res, next) => {
  const host = req.headers.host;
  const parts = host.split(".");
  req.subdomain = parts.length > 2 ? parts[0] : null;
  console.log("Subdomain:", req.subdomain);
  next();
});

// Middleware: serve static files from /sites/<subdomain>/
app.use((req, res, next) => {
  if (!req.subdomain) return next();
  const dir = path.join(__dirname, "sites", req.subdomain);
  if (fs.existsSync(dir)) {
    express.static(dir)(req, res, next);
  } else {
    next();
  }
});

// Route: serve index.html for subdomain
app.use((req, res) => {
  if (!req.subdomain) return res.status(400).send("No subdomain provided");

  const filePath = path.join(__dirname, "sites", req.subdomain, "index.html");

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("<h1>404 — Site Not Found</h1>");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
