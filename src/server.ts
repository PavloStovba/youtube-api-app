import express from "express";
import fetch from "node-fetch";
import path from "path";
import db from "./db";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.YOUTUBE_API_KEY;
const API_URL = "https://www.googleapis.com/youtube/v3/search";

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/search", async (req, res) => {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ error: "Необхідно вказати q" });
  }

  const url = `${API_URL}?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
    query
  )}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data: any = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.json({ message: "Нічого не знайдено" });
    }

    const video = data.items[0];
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.default.url;

    db.run(
      "INSERT INTO videos (query, title, videoId, thumbnail) VALUES (?, ?, ?, ?)",
      [query, title, videoId, thumbnail],
      (err) => {
        if (err) console.error("DB error:", err.message);
      }
    );

    res.json({ query, title, videoId, thumbnail });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/saved", (req, res) => {
  db.all("SELECT * FROM videos ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер працює: http://localhost:${PORT}`);
});
