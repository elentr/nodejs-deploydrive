import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export async function initMongoDB() {
  try {
    const user = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    const uri = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log('✅ Підключення до бази даних MongoDB успішне.');
  } catch (error) {
    console.error(
      '❌ Помилка підключення до бази даних MongoDB:',
      error.message
    );
    throw error;
  }
}
