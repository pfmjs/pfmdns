// index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use((req, res, next) => {
  const host = req.headers.host;
  const subdomain = host.split(".")[0];
  req.subdomain = subdomain;
  next();
});

app.get("*", (req, res) => {
  const sub = req.subdomain;
  const filePath = path.join(__dirname, "sites", sub, "index.html");

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.send("<h1>404 — Site Not Found</h1>");
  }
});

app.listen(3000, () => console.log("Server running"));
