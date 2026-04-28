import PDFDocument from 'pdfkit';
import { IPayrollComponent } from '@/models/PayrollConfig';
import path from 'path';

export interface PayslipPDFData {
  companyName: string;
  companyAddress?: string;
  logoUrl?: string;
  month: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  gross: number;
  daysWorked: number;
  daysInMonth: number;
  components: Record<string, number>;
  earningsTotal: number;
  deductionsTotal: number;
  netPay: number;
  componentDefs: IPayrollComponent[];
}

// ─── Constants ────────────────────────────────────────────
const L = 36;          // left margin
const W = 523;         // content width (A4 595 - 72)
const MID = L + 261;   // column split x
const LW = 261;        // left panel width
const RW = 262;        // right panel width

const EXCLUDE_KEYS = new Set([
  'actual_salary_uncalculated', 'net_pay', 'earnings_total', 'deductions_total', 'gross', 'pf_eligible', 'esic_eligible',
]);
const DEDUCTION_KEYS = new Set([
  'pf', 'pf_employee', 'esic', 'professional_tax', 'tax', 'tds', 'loan', 'advance_salary',
]);

// ─── Number to Words (Indian System) ─────────────────────
const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function wordsBelow1000(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
  return ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + wordsBelow1000(n % 100) : '');
}

function numberToWordsINR(amount: number): string {
  const rounded = Math.round(amount * 100);
  const rupees  = Math.floor(rounded / 100);
  const paisa   = rounded % 100;
  if (rupees === 0 && paisa === 0) return 'Zero Rupees Only';

  const crore    = Math.floor(rupees / 10_000_000);
  const lakh     = Math.floor((rupees % 10_000_000) / 100_000);
  const thousand = Math.floor((rupees % 100_000) / 1_000);
  const rem      = rupees % 1_000;

  const parts: string[] = [];
  if (crore > 0)    parts.push(wordsBelow1000(crore)    + ' Crore');
  if (lakh > 0)     parts.push(wordsBelow1000(lakh)     + ' Lakh');
  if (thousand > 0) parts.push(wordsBelow1000(thousand) + ' Thousand');
  if (rem > 0)      parts.push(wordsBelow1000(rem));

  let result = 'Rupees ' + parts.join(' ');
  if (paisa > 0) result += ' And ' + wordsBelow1000(paisa) + ' Paisa';
  return result + ' Only';
}

function fmtINR(n: number): string {
  return n.toFixed(2);
}

function fmtMonth(m: string): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const [year, mo] = m.split('-');
  return `${months[Number(mo) - 1]} ${year}`;
}

// ─── Fetch remote image into buffer ──────────────────────
async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

// ─── Build component defs (corrects wrong types) ──────────
function buildEffectiveDefs(componentDefs: IPayrollComponent[], components: Record<string, number>): IPayrollComponent[] {
  const definedKeys = new Set(componentDefs.map(c => c.key));

  // Correct any mis-typed existing defs (e.g. fallback may mark loan as 'earning')
  const correctedDefs = componentDefs.map(def => {
    if (DEDUCTION_KEYS.has(def.key.toLowerCase()) && def.type !== 'deduction') {
      return { ...def, type: 'deduction' as const };
    }
    return def;
  });

  // Add dynamic keys not in config
  const extras: IPayrollComponent[] = [];
  for (const [key, val] of Object.entries(components)) {
    if (definedKeys.has(key) || EXCLUDE_KEYS.has(key) || val === 0) continue;
    const isDeduction = DEDUCTION_KEYS.has(key.toLowerCase()) || key.toLowerCase().includes('deduction');
    extras.push({
      key,
      label: key.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      type: isDeduction ? 'deduction' : 'earning',
      formula: '',
      order: 99,
    });
  }

  return [...correctedDefs, ...extras];
}

// ─── Low-level drawing helpers ────────────────────────────
function hLine(doc: any, x: number, y: number, w: number, color = '#aaa') {
  doc.moveTo(x, y).lineTo(x + w, y).strokeColor(color).lineWidth(0.5).stroke();
}
function vLine(doc: any, x: number, y1: number, y2: number, color = '#aaa') {
  doc.moveTo(x, y1).lineTo(x, y2).strokeColor(color).lineWidth(0.5).stroke();
}
function outerRect(doc: any, x: number, y: number, w: number, h: number, color = '#aaa') {
  doc.rect(x, y, w, h).strokeColor(color).lineWidth(0.5).stroke();
}
function fillRect(doc: any, x: number, y: number, w: number, h: number, color: string) {
  doc.rect(x, y, w, h).fill(color);
}

function cell(
  doc: any,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { bold?: boolean; size?: number; align?: string; color?: string; pad?: number } = {}
) {
  const { bold = false, size = 8.5, align = 'left', color = '#000', pad = 5 } = opts;
  doc
    .font(bold ? 'Main-Bold' : 'Main')
    .fontSize(size)
    .fillColor(color)
    .text(String(text ?? ''), x + pad, y + Math.max(1, (h - size - 1) / 2), {
      width: w - pad * 2,
      align,
      lineBreak: false,
      ellipsis: true,
    });
}

