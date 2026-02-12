const { Router } = require('express');
const { saveSubmission } = require('../storage');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.post('/submit', async (req, res) => {
  try {
    const { tenant, answers, contract, signature, userAgent, timestamp } = req.body;

    if (!tenant || typeof tenant !== 'string') {
      return res.status(400).json({ error: 'tenant is required' });
    }
    if (!Array.isArray(answers) || answers.length !== 10) {
      return res.status(400).json({ error: 'answers must be an array of 10 booleans' });
    }
    if (!signature || typeof signature !== 'string') {
      return res.status(400).json({ error: 'signature is required' });
    }

    const saved = await saveSubmission({
      tenant: req.tenant || tenant,
      answers,
      contract: contract || {},
      signature,
      userAgent: userAgent || req.headers['user-agent'],
      timestamp: timestamp || new Date().toISOString(),
    });

    console.log(`Submission saved for tenant: ${req.tenant}`);
    res.status(201).json({ success: true, id: saved._id });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
