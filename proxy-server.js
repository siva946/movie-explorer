// proxy-server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // Allow requests from anywhere (localhost included)

// Proxy endpoint
app.get("/api/archive", async (req, res) => {
  try {
    const archiveUrl = "https://archive.org/advancedsearch.php?q=title:%22Captain%20Marvel%22&mediatype=movies&output=json";
    const response = await fetch(archiveUrl);

    if (!response.ok) {
      throw new Error(`Archive.org returned status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy Error:", err);
    res.status(500).json({ error: "Failed to fetch Archive.org data" });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Proxy running at http://localhost:${PORT}`));
