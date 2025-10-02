"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database("./youtube.db");
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
exports.default = db;
//# sourceMappingURL=db.js.map