const PDFDocument = require('pdfkit');
const { DEFAULT_ARTICLES } = require('./data/questions');

/**
 * Generates a 2-page Valentine contract PDF:
 *  - Page 1: Contract articles
 *  - Page 2: Signatory info + signature
 *
 * Hard constraints:
 *  - Exactly 2 pages (no photos page)
 *  - Frame (encadré) on both pages
 *  - Prevent PDFKit “phantom pages” caused by margins overflow
 */
function generateCertificate(submission, config = {}) {
  const doc = new PDFDocument({
    size: 'A4',
    // IMPORTANT: margin=0 avoids PDFKit auto page breaks when drawing footer near bottom.
    // We manage our own layout margins (M).
    margin: 0,
    autoFirstPage: false,
    info: {
      Title: 'Contrat Officiel de Saint-Valentin',
      Author: 'Administration du Cupidon — Guichet N°7',
    },
  });

  const { contract = {}, signature = '', tenant = 'demo', answers = [], timestamp } = submission || {};
  const ts = timestamp || new Date().toISOString();

  // config.photos intentionally ignored => exactly 2 pages
  const tenantDisplay = capitalize(tenant);
  const articles = buildArticles(config.questions || [], tenantDisplay);

  // ===== Page geometry =====
  const PW = 595.28; // A4 width
  const PH = 841.89; // A4 height

  // Content margin inside the frame (your “layout margin”)
  const M = 55;
  const W = PW - 2 * M;

  // Frame / header / footer constants
  const FOOTER_Y = PH - 45;
  const CONTENT_TOP = 60;            // safe start (below header rule)
  const CONTENT_BOTTOM = FOOTER_Y - 28; // keep above footer

  // ===== PAGE 1 : CONTRACT =====
  addFramedPage(doc, { M, W, PW, PH, FOOTER_Y, CONTENT_TOP });
  renderContractPage(doc, {
    M,
    W,
    PH,
    CONTENT_BOTTOM,
    tenantDisplay,
    contract,
    ts,
    articles,
    answers,
  });

  // ===== PAGE 2 : DETAILS + SIGNATURE =====
  addFramedPage(doc, { M, W, PW, PH, FOOTER_Y, CONTENT_TOP });
  renderDetailsAndSignaturePage(doc, {
    M,
    W,
    PH,
    FOOTER_Y,
    CONTENT_BOTTOM,
    tenantDisplay,
    contract,
    signature,
    ts,
  });

  doc.end();
  return doc;
}

// ───────────────────────────────────────────────────────────────
// Page builders
// ───────────────────────────────────────────────────────────────

function addFramedPage(doc, { M, W, PW, PH, FOOTER_Y, CONTENT_TOP }) {
  doc.addPage({ size: 'A4', margin: 0 });

  // Draw frame + header + footer (and DO NOT let it alter flow position)
  drawPageFrame(doc, M, W, PW, PH, FOOTER_Y);

  // Reset flow cursor for content
  doc.x = M;
  doc.y = CONTENT_TOP;
}

