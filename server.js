const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Catch-all route to support SPA routing only if the file doesn't exist
app.get("*", (req, res) => {
  const requestedPath = path.join(__dirname, "public", req.path);

  // Normalize the path to prevent directory traversal
  const normalizedPath = path.normalize(requestedPath);

  // Ensure the path is within the public directory
  if (!normalizedPath.startsWith(path.join(__dirname, "public"))) {
    return res.status(403).send("Forbidden");
  }

  // Check if the requested file exists and is a file
  fs.stat(normalizedPath, (err, stats) => {
    if (!err && stats.isFile()) {
      return res.sendFile(normalizedPath);
    } else {
      // If file doesn't exist, serve index.html for SPA routing
      res.sendFile(path.join(__dirname, "public", "index.html"));
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
