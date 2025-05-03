const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Extract subdomain
app.use((req, res, next) => {
  const host = req.headers.host;
  const parts = host.split(".");
  // Ignore 'onrender.com' and 'pfmdns'
  req.subdomain = parts.length > 2 ? parts[0] : null;
  console.log("Subdomain:", req.subdomain);
  next();
});

// Serve static files from /sites/<subdomain>/
app.use((req, res, next) => {
  if (!req.subdomain) return res.status(400).send("No subdomain detected");

  const staticDir = path.join(__dirname, "sites", req.subdomain);
  if (fs.existsSync(staticDir)) {
    express.static(staticDir)(req, res, next);
  } else {
    res.status(404).send("<h1>404 — Site Not Found</h1>");
  }
});

// Serve index.html for root route
app.get("/", (req, res) => {
  if (!req.subdomain) return res.status(400).send("No subdomain provided");

  const indexPath = path.join(__dirname, "sites", req.subdomain, "index.html");

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("<h1>404 — Site Not Found</h1>");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