function renderContractPage(doc, ctx) {
  const { M, W, PH, CONTENT_BOTTOM, tenantDisplay, contract, ts, articles, answers } = ctx;

  // Title block
  doc
    .font('Helvetica-Bold')
    .fontSize(24)
    .fillColor('#2b2d42')
    .text('CONTRAT OFFICIEL', M, 70, { align: 'center', width: W });

  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .fillColor('#2b2d42')
    .text('DE SAINT-VALENTIN', { align: 'center', width: W });

  doc.moveDown(0.45);
  drawLine(doc, M + 80, doc.y, W - 160, '#e91e63', 1.5);
  doc.moveDown(0.55);

  // Meta
  const signName = sanitizeForPdf(contract.name || tenantDisplay);
  doc
    .font('Helvetica')
    .fontSize(9.5)
    .fillColor('#555')
    .text(`Dossier ouvert au nom de : `, M, doc.y, { continued: true, width: W });

  doc
    .font('Helvetica-Bold')
    .fillColor('#2b2d42')
    .text(signName, { continued: false });

  doc
    .font('Helvetica-Oblique')
    .fontSize(8.5)
    .fillColor('#777')
    .text(`Fait le ${formatDate(ts)} — Version imprimable`, M, doc.y + 2, { width: W });

  doc.moveDown(0.55);
  drawLine(doc, M + 20, doc.y, W - 40, '#ffb3c1', 0.6);
  doc.moveDown(0.55);

  // Articles typography presets (adaptive if needed)
  const preset = pickContractPreset(doc, {
    M,
    W,
    CONTENT_BOTTOM,
    startY: doc.y,
    articles,
  });

  const badgeW = preset.badgeW;
  const badgeH = preset.badgeH;
  const badgeX = M + W - badgeW;

  // Layout widths
  const textX = M + 12;
  const textW = W - badgeW - 18; // leave room for badge + gap

  doc.lineGap(0);

  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    const accepted = answers && answers[i] === true;

    // If we are near the bottom (shouldn’t happen with preset selection), clamp (no new pages allowed)
    if (doc.y > CONTENT_BOTTOM - 22) break;

    // Article title
    doc
      .font('Helvetica-Bold')
      .fontSize(preset.titleFs)
      .fillColor('#e91e63')
      .text(`Article ${i + 1} — ${sanitizeForPdf(a.title)}`, M, doc.y, { width: W });

    doc.y += preset.titleGap;

    const textY = doc.y;

    // Article text (height-clamped to avoid any auto page add)
    doc
      .font('Helvetica')
      .fontSize(preset.textFs)
      .fillColor('#2b2d42');

    const remainingH = Math.max(0, CONTENT_BOTTOM - textY);
    doc.text(`« ${sanitizeForPdf(a.text)} »`, textX, textY, {
      width: textW,
      height: remainingH,
      align: 'left',
    });

    const afterTextY = doc.y;
    const blockH = Math.max(afterTextY - textY, badgeH);

    // Verdict badge (top-aligned with article text)
    drawVerdictBadge(doc, {
      x: badgeX,
      y: textY + 1,
      w: badgeW,
      h: badgeH,
      accepted,
    });

    doc.y = textY + blockH + preset.afterGap;
  }

  // Optional small end note if overflow clipped (keeps 2 pages requirement)
  if (doc.y > CONTENT_BOTTOM - 18) {
    doc
      .font('Helvetica-Oblique')
      .fontSize(7)
      .fillColor('#999')
      .text('NB : Mise en page compactée pour tenir sur une page (exigence administrative du Guichet N°7).', M, CONTENT_BOTTOM - 12, {
        width: W,
        align: 'center',
        height: 12,
      });
  }

  // Restore defaults
  doc.lineGap(0);
}

