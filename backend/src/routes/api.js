const { Router } = require('express');
const { saveSubmission, getSubmission, getConfig, saveConfig } = require('../storage');
const { generateCertificate } = require('../pdf-generator');

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

/* ─── PDF download ─── */
router.get('/submission/:id/pdf', async (req, res) => {
  try {
    const submission = await getSubmission(req.params.id, req.tenant);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    let config = {};
    try {
      config = await getConfig(req.tenant) || {};
    } catch (_) { /* no config */ }

    const filename = `valentine-${req.tenant}-${req.params.id}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const pdfStream = generateCertificate(submission, config);
    pdfStream.pipe(res);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

/* ─── Tenant config ─── */
router.get('/config', async (req, res) => {
  try {
    const config = await getConfig(req.tenant);
    res.json(config || { tenant: req.tenant, questions: [], photos: [] });
  } catch (err) {
    console.error('Config fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/config', async (req, res) => {
  try {
    const { questions, photos } = req.body;
    const saved = await saveConfig(req.tenant, { questions, photos });
    res.json({ success: true, config: saved });
  } catch (err) {
    console.error('Config save error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/config/questions', async (req, res) => {
  try {
    const config = await getConfig(req.tenant);
    res.json({ questions: config?.questions || [] });
  } catch (err) {
    console.error('Questions fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
