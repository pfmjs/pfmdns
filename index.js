const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Middleware to extract subdomain from request
app.use((req, res, next) => {
  const host = req.headers.host;
  const subdomain = host.split(".")[0]; // Handles only first subdomain part
  console.log("Extracted subdomain:", subdomain); // Debugging line
  req.subdomain = subdomain;
  next();
});

// Serve static files based on subdomain
app.use((req, res, next) => {
  const sub = req.subdomain;
  const subdomainDir = path.join(__dirname, "sites", sub);

  if (fs.existsSync(subdomainDir)) {
    express.static(subdomainDir)(req, res, next); // Dynamically serve static files
  } else {
    next(); // Continue to 404
  }
});

// Route for index.html
app.get("", (req, res) => {
  const sub = req.subdomain;
  const subdomainDir = path.join(__dirname, "sites", sub);

  const filePath = path.join(subdomainDir, "index.html");

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("<h1>404 — Site Not Found</h1>");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
