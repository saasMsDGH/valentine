function extractTenant(req, _res, next) {
  const host = req.hostname || req.headers.host || '';
  const firstLabel = host.split('.')[0].toLowerCase();
  req.tenant = (firstLabel === 'localhost' || firstLabel === '127') ? 'demo' : firstLabel;
  next();
}

module.exports = { extractTenant };