// ─── Main draw function ───────────────────────────────────
async function drawPayslip(doc: any, data: PayslipPDFData, logoBuffer: Buffer | null) {
  const effectiveDefs = buildEffectiveDefs(data.componentDefs, data.components);
  const earnings   = effectiveDefs.filter(c => c.type === 'earning'   && !EXCLUDE_KEYS.has(c.key));
  const deductions = effectiveDefs.filter(c => c.type === 'deduction' && !EXCLUDE_KEYS.has(c.key));

  let y = 36;

  // ── HEADER ──────────────────────────────────────────────
  const LOGO_SIZE = 60;

  // Outer border for whole page (drawn later once we know total height)
  // Company info block (centered)
  if (logoBuffer) {
    try {
      doc.image(logoBuffer, L, y + 4, { fit: [LOGO_SIZE, LOGO_SIZE], align: 'left' });
    } catch {
      // logo failed silently
    }
  }

  const textX   = logoBuffer ? L + LOGO_SIZE + 10 : L;
  const textW   = logoBuffer ? W - LOGO_SIZE - 10  : W;
  const nameY   = y + 8;

  doc.font('Main-Bold').fontSize(15).fillColor('#000')
     .text(data.companyName.toUpperCase(), textX, nameY, { width: textW, align: 'center' });

  if (data.companyAddress) {
    doc.font('Main').fontSize(8.5).fillColor('#444')
       .text(data.companyAddress, textX, nameY + 18, { width: textW, align: 'center' });
  }

  const titleY = nameY + (data.companyAddress ? 36 : 20);
  doc.font('Main-Bold').fontSize(11).fillColor('#000')
     .text(`Payslip for the month of ${fmtMonth(data.month)}`, L, titleY, { width: W, align: 'center' });

  y = Math.max(y + LOGO_SIZE + 8, titleY + 18);

  // ── EMPLOYEE INFO TABLE ──────────────────────────────────
  const ROW_H  = 20;
  const lop    = Math.max(0, data.daysInMonth - data.daysWorked);

  const infoRows: [string, string, string, string][] = [
    ['Name',            data.employeeName || '-',           'Employee No',    data.employeeId || '-'],
    ['Designation',     data.designation  || '-',           'Department',     data.department || '-'],
    ['Working Days',    String(data.daysWorked),             'Days In Month',  String(data.daysInMonth)],
    ['LOP',             String(lop),                         '',               ''],
  ];

  const tableTop = y + 6;
  const tableH   = infoRows.length * ROW_H;

  // Draw outer border
  outerRect(doc, L, tableTop, W, tableH);
  // Vertical divider
  vLine(doc, MID, tableTop, tableTop + tableH);

  infoRows.forEach(([l1, v1, l2, v2], i) => {
    const ry = tableTop + i * ROW_H;
    if (i > 0) hLine(doc, L, ry, W);

    // Left label
    cell(doc, l1, L,       ry, 110, ROW_H, { bold: true, size: 8.5 });
    cell(doc, ':',  L + 110, ry, 10,  ROW_H, { size: 8.5 });
    cell(doc, v1,  L + 118, ry, LW - 118, ROW_H, { size: 8.5 });

    // Right label
    if (l2) {
      cell(doc, l2, MID,       ry, 110, ROW_H, { bold: true, size: 8.5 });
      cell(doc, ':',  MID + 110, ry, 10,  ROW_H, { size: 8.5 });
      cell(doc, v2,  MID + 118, ry, RW - 118, ROW_H, { size: 8.5 });
    }
  });

  y = tableTop + tableH + 10;

  // ── EARNINGS / DEDUCTIONS TABLE ──────────────────────────
  const HDR_H  = 22;
  const DAT_H  = 18;
  const TOT_H  = 20;

  // Column widths inside each panel
  const EARN_LBL_W = 170;
  const EARN_AMT_W = LW - EARN_LBL_W;
  const DED_LBL_W  = 170;
  const DED_AMT_W  = RW - DED_LBL_W;

  const maxRows = Math.max(earnings.length, deductions.length, 1);
  const edTableH = HDR_H + maxRows * DAT_H + TOT_H;

  // Header row background
  fillRect(doc, L, y, W, HDR_H, '#f0f0f0');
  outerRect(doc, L, y, W, edTableH);
  vLine(doc, MID, y, y + edTableH);
  // Vertical dividers inside panels
  vLine(doc, L + EARN_LBL_W, y, y + edTableH);
  vLine(doc, MID + DED_LBL_W, y, y + edTableH);

  // Header text
  cell(doc, 'Earnings',   L,                y, EARN_LBL_W, HDR_H, { bold: true, size: 9 });
  cell(doc, 'Amount',     L + EARN_LBL_W,   y, EARN_AMT_W, HDR_H, { bold: true, size: 9, align: 'right' });
  cell(doc, 'Deductions', MID,              y, DED_LBL_W,  HDR_H, { bold: true, size: 9 });
  cell(doc, 'Amount',     MID + DED_LBL_W, y, DED_AMT_W,  HDR_H, { bold: true, size: 9, align: 'right' });
  hLine(doc, L, y + HDR_H, W, '#aaa');

  // Data rows
  for (let i = 0; i < maxRows; i++) {
    const ry = y + HDR_H + i * DAT_H;
    if (i > 0) hLine(doc, L, ry, W, '#ddd');

    const earn = earnings[i];
    if (earn) {
      const val = data.components[earn.key] ?? 0;
      cell(doc, earn.label.toUpperCase(), L, ry, EARN_LBL_W, DAT_H, { size: 8.5 });
      cell(doc, fmtINR(val), L + EARN_LBL_W, ry, EARN_AMT_W, DAT_H, { size: 8.5, align: 'right' });
    }

    const ded = deductions[i];
    if (ded) {
      const val = data.components[ded.key] ?? 0;
      cell(doc, ded.label.toUpperCase(), MID, ry, DED_LBL_W, DAT_H, { size: 8.5 });
      cell(doc, fmtINR(val), MID + DED_LBL_W, ry, DED_AMT_W, DAT_H, { size: 8.5, align: 'right' });
    }
  }

  // Totals row
  const totY = y + HDR_H + maxRows * DAT_H;
  fillRect(doc, L, totY, W, TOT_H, '#f7f7f7');
  hLine(doc, L, totY, W, '#aaa');

  cell(doc, 'Total Earnings:INR.',   L,              totY, EARN_LBL_W, TOT_H, { bold: true, size: 8.5 });
  cell(doc, fmtINR(data.earningsTotal), L + EARN_LBL_W, totY, EARN_AMT_W, TOT_H, { bold: true, size: 8.5, align: 'right' });
  cell(doc, 'Total Deductions:INR.', MID,            totY, DED_LBL_W,  TOT_H, { bold: true, size: 8.5 });
  cell(doc, fmtINR(data.deductionsTotal), MID + DED_LBL_W, totY, DED_AMT_W, TOT_H, { bold: true, size: 8.5, align: 'right' });

  y = totY + TOT_H + 14;

  // ── NET PAY ──────────────────────────────────────────────
  doc.font('Main').fontSize(9.5).fillColor('#000')
     .text('Net Pay for the month :', L, y, { continued: true })
     .font('Main-Bold').fontSize(10)
     .text(`   ${fmtINR(data.netPay)}`, { lineBreak: false });

  y += 18;

  // ── AMOUNT IN WORDS ──────────────────────────────────────
  const words = numberToWordsINR(data.netPay);
  doc.font('Main').fontSize(8.5).fillColor('#222')
     .text(`(${words})`, L, y, { width: W, align: 'left' });

  y += 22;

  // ── FOOTER ───────────────────────────────────────────────
  hLine(doc, L, y, W, '#ccc');
  y += 6;
  doc.font('Main').fontSize(7.5).fillColor('#888')
     .text('This is a system generated payslip and does not require signature.', L, y, { width: W, align: 'center' });
}

