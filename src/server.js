"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
const API_KEY = process.env.YOUTUBE_API_KEY;
const API_URL = "https://www.googleapis.com/youtube/v3/search";
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// 🔎 Пошук відео
app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Необхідно вказати q" });
    }
    const url = `${API_URL}?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${API_KEY}`;
    try {
        const response = await (0, node_fetch_1.default)(url);
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            return res.json({ message: "Нічого не знайдено" });
        }
        const video = data.items[0];
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.default.url;
        // Зберегти в SQLite
        db_1.default.run("INSERT INTO videos (query, title, videoId, thumbnail) VALUES (?, ?, ?, ?)", [query, title, videoId, thumbnail], (err) => {
            if (err)
                console.error("DB error:", err.message);
        });
        res.json({ query, title, videoId, thumbnail });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 📂 Перегляд збережених
app.get("/saved", (req, res) => {
    db_1.default.all("SELECT * FROM videos ORDER BY id DESC", (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює: http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map