import mongoose from 'mongoose';

export const connectDB = async (uri) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { dbName: 'recipes_db' });
  return mongoose.connection;
};
