const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    tenant: { type: String, required: true, index: true },
    answers: { type: [Boolean], required: true },
    contract: {
      name: String,
      nickname: String,
      romanticLevel: Number,
      bonusCompliment: Boolean,
      bonusSurprise: Boolean,
      bonusDate: Boolean,
      stamp: String,
    },
    signature: { type: String, required: true },
    userAgent: String,
    timestamp: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
