const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Submission = require('./models/submission');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

let useMongo = false;

async function connectStorage() {
  const uri = process.env.MONGO_URI;
  if (uri) {
    try {
      await mongoose.connect(uri);
      useMongo = true;
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      console.warn('MongoDB unavailable:', err.message);
    }
  }
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
  console.log('Using file-based storage');
}

async function saveSubmission(data) {
  if (useMongo) {
    return new Submission(data).save();
  }
  const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const entry = { ...data, _id: Date.now().toString(), createdAt: new Date().toISOString() };
  existing.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
  return entry;
}

module.exports = { connectStorage, saveSubmission };
