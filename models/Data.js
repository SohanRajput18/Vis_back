import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
  end_year: String,
  intensity: Number,
  likelihood: Number,
  relevance: Number,
  year: Number,
  country: String,
  topic: String,
  region: String,
  city: String,
  sector: String,
  pestle: String,
  source: String,
  swot: String,
  title: String,
  url: String,
  published: Date,
  added: Date
}, {
  collection: 'insights', // 👈 MUST match your MongoDB collection
  strict: false // 👈 allows extra fields like `insight`, `start_year`, etc.
});

export default mongoose.model('Data', dataSchema, 'insights'); // 👈 Third argument optional if collection is set
