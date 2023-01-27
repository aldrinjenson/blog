const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

// Read SSL certificate and private key
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/<your.domain.tld>/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/<your.domain.tld>/cert.pem"),
};

// Define GET method in the root route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
// Create HTTPS server
https.createServer(options, app).listen(443);

console.log("Server listening on port 443");
