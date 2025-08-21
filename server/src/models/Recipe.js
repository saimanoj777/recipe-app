import mongoose from 'mongoose';

const NutrientsSchema = new mongoose.Schema({
  calories: String,
  carbohydrateContent: String,
  cholesterolContent: String,
  fiberContent: String,
  proteinContent: String,
  saturatedFatContent: String,
  sodiumContent: String,
  sugarContent: String,
  fatContent: String,
  calories_kcal: Number
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  cuisine: String,
  title: { type: String, index: 'text' },
  rating: Number,
  prep_time: Number,
  cook_time: Number,
  total_time: Number,
  description: String,
  nutrients: NutrientsSchema,
  serves: String
});

// Indexes to optimize common queries
RecipeSchema.index({ rating: -1 });
RecipeSchema.index({ cuisine: 1 });
RecipeSchema.index({ total_time: 1 });
RecipeSchema.index({ 'nutrients.calories_kcal': 1 });

export default mongoose.model('Recipe', RecipeSchema);
