const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Extract subdomain from host
app.use((req, res, next) => {
  const host = req.headers.host;
  const subdomain = host.split(".")[0]; // e.g., lexius.pfmdns.onrender.com → lexius
  console.log("Extracted subdomain:", subdomain);
  req.subdomain = subdomain;
  next();
});

// Serve static files for subdomain (e.g., style.css, script.js)
app.use((req, res, next) => {
  const sub = req.subdomain;
  const subdomainDir = path.join(__dirname, "sites", sub);

  if (fs.existsSync(subdomainDir)) {
    express.static(subdomainDir)(req, res, next);
  } else {
    next();
  }
});

// Route all requests to index.html in subdomain folder
app.get("*", (req, res) => {
  const sub = req.subdomain;
  const subdomainDir = path.join(__dirname, "sites", sub);
  const indexFile = path.join(subdomainDir, "index.html");

  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).send("<h1>404 — Site Not Found</h1>");
  }
});

// Use the correct Render port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
