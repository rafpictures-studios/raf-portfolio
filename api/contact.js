/*
 * POST /api/contact
 * Open commission form. Sends the message to your Gmail; "Reply" goes straight to the sender.
 * Body (JSON): { name, email, phone, message, website (honeypot), _t (form open time) }
 */
import {
  send, readBody, originAllowed, clientIp, rateLimited, looksLikeBot,
  clean, oneLine, isEmail, escapeHtml, jakartaTime, emailHtml, sendMail
} from './_lib/mail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method_not_allowed' });
  }
  if (!originAllowed(req)) return send(res, 403, { ok: false, error: 'forbidden' });

  let body;
  try {
    body = await readBody(req);
  } catch (err) {
    return send(res, err.status || 400, { ok: false, error: 'bad_request' });
  }

  // Bots get a fake success so they do not retry.
  if (looksLikeBot(body)) return send(res, 200, { ok: true });
  if (rateLimited('contact:' + clientIp(req), 5)) return send(res, 429, { ok: false, error: 'rate_limited' });

  const name = oneLine(body.name, 100);
  const email = oneLine(body.email, 254).toLowerCase();
  const phone = oneLine(body.phone, 20).replace(/[^0-9+]/g, '');
  const message = clean(body.message, 5000);

  if (!name || !isEmail(email) || !phone || message.length < 2) {
    return send(res, 422, { ok: false, error: 'invalid' });
  }

  const time = jakartaTime();
  const waNumber = phone.replace(/^\+/, '').replace(/^0/, '62');

  try {
    await sendMail({
      subject: `Commission inquiry from ${name}`,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      text:
        `New commission inquiry\n\n` +
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nTime: ${time}\n\n` +
        `Message:\n${message}\n`,
      html: emailHtml(
        `Commission inquiry from ${name}`,
        [
          ['Name', escapeHtml(name)],
          ['Email', `<a href="mailto:${escapeHtml(email)}" style="color:#141414">${escapeHtml(email)}</a>`],
          ['Phone', `<a href="https://wa.me/${escapeHtml(waNumber)}" style="color:#141414">${escapeHtml(phone)}</a> (WhatsApp)`],
          ['Time', escapeHtml(time)],
          ['Message', escapeHtml(message)]
        ],
        'Reply to this email to answer the sender directly.'
      )
    });
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error('[contact] send failed:', err.message);
    return send(res, 500, { ok: false, error: 'send_failed' });
  }
}
