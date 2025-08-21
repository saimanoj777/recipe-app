import express from 'express';
import Recipe from '../models/Recipe.js';
const router = express.Router();

const parseOp = (raw) => {
  if (!raw) return null;
  const m = raw.match(/^(<=|>=|<|>|=)?\s*([\d.]+)$/);
  if (!m) return null;
  const [, op = '=', num] = m;
  const map = { '<': '$lt', '<=': '$lte', '>': '$gt', '>=': '$gte', '=': '$eq' };
  return { [map[op]]: Number(num) };
};

router.get('/', async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const total = await Recipe.countDocuments();
  const data = await Recipe.find()
    .sort({ rating: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ page, limit, total, data });
});

router.get('/search', async (req, res) => {
  const { title, cuisine, calories, rating, total_time } = req.query;
  const q = {};
  if (title) q.title = { $regex: title, $options: 'i' };
  if (cuisine) q.cuisine = { $regex: `^${cuisine}$`, $options: 'i' };
  const rOp = parseOp(rating);
  if (rOp) q.rating = rOp;
  const tOp = parseOp(total_time);
  if (tOp) q.total_time = tOp;
  const cOp = parseOp(calories);
  if (cOp) q['nutrients.calories_kcal'] = cOp;

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const total = await Recipe.countDocuments(q);
  const data = await Recipe.find(q).sort({ rating: -1 })
    .skip((page - 1) * limit).limit(limit);
  res.json({ page, limit, total, data });
});

export default router;