function renderDetailsAndSignaturePage(doc, ctx) {
  const { M, W, PH, FOOTER_Y, CONTENT_BOTTOM, tenantDisplay, contract, signature, ts } = ctx;

  doc.y = 65;

  // Title
  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .fillColor('#2b2d42')
    .text('INFORMATIONS DU SIGNATAIRE', M, doc.y, { align: 'center', width: W });

  doc.moveDown(0.4);
  drawLine(doc, M + 80, doc.y, W - 160, '#e91e63', 1.5);
  doc.moveDown(0.8);

  // Details table
  const col1 = M + 12;
  const col2 = M + 165;
  const valueW = W - (col2 - M) - 15;

  // Row 1
  drawDetailRow(
    doc,
    col1,
    col2,
    doc.y,
    'Signataire',
    `${sanitizeForPdf(contract.name || tenantDisplay)}${contract.nickname ? ` (${sanitizeForPdf(contract.nickname)})` : ''}`,
    W,
    valueW
  );
  doc.y += 30;

  // Row 2: romantic level (render dots as shapes to avoid emoji/font issues)
  const lvl = clampInt(contract.romanticLevel ?? 3, 1, 5);
  drawDetailRow(doc, col1, col2, doc.y, 'Niveau de romantisme', `${lvl}/5`, W, valueW);
  drawRatingDots(doc, {
    x: col2 + 42,
    y: doc.y + 13,
    level: lvl,
  });
  doc.y += 30;

  // Row 3: stamp (emoji-safe normalization)
  const stamp = sanitizeForPdf(contract.stamp || 'N/A');
  drawDetailRow(doc, col1, col2, doc.y, 'Tampon officiel', stamp, W, valueW);
  doc.y += 30;

  // Row 4: bonuses
  const bonuses = [];
  if (contract.bonusCompliment) bonuses.push('Compliment gratuit');
  if (contract.bonusSurprise) bonuses.push('Surprise (modérée)');
  if (contract.bonusDate) bonuses.push('Mini date');
  drawDetailRow(
    doc,
    col1,
    col2,
    doc.y,
    'Clauses bonus',
    sanitizeForPdf(bonuses.length > 0 ? bonuses.join(', ') : 'Aucune'),
    W,
    valueW
  );
  doc.y += 40;

  drawLine(doc, M + 20, doc.y, W - 40, '#ffb3c1', 0.5);
  doc.y += 20;

  // Signature section
  doc
    .fontSize(13)
    .font('Helvetica-Bold')
    .fillColor('#2b2d42')
    .text('SIGNATURE', M, doc.y, { width: W });

  doc.moveDown(0.25);
  doc
    .fontSize(8.5)
    .font('Helvetica')
    .fillColor('#888')
    .text('Le/La Signataire atteste avoir répondu librement¹ à l’ensemble du questionnaire.', M, doc.y, { width: W });

  doc.moveDown(0.7);

  const sigAreaY = doc.y;
  const sigBoxW = 230;
  const sigBoxH = signature && signature.startsWith('data:image') ? 100 : 50;

  // Left: signature
  doc.fontSize(8).font('Helvetica').fillColor('#888').text('Signature :', M, sigAreaY);
  const sigBoxY = sigAreaY + 14;

  doc
    .save()
    .roundedRect(M, sigBoxY, sigBoxW, sigBoxH, 4)
    .lineWidth(0.8)
    .strokeColor('#ddd')
    .fillAndStroke('#fcfcfc', '#ddd')
    .restore();

  if (signature && signature.startsWith('data:image/png;base64,')) {
    try {
      const imgData = signature.replace(/^data:image\/png;base64,/, '');
      const imgBuffer = Buffer.from(imgData, 'base64');
      doc.image(imgBuffer, M + 8, sigBoxY + 5, { width: sigBoxW - 16, height: sigBoxH - 10 });
    } catch (_) {
      doc.fontSize(10).font('Helvetica-Oblique').fillColor('#999')
        .text('[Signature]', M + 10, sigBoxY + 18);
    }
  } else if (signature && signature.startsWith('text:')) {
    doc.fontSize(15).font('Helvetica-Oblique').fillColor('#2b2d42')
      .text(sanitizeForPdf(signature.slice(5)), M + 14, sigBoxY + 15, { width: sigBoxW - 28, height: sigBoxH - 20 });
  }

  // Right: stamp + date
  const rightX = M + sigBoxW + 25;
  const stampBoxW = W - sigBoxW - 25;

  doc.fontSize(8).font('Helvetica').fillColor('#888').text('Tampon officiel :', rightX, sigAreaY);

  const stampBoxY = sigAreaY + 14;
  doc
    .save()
    .roundedRect(rightX, stampBoxY, stampBoxW, 55, 4)
    .lineWidth(0.8)
    .fillAndStroke('#fcfcfc', '#ddd')
    .restore();

  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('#e91e63')
    .text(stamp, rightX, stampBoxY + 18, { width: stampBoxW, align: 'center', height: 20 });

  const dateY = stampBoxY + 65;
  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#2b2d42')
    .text(`Fait le ${formatDate(ts)}`, rightX, dateY, { width: stampBoxW, align: 'center', height: 14 });

  // Footnote (kept above footer)
  const footnoteY = Math.min(
    Math.max(sigBoxY + sigBoxH + 25, dateY + 25),
    CONTENT_BOTTOM - 18
  );

  doc
    .fontSize(6.5)
    .font('Helvetica-Oblique')
    .fillColor('#bbb')
    .text(
      '¹ Selon la définition administrative en vigueur au Guichet N°7, où « librement » signifie « avec un sourire forcé mais sincère ».',
      M,
      footnoteY,
      { width: W, height: 24 }
    );
}

