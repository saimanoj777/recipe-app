import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import recipesRouter from './routes/recipes.js';
// Example in index.js
const MONGO_URI = process.env.MONGO_URI;


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/recipes', recipesRouter);

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';

connectDB(URI)
  .then(() => app.listen(PORT, () => console.log(`Server on ${PORT}`)));
