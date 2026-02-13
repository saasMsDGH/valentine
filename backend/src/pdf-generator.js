const PDFDocument = require('pdfkit');
const { DEFAULT_ARTICLES } = require('./data/questions');

/**
 * Generates a Valentine contract PDF with articles, details, and signature.
 * @param {Object} submission - The full submission document
 * @param {Object} config - Tenant config (questions overrides + photos)
 * @returns {PDFDocument} - A readable stream to pipe to the HTTP response
 */
function generateCertificate(submission, config = {}) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 60, bottom: 60, left: 55, right: 55 },
    autoFirstPage: false,
    info: {
      Title: 'Contrat Officiel de Saint-Valentin',
      Author: 'Administration du Cupidon \u2014 Guichet N\u00B07',
    },
  });

  const { contract, signature, tenant, answers, timestamp } = submission;
  const photos = config.photos || [];
  const tenantDisplay = tenant.charAt(0).toUpperCase() + tenant.slice(1);
  const articles = buildArticles(config.questions || [], tenantDisplay);

  const M = 55;
  const PW = 595.28; // A4 width
  const PH = 841.89; // A4 height
  const W = PW - 2 * M;
  const FOOTER_Y = PH - 45;

  // ===== PAGE 1 : CONTRACT ARTICLES =====
  doc.addPage();
  drawPageFrame(doc, M, W, PW, PH, FOOTER_Y);

  // --- Title block ---
  doc
    .fontSize(26)
    .font('Helvetica-Bold')
    .fillColor('#2b2d42')
    .text('CONTRAT OFFICIEL', M, 65, { align: 'center', width: W });
  doc
    .fontSize(18)
    .text('DE SAINT-VALENTIN', { align: 'center', width: W });

  doc.moveDown(0.5);
  drawLine(doc, M + 80, doc.y, W - 160, '#e91e63', 1.5);
  doc.moveDown(0.7);

  // --- Parties ---
  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor('#555')
    .text('Entre les soussign\u00E9s :', M, doc.y, { width: W });
  doc.moveDown(0.25);
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor('#2b2d42')
    .text('L\u2019Administration du Cupidon', M + 15, doc.y, { continued: true });
  doc
    .font('Helvetica')
    .fillColor('#555')
    .text(', repr\u00E9sent\u00E9e par le Guichet N\u00B07, ci-apr\u00E8s \u00AB L\u2019Administration \u00BB,');
  doc.moveDown(0.15);
  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor('#555')
    .text('et', M + 15, doc.y);
  doc.moveDown(0.15);
  doc
    .font('Helvetica-Bold')
    .fillColor('#2b2d42')
    .text(`${contract.name || tenantDisplay}`, M + 15, doc.y, { continued: true });
  doc
    .font('Helvetica')
    .fillColor('#555')
    .text(`, ci-apr\u00E8s \u00AB Le/La Signataire \u00BB,`);
  doc.moveDown(0.4);
  doc
    .fontSize(9.5)
    .font('Helvetica-Oblique')
    .fillColor('#555')
    .text(
      `Vu les r\u00E9sultats du questionnaire officiel en date du ${formatDate(timestamp)}, les parties conviennent des articles suivants :`,
      M, doc.y, { width: W }
    );

  doc.moveDown(0.6);
  drawLine(doc, M + 20, doc.y, W - 40, '#ffb3c1', 0.5);
  doc.moveDown(0.5);

  // --- Articles ---
  articles.forEach((article, i) => {
    // Check if we need a new page (leave room for article ~55px + footer)
    if (doc.y > PH - 130) {
      doc.addPage();
      drawPageFrame(doc, M, W, PW, PH, FOOTER_Y);
      doc.y = 60;
    }

    const num = i + 1;
    const accepted = answers && answers[i] === true;

    // Article title
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#e91e63')
      .text(`Article ${num} \u2014 ${article.title}`, M, doc.y, { width: W });

    doc.moveDown(0.1);

    // Article text + verdict on same area
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#2b2d42')
      .text(`\u00AB ${article.text} \u00BB`, M + 12, doc.y, { width: W - 110, continued: false });

    // Verdict badge - draw at the right side, aligned with the article text
    const verdictY = doc.y - 12;
    const verdict = accepted ? 'ACCEPT\u00C9' : 'REFUS\u00C9';
    const badgeColor = accepted ? '#2e7d32' : '#c62828';
    const badgeBg = accepted ? '#e8f5e9' : '#ffebee';

    // Badge background
    const badgeX = M + W - 72;
    doc
      .save()
      .roundedRect(badgeX, verdictY - 1, 68, 14, 3)
      .fillColor(badgeBg)
      .fill()
      .restore();
    doc
      .save()
      .roundedRect(badgeX, verdictY - 1, 68, 14, 3)
      .lineWidth(0.5)
      .strokeColor(badgeColor)
      .stroke()
      .restore();
    doc
      .fontSize(7.5)
      .font('Helvetica-Bold')
      .fillColor(badgeColor)
      .text(verdict, badgeX, verdictY + 1, { width: 68, align: 'center' });

    doc.moveDown(0.25);
  });

  // ===== PAGE 2 : DETAILS + SIGNATURE =====
  doc.addPage();
  drawPageFrame(doc, M, W, PW, PH, FOOTER_Y);
  doc.y = 65;

  // --- Section title ---
  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .fillColor('#2b2d42')
    .text('INFORMATIONS DU SIGNATAIRE', M, doc.y, { align: 'center', width: W });

  doc.moveDown(0.4);
  drawLine(doc, M + 80, doc.y, W - 160, '#e91e63', 1.5);
  doc.moveDown(0.8);

  // --- Details table ---
  const col1 = M + 12;
  const col2 = M + 165;
  const colW = W - (col2 - M) - 15;

  drawDetailRow(doc, col1, col2, doc.y, 'Signataire', `${contract.name || tenantDisplay}${contract.nickname ? ` (${contract.nickname})` : ''}`, W, colW);
  doc.y += 30;

  const lvl = contract.romanticLevel || 3;
  const romanticDisplay = `${lvl}/5   ` + '\u25CF '.repeat(lvl) + '\u25CB '.repeat(5 - lvl);
  drawDetailRow(doc, col1, col2, doc.y, 'Niveau de romantisme', romanticDisplay, W, colW);
  doc.y += 30;

  drawDetailRow(doc, col1, col2, doc.y, 'Tampon officiel', contract.stamp || 'N/A', W, colW);
  doc.y += 30;

  const bonuses = [];
  if (contract.bonusCompliment) bonuses.push('Compliment gratuit');
  if (contract.bonusSurprise) bonuses.push('Surprise (mod\u00E9r\u00E9e)');
  if (contract.bonusDate) bonuses.push('Mini date');
  drawDetailRow(doc, col1, col2, doc.y, 'Clauses bonus', bonuses.length > 0 ? bonuses.join(', ') : 'Aucune', W, colW);
  doc.y += 40;

  drawLine(doc, M + 20, doc.y, W - 40, '#ffb3c1', 0.5);
  doc.y += 20;

  // --- Signature section ---
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
    .text('Le/La Signataire atteste avoir r\u00E9pondu librement\u00B9 \u00E0 l\u2019ensemble du questionnaire.', M, doc.y, { width: W });
  doc.moveDown(0.7);

  const sigAreaY = doc.y;
  const sigBoxW = 230;
  const sigBoxH = signature && signature.startsWith('data:image') ? 100 : 50;

  // --- Left column: Signature ---
  doc
    .fontSize(8)
    .font('Helvetica')
    .fillColor('#888')
    .text('Signature :', M, sigAreaY);

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
    doc
      .fontSize(15)
      .font('Helvetica-Oblique')
      .fillColor('#2b2d42')
      .text(signature.slice(5), M + 14, sigBoxY + 15);
  }

  // --- Right column: Stamp + Date ---
  const rightX = M + sigBoxW + 25;
  const stampBoxW = W - sigBoxW - 25;

  doc
    .fontSize(8)
    .font('Helvetica')
    .fillColor('#888')
    .text('Tampon officiel :', rightX, sigAreaY);

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
    .text(contract.stamp || '', rightX, stampBoxY + 18, { width: stampBoxW, align: 'center' });

  // Date
  const dateY = stampBoxY + 65;
  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#2b2d42')
    .text(`Fait le ${formatDate(timestamp)}`, rightX, dateY, { width: stampBoxW, align: 'center' });

  // --- Footnote (absolute position, well above footer) ---
  const footnoteY = Math.max(sigBoxY + sigBoxH + 25, dateY + 25);
  doc
    .fontSize(6.5)
    .font('Helvetica-Oblique')
    .fillColor('#bbb')
    .text(
      '\u00B9 Selon la d\u00E9finition administrative en vigueur au Guichet N\u00B07, o\u00F9 \u00AB librement \u00BB signifie \u00AB avec un sourire forc\u00E9 mais sinc\u00E8re \u00BB.',
      M, footnoteY, { width: W }
    );

  // ===== PHOTOS PAGE (optional) =====
  if (photos.length > 0) {
    doc.addPage();
    drawPageFrame(doc, M, W, PW, PH, FOOTER_Y);
    doc.y = 65;

    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .fillColor('#2b2d42')
      .text('ANNEXE \u2014 ALBUM PHOTO', M, doc.y, { align: 'center', width: W });

    doc.moveDown(0.4);
    drawLine(doc, M + 80, doc.y, W - 160, '#e91e63', 1.5);
    doc.moveDown(0.8);

    const photoW = (W - 20) / 2;
    const photoH = 220;
    let col = 0;
    let curY = doc.y;

    photos.forEach((photo) => {
      try {
        const data = photo.replace(/^data:image\/[^;]+;base64,/, '');
        const buf = Buffer.from(data, 'base64');
        const x = M + col * (photoW + 20);

        doc
          .save()
          .roundedRect(x - 2, curY - 2, photoW + 4, photoH + 4, 4)
          .lineWidth(1.5)
          .strokeColor('#ff8fa3')
          .stroke()
          .restore();

        doc.image(buf, x, curY, {
          fit: [photoW, photoH],
          align: 'center',
          valign: 'center',
        });

        col++;
        if (col >= 2) {
          col = 0;
          curY += photoH + 25;
          if (curY + photoH > PH - 80) {
            doc.addPage();
            drawPageFrame(doc, M, W, PW, PH, FOOTER_Y);
            curY = 60;
          }
        }
      } catch (_) { /* skip invalid photo */ }
    });
  }

  doc.end();
  return doc;
}

