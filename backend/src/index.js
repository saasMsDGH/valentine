const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { extractTenant } = require('./middleware/tenant');
const apiRoutes = require('./routes/api');
const { connectStorage } = require('./storage');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '5mb' }));
app.use(extractTenant);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);
app.use('/api', apiRoutes);

async function start() {
  await connectStorage();
  app.listen(PORT, () => {
    console.log(`Valentine API listening on :${PORT}`);
  });
}

start();
