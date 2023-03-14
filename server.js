const express = require("express");
const bodyParser = require("body-parser");
const shortid = require("shortid");
const validUrl = require("valid-url");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Set up middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Set up database
const DB_FILE = "urls.json";
let urls = {};
try {
  urls = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  console.log(`Loaded ${Object.keys(urls).length} URLs from database file`);
} catch (err) {
  console.log(`Error reading database file: ${err}`);
}

// Define routes
app.post("/api/shorten", (req, res) => {
  const longUrl = req.body.longUrl;
  const customUrl = req.body.customUrl;

  // Validate the input URL
  if (!validUrl.isUri(longUrl)) {
    console.log(`Invalid URL: ${longUrl}`);
    return res.status(400).json({ error: "Invalid URL" });
  }

  // Check if a custom short URL was provided
  let shortName;
  if (customUrl) {
    // Make sure the custom URL is not already in use
    if (urls[customUrl]) {
      console.log(`Custom URL already in use: ${customUrl}`);
      return res.status(400).json({ error: "Custom URL already in use" });
    }
    shortName = customUrl;
  } else {
    // Generate a short URL using shortid
    shortName = shortid.generate();
  }

  // Save the mapping from short URL to long URL in the database
  urls[shortName] = longUrl;
  fs.writeFileSync(DB_FILE, JSON.stringify(urls, null, 2));

  const shortUrl = `${req.protocol}://${req.hostname}:${PORT}/r/${shortName}`;
  console.log(`Added URL mapping: ${shortUrl} -> ${longUrl}`);

  // Return the short URL with the current request hostname
  res.json({ shortUrl });
});

app.get("/r/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;

  // Look up the long URL from the database using the short URL
  const longUrl = urls[shortUrl];

  // If the short URL is not in the database, return a 404 error
  if (!longUrl) {
    console.log(`Short URL not found: ${shortUrl}`);
    return res.status(404).send("Not Found");
  }

  // Redirect to the long URL
  console.log(`Redirecting to long URL: ${longUrl}`);
  res.redirect(longUrl);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