// ───────────────── Helpers ─────────────────

function buildArticles(configQuestions, tenantName) {
  return DEFAULT_ARTICLES.map((defaultArt) => {
    const override = configQuestions.find((q) => q.id === defaultArt.id);
    const text = (override?.variants?.[0]?.text || defaultArt.text)
      .replace(/\{prenom\}/gi, tenantName)
      .replace(/\n/g, ' ');
    return { title: defaultArt.title, text };
  });
}

/**
 * Draws border + header + footer on the current page (all non-flowing elements).
 */
function drawPageFrame(doc, margin, width, pageW, pageH, footerY) {
  // Double border
  const m = 20;
  doc.save()
    .lineWidth(2).strokeColor('#e91e63')
    .rect(m, m, pageW - 2 * m, pageH - 2 * m).stroke()
    .lineWidth(0.5).strokeColor('#ffb3c1')
    .rect(m + 4, m + 4, pageW - 2 * m - 8, pageH - 2 * m - 8).stroke()
    .restore();

  // Header
  doc.save()
    .fontSize(7.5).font('Helvetica').fillColor('#e91e63')
    .text('ADMINISTRATION DU CUPIDON \u2014 GUICHET N\u00B07', margin, 30, { align: 'center', width })
    .moveTo(margin + 100, 42).lineTo(margin + width - 100, 42)
    .lineWidth(0.3).strokeColor('#ffb3c1').stroke()
    .restore();

  // Footer (drawn immediately, absolute Y, no text flow issues)
  doc.save()
    .fontSize(6.5).font('Helvetica').fillColor('#ccc')
    .text(
      'Document officiel \u00E9mis par l\u2019Administration du Cupidon \u2014 Guichet N\u00B07 \u2014 Toute falsification sera punie de 100 bisous suppl\u00E9mentaires.',
      margin, footerY, { align: 'center', width, lineBreak: false }
    )
    .restore();
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
    .text(label, labelX, y + 4);
  doc.fontSize(9.5).font('Helvetica').fillColor('#2b2d42')
    .text(value, valueX, y + 4, { width: valueW });
}

function formatDate(timestamp) {
  try {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch (_) {
    return new Date().toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }
}

module.exports = { generateCertificate };
