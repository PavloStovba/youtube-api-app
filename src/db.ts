    import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./youtube.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT,
      title TEXT,
      videoId TEXT,
      thumbnail TEXT
    )
  `);
});

export default db;
