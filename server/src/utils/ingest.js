import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Recipe from '../models/Recipe.js';
import { connectDB } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

const toNum = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().toLowerCase();
  if (!s || s === 'nan' || s === 'null' || s === 'undefined') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
const numFromStr = (s) => {
  const m = String(s).match(/([0-9.]+)/);
  return m ? Number(m[1]) : null;
};

(async () => {
  const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  await connectDB(URI);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, '../../data/recipes.json');
  const raw = fs.readFileSync(filePath, 'utf-8');

  const parseArray = (input) => {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === 'object') {
        // Root is an object keyed by ids: convert to values
        const values = Object.values(parsed);
        if (values.length > 0 && typeof values[0] === 'object') return values;
      }
    } catch {}
    // Try NDJSON
    const lines = input.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length > 1) {
      try {
        return lines.map(l => JSON.parse(l));
      } catch {}
    }
    throw new Error('Unsupported JSON structure: expected array, object containing array, or NDJSON.');
  };

  const data = parseArray(raw);
  const docs = data.map(r => ({
    title: r.title,
    cuisine: r.cuisine,
    rating: toNum(r.rating),
    prep_time: toNum(r.prep_time),
    cook_time: toNum(r.cook_time),
    total_time: toNum(r.total_time),
    description: r.description,
    serves: r.serves,
    nutrients: { ...r.nutrients, calories_kcal: numFromStr(r.nutrients?.calories) }
  }));
  await Recipe.deleteMany();
  await Recipe.insertMany(docs);
  console.log('Ingested', docs.length);
  process.exit();
})();
