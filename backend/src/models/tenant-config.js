const mongoose = require('mongoose');

const questionOverrideSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    variants: [
      {
        text: String,
        yesLabel1: String,
        yesLabel2: String,
      },
    ],
    bureauMessages: [String],
  },
  { _id: false }
);

const tenantConfigSchema = new mongoose.Schema(
  {
    tenant: { type: String, required: true, unique: true, index: true },
    questions: [questionOverrideSchema],
    photos: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('TenantConfig', tenantConfigSchema);