// ─── Public API ───────────────────────────────────────────
export async function generatePayslipPDF(data: PayslipPDFData): Promise<Buffer> {
  const logoBuffer = data.logoUrl ? await fetchImageBuffer(data.logoUrl) : null;

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true, autoFirstPage: false });
      const fontDir = path.resolve(process.cwd(), 'public', 'fonts');
      doc.registerFont('Main',      path.join(fontDir, 'arial.ttf'));
      doc.registerFont('Main-Bold', path.join(fontDir, 'arialbd.ttf'));

      doc.addPage();
      drawPayslip(doc, data, logoBuffer);

      const buffers: Buffer[] = [];
      doc.on('data',  (c: Buffer) => buffers.push(c));
      doc.on('end',   () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export async function generateMultiPayslipPDF(items: PayslipPDFData[]): Promise<Buffer> {
  // Pre-fetch all logos in parallel
  const logoMap = new Map<string, Buffer | null>();
  await Promise.all(
    items
      .filter(d => d.logoUrl)
      .map(async d => {
        if (d.logoUrl && !logoMap.has(d.logoUrl)) {
          logoMap.set(d.logoUrl, await fetchImageBuffer(d.logoUrl));
        }
      })
  );

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true, autoFirstPage: false });
      const fontDir = path.resolve(process.cwd(), 'public', 'fonts');
      doc.registerFont('Main',      path.join(fontDir, 'arial.ttf'));
      doc.registerFont('Main-Bold', path.join(fontDir, 'arialbd.ttf'));

      for (const item of items) {
        doc.addPage();
        const logo = item.logoUrl ? (logoMap.get(item.logoUrl) ?? null) : null;
        drawPayslip(doc, item, logo);
      }

      const buffers: Buffer[] = [];
      doc.on('data',  (c: Buffer) => buffers.push(c));
      doc.on('end',   () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
