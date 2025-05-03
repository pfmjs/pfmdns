const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000; // ✅ Use dynamic port

// Extract subdomain from Host header
app.use((req, res, next) => {
  const host = req.headers.host || "";
  const subdomain = host.split(".")[0]; // Works for lexius.pfmdns.onrender.com
  console.log("Extracted subdomain:", subdomain);
  req.subdomain = subdomain;
  next();
});

// Serve static files from /sites/<subdomain>
app.use((req, res, next) => {
  const subdomainDir = path.join(__dirname, "sites", req.subdomain);
  if (fs.existsSync(subdomainDir)) {
    express.static(subdomainDir)(req, res, next);
  } else {
    next();
  }
});

// Serve index.html as fallback
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "sites", req.subdomain, "index.html");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("<h1>404 — Site Not Found</h1>");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
