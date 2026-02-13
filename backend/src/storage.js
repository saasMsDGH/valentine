const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Submission = require('./models/submission');
const TenantConfig = require('./models/tenant-config');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');
const CONFIG_FILE = path.join(DATA_DIR, 'configs.json');

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
  if (!fs.existsSync(CONFIG_FILE)) fs.writeFileSync(CONFIG_FILE, '[]');
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

async function getSubmission(id, tenant) {
  if (useMongo) {
    return Submission.findOne({ _id: id, tenant });
  }
  const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  return existing.find((e) => e._id === id && e.tenant === tenant) || null;
}

async function getConfig(tenant) {
  if (useMongo) {
    return TenantConfig.findOne({ tenant });
  }
  if (!fs.existsSync(CONFIG_FILE)) return null;
  const configs = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  return configs.find((c) => c.tenant === tenant) || null;
}

async function saveConfig(tenant, data) {
  if (useMongo) {
    return TenantConfig.findOneAndUpdate(
      { tenant },
      { tenant, questions: data.questions || [], photos: data.photos || [] },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  if (!fs.existsSync(CONFIG_FILE)) fs.writeFileSync(CONFIG_FILE, '[]');
  const configs = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  const idx = configs.findIndex((c) => c.tenant === tenant);
  const entry = {
    tenant,
    questions: data.questions || [],
    photos: data.photos || [],
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) {
    configs[idx] = entry;
  } else {
    configs.push(entry);
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(configs, null, 2));
  return entry;
}

module.exports = { connectStorage, saveSubmission, getSubmission, getConfig, saveConfig };