// ───────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────

function buildArticles(configQuestions, tenantName) {
  const tn = sanitizeForPdf(tenantName);
  return DEFAULT_ARTICLES.map((defaultArt) => {
    const override = configQuestions.find((q) => q.id === defaultArt.id);

    const raw = (override?.variants?.[0]?.text || defaultArt.text);
    const text = sanitizeForPdf(
      String(raw)
        .replace(/\{prenom\}/gi, tn)
        .replace(/\n/g, ' ')
        .trim()
    );

    return { title: sanitizeForPdf(defaultArt.title), text };
  });
}

/**
 * Draws border + header + footer on the current page.
 * IMPORTANT: we preserve doc.x/doc.y so it doesn't mess with flow.
 */
function drawPageFrame(doc, margin, width, pageW, pageH, footerY) {
  const prevX = doc.x;
  const prevY = doc.y;

  // Double border
  const m = 20;
  doc.save();
  doc.lineWidth(2).strokeColor('#e91e63')
    .rect(m, m, pageW - 2 * m, pageH - 2 * m).stroke();
  doc.lineWidth(0.5).strokeColor('#ffb3c1')
    .rect(m + 4, m + 4, pageW - 2 * m - 8, pageH - 2 * m - 8).stroke();
  doc.restore();

  // Header
  doc.save();
  doc.fontSize(7.5).font('Helvetica').fillColor('#e91e63')
    .text('ADMINISTRATION DU CUPIDON — GUICHET N°7', margin, 30, {
      align: 'center',
      width,
      height: 10,        // clamp => never triggers auto page creation
      ellipsis: true,
      lineBreak: false,
    });
  doc.moveTo(margin + 100, 42).lineTo(margin + width - 100, 42)
    .lineWidth(0.3).strokeColor('#ffb3c1').stroke();
  doc.restore();

  // Footer (height clamped to avoid any pagination side-effects)
  doc.save();
  doc.fontSize(6.5).font('Helvetica').fillColor('#ccc')
    .text(
      'Document officiel émis par l’Administration du Cupidon — Guichet N°7 — Toute falsification sera punie de 100 bisous supplémentaires.',
      margin,
      footerY,
      {
        align: 'center',
        width,
        height: 10,      // clamp
        ellipsis: true,
        lineBreak: false,
      }
    );
  doc.restore();

  // Restore cursor
  doc.x = prevX;
  doc.y = prevY;
}

function drawLine(doc, x, y, width, color, lineW) {
  doc.save()
    .moveTo(x, y).lineTo(x + width, y)
    .lineWidth(lineW).strokeColor(color).stroke()
    .restore();
}

function drawDetailRow(doc, labelX, valueX, y, label, value, totalW, valueW) {
  // Alternating row background
  doc.save()
    .rect(labelX - 8, y - 3, totalW - 8, 24)
    .fillColor('#fdf2f4').fill()
    .restore();

  // Left border accent
  doc.save()
    .rect(labelX - 8, y - 3, 3, 24)
    .fillColor('#e91e63').fill()
    .restore();

  doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#555')
    .text(label, labelX, y + 4, { height: 14 });

  doc.fontSize(9.5).font('Helvetica').fillColor('#2b2d42')
    .text(value, valueX, y + 4, { width: valueW, height: 14, ellipsis: true });
}

