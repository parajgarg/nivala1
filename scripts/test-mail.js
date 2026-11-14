'use strict';
// Check the Gmail setup and send one real email.
//   npm run test-mail -- you@example.com            latest invoice
//   npm run test-mail -- you@example.com --welcome  welcome email for a new account
//   npm run test-mail -- you@example.com --reset    forgot-password code email
const C = require('../lib/config');
const {get} = require('../lib/db');
const {sendInvoice, sendEmail, verifyMail, mailConfigured} = require('../lib/mailer');
const emails = require('../lib/emails');

(async () => {
  const to = (process.argv[2] || '').trim();
  if (!/^\S+@\S+\.\S{2,}$/.test(to)) { console.log('Usage: npm run test-mail -- you@example.com'); process.exit(1); }

  console.log(`From: ${C.SMTP_USER || '(SMTP_USER empty)'} via ${C.SMTP_HOST}:${C.SMTP_PORT}`);
  if (!mailConfigured) console.log('SMTP_USER / SMTP_PASS are empty, so this will only save an HTML preview.');
  else {
    const v = await verifyMail();
    if (!v.ok) { console.log('Login FAILED: ' + v.reason + (v.hint ? '\n' + v.hint : '')); process.exit(1); }
    console.log('Login OK.');
  }

  const kind = process.argv.includes('--welcome') ? 'welcome' : process.argv.includes('--reset') ? 'reset' : 'invoice';
  if (kind !== 'invoice') {
    const m = kind === 'welcome' ? emails.welcome('Test Guest') : emails.resetCode('Test Guest', '482915', 15);
    const r = await sendEmail({to, ...m, subject: m.subject + ' (test)', tag: kind + '-test', fromName: C.RESTAURANT_NAME});
    console.log(r.status === 'SENT' ? `Sent the ${kind} email to ${to}. Check the inbox (and Spam the first time).`
      : r.status === 'PREVIEW_ONLY' ? `Saved preview: ${r.info}` : `Send FAILED: ${r.error}`);
    process.exit(r.status === 'FAILED' ? 1 : 0);
  }
  const bill = get('SELECT * FROM bills ORDER BY created DESC LIMIT 1');
  if (!bill) { console.log('No invoices in the database yet. Place and pay one order first (or press "Reset demo" as staff).'); process.exit(1); }
  const r = await sendInvoice({to, subject: `Official Tax Invoice #${bill.bill_no} | ${C.RESTAURANT_NAME} (test)`, html: bill.html, billNo: bill.bill_no + '-test'});
  console.log(r.status === 'SENT' ? `Sent ${bill.bill_no} to ${to}. Check the inbox (and Spam the first time).`
    : r.status === 'PREVIEW_ONLY' ? `Saved preview: ${r.info}` : `Send FAILED: ${r.error}`);
  process.exit(r.status === 'FAILED' ? 1 : 0);
})();
