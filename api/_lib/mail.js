/*
 * Shared helpers for the form endpoints.
 * Files in api/_lib are not exposed as routes on Vercel (underscore prefix).
 *
 * Environment variables (set in Vercel, never in the repo):
 *   GMAIL_USER          Gmail address that sends the mail
 *   GMAIL_APP_PASSWORD  Google App Password for that account
 *   MAIL_TO             optional, where notifications go (defaults to GMAIL_USER)
 *   ALLOWED_ORIGIN      optional, e.g. https://raf-bio.vercel.app
 *   MAIL_DRY_RUN        optional, "1" = do not send, only log (for local tests)
 */
import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (process.env.MAIL_DRY_RUN === '1') {
    transporter = nodemailer.createTransport({ jsonTransport: true });
    return transporter;
  }
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
  if (!user || !pass) throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is not set');
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass }
  });
  return transporter;
}

export async function sendMail({ subject, text, html, replyTo }) {
  const from = process.env.GMAIL_USER || 'dry-run@localhost';
  const to = process.env.MAIL_TO || from;
  const info = await getTransporter().sendMail({
    from: `"RAF Pictures bio link" <${from}>`,
    to,
    subject,
    text,
    html,
    replyTo
  });
  if (process.env.MAIL_DRY_RUN === '1') console.log('[dry-run]', info.message);
  return info;
}

/* ---------- Request helpers ---------- */

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return safeJson(req.body);
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 20_000) throw Object.assign(new Error('Body too large'), { status: 413 });
    chunks.push(chunk);
  }
  return safeJson(Buffer.concat(chunks).toString('utf8'));
}

function safeJson(str) {
  try {
    const v = JSON.parse(str || '{}');
    return v && typeof v === 'object' ? v : {};
  } catch (_) {
    return {};
  }
}

export function originAllowed(req) {
  const allowed = process.env.ALLOWED_ORIGIN;
  if (!allowed) return true;
  const origin = req.headers.origin || '';
  return allowed.split(',').map((s) => s.trim()).includes(origin);
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

/* ---------- Spam protection ---------- */

// Best-effort rate limit: per server instance, resets when Vercel recycles it.
const hits = new Map();
export function rateLimited(key, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

// Honeypot field must stay empty; the form must be open for at least 2 seconds.
export function looksLikeBot(body) {
  if (body.website) return true;
  const t = Number(body._t);
  if (!t || Date.now() - t < 2000) return true;
  return false;
}

/* ---------- Validation and formatting ---------- */

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

export function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

export function oneLine(value, max) {
  return clean(value, max).replace(/[\r\n]+/g, ' ');
}

export function isEmail(value) {
  return value.length <= 254 && EMAIL_RE.test(value);
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function jakartaTime() {
  return new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'full', timeStyle: 'short' });
}

/* Minimal monochrome email layout */
export function emailHtml(title, rows, note) {
  const body = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-top:1px solid #e4e4e3;color:#6b6b6b;font-size:13px;width:110px;vertical-align:top">${escapeHtml(label)}</td>
        <td style="padding:10px 0;border-top:1px solid #e4e4e3;color:#141414;font-size:14px;white-space:pre-wrap">${value}</td>
      </tr>`
    )
    .join('');
  return `<!doctype html><html><body style="margin:0;background:#f2f2f1;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:24px auto;background:#fcfcfb;border:1px solid #e4e4e3;border-radius:12px;padding:24px">
    <p style="margin:0 0 4px;color:#6b6b6b;font-size:13px">RAF Pictures bio link</p>
    <h1 style="margin:0 0 16px;color:#141414;font-size:20px;letter-spacing:-0.01em">${escapeHtml(title)}</h1>
    <table style="width:100%;border-collapse:collapse">${body}</table>
    ${note ? `<p style="margin:16px 0 0;color:#8f8f8f;font-size:12px">${escapeHtml(note)}</p>` : ''}
  </div></body></html>`;
}