function drawVerdictBadge(doc, { x, y, w, h, accepted }) {
  const verdict = accepted ? 'ACCEPTÉ' : 'REFUSÉ';
  const badgeColor = accepted ? '#2e7d32' : '#c62828';
  const badgeBg = accepted ? '#e8f5e9' : '#ffebee';

  doc.save()
    .roundedRect(x, y, w, h, 3)
    .fillColor(badgeBg)
    .fill()
    .roundedRect(x, y, w, h, 3)
    .lineWidth(0.5)
    .strokeColor(badgeColor)
    .stroke()
    .restore();

  doc.fontSize(7.2).font('Helvetica-Bold').fillColor(badgeColor)
    .text(verdict, x, y + 2, { width: w, align: 'center', height: h });
}

/**
 * Dots rating rendered as vector shapes (no emoji/font dependency).
 */
function drawRatingDots(doc, { x, y, level }) {
  const r = 2.2;
  const gap = 6.4;

  for (let i = 1; i <= 5; i++) {
    const cx = x + (i - 1) * gap;
    doc.save();
    doc.circle(cx, y, r);
    if (i <= level) {
      doc.fillColor('#e91e63').fill();
    } else {
      doc.lineWidth(0.7).strokeColor('#ffb3c1').stroke();
    }
    doc.restore();
  }
}

function pickContractPreset(doc, { M, W, CONTENT_BOTTOM, startY, articles }) {
  const presets = [
    { titleFs: 10, textFs: 9, titleGap: 2, afterGap: 8, badgeW: 68, badgeH: 14 },
    { titleFs: 9.2, textFs: 8.4, titleGap: 2, afterGap: 7, badgeW: 66, badgeH: 13 },
    { titleFs: 8.8, textFs: 8.0, titleGap: 1.5, afterGap: 6, badgeW: 64, badgeH: 12 },
  ];

  const available = Math.max(0, CONTENT_BOTTOM - startY);
  const textW = W - presets[0].badgeW - 18;

  for (const p of presets) {
    const fits = measureArticlesHeight(doc, { p, articles, W, textW }) <= available;
    if (fits) return p;
  }

  // Fallback to most compact
  return presets[presets.length - 1];
}

function measureArticlesHeight(doc, { p, articles, W, textW }) {
  // We use PDFKit measurement with current fonts; ensure we set fonts before measuring.
  let total = 0;

  for (let i = 0; i < articles.length; i++) {
    // Title height
    doc.font('Helvetica-Bold').fontSize(p.titleFs);
    const th = doc.heightOfString(`Article ${i + 1} — ${articles[i].title}`, { width: W });

    // Text height
    doc.font('Helvetica').fontSize(p.textFs);
    const tx = doc.heightOfString(`« ${articles[i].text} »`, { width: textW });

    const block = th + p.titleGap + Math.max(tx, p.badgeH) + p.afterGap;
    total += block;
  }

  return total;
}

function formatDate(timestamp) {
  try {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (_) {
    return new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}

/**
 * Best-effort “emoji-safe” sanitizer:
 * - Keeps your already-working emojis if supported
 * - Normalizes common heart emojis to "♥" (works with Helvetica)
 * - Removes variation selectors that often break rendering
 * - Strips control chars
 */
function sanitizeForPdf(input) {
  let s = input === null || input === undefined ? '' : String(input);

  // Remove variation selectors (often causes tofu / weird glyph substitution)
  s = s.replace(/\uFE0F/g, '');

  // Normalize common hearts to a safe glyph
  const heartLike = /[❤♥💖💘💝💕💗💓💞💟]/gu;
  s = s.replace(heartLike, '♥');

  // Strip ASCII control chars (except \n, \t which we don't expect anyway)
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

  return s.trim();
}

function capitalize(str) {
  const s = String(str || '').trim();
  if (!s) return 'Demo';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function clampInt(v, min, max) {
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

module.exports = { generateCertificate };
