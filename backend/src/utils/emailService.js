const https = require('https');

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL =
  process.env.BREVO_SENDER_EMAIL || 'noreply@serviq.thiruppugazhs.in';
const BREVO_SENDER_NAME =
  process.env.BREVO_SENDER_NAME || 'SERVIQ Fleet';

/**
 * Send transactional email via Brevo REST API v3
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} [options.name] - Recipient name
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlContent - HTML email body
 */
const sendEmail = ({ to, name, subject, htmlContent }) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: to.toLowerCase().trim(),
          name: name || to.split('@')[0],
        },
      ],
      subject,
      htmlContent,
    });

    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        Accept: 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(body);
            resolve({ success: true, messageId: parsed.messageId });
          } catch (e) {
            resolve({ success: true, body });
          }
        } else {
          console.error(`[BREVO ERROR] Status ${res.statusCode}:`, body);
          reject(new Error(`Brevo API Error (${res.statusCode}): ${body}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('[BREVO NETWORK ERROR]:', err);
      reject(err);
    });

    req.setTimeout(12000, () => {
      req.destroy(new Error('Brevo API request timeout'));
    });

    req.write(postData);
    req.end();
  });
};

/**
 * Send Account Creation OTP Email
 */
const sendRegistrationOtpEmail = async (email, otp, recipientName = 'Fleet Administrator') => {
  const subject = `SERVIQ — Your Verification Code: ${otp}`;
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1120; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #111c33; border: 1px solid #1e293b; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 45px rgba(0,0,0,0.5);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 22px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-transform: uppercase;">SERVIQ</div>
                    <div style="font-size: 11px; font-weight: 500; color: #d1fae5; letter-spacing: 0.5px; margin-top: 2px;">ENTERPRISE FLEET COMMAND CENTER</div>
                  </td>
                  <td align="right">
                    <span style="background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25); color: #ffffff; font-size: 11px; padding: 4px 10px; border-radius: 9999px; font-weight: 600;">Account Setup</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #ffffff;">Verify Your Email Address</h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Hello <strong style="color: #f1f5f9;">${recipientName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Thank you for creating an account on <strong>SERVIQ</strong>. Use the 6-digit verification code below to confirm your identity and complete your organization setup:
              </p>

              <!-- OTP Code Display -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: #0b1329; border: 2px solid #10b981; border-radius: 14px; padding: 18px 36px; letter-spacing: 10px; font-size: 32px; font-weight: 800; color: #34d399; font-family: 'Courier New', Courier, monospace; text-indent: 10px; box-shadow: 0 0 25px rgba(16, 185, 129, 0.15);">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-left: 4px solid #10b981; border-radius: 8px; margin: 24px 0 16px 0;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 12px; font-weight: 600; color: #10b981; margin-bottom: 2px;">EXPIRATION NOTICE</div>
                    <div style="font-size: 12px; color: #94a3b8; line-height: 1.5;">This verification code is strictly valid for the next <strong>10 minutes</strong>. Do not share this code with anyone.</div>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                If you did not initiate this registration on SERVIQ, you can safely disregard this message.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0c1427; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                © ${new Date().getFullYear()} SERVIQ Fleet Command. Built for enterprise transport and telemetry operations.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    name: recipientName,
    subject,
    htmlContent,
  });
};

/**
 * Send Account Deletion Confirmation OTP Email
 */
const sendDeletionOtpEmail = async (email, otp, recipientName = 'Administrator') => {
  const subject = `CRITICAL: SERVIQ Account Deletion Verification Code: ${otp}`;
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1120; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #111c33; border: 1px solid #331d24; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 45px rgba(0,0,0,0.6);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 22px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-transform: uppercase;">SERVIQ</div>
                    <div style="font-size: 11px; font-weight: 500; color: #fecaca; letter-spacing: 0.5px; margin-top: 2px;">SECURITY & COMPLIANCE WARNING</div>
                  </td>
                  <td align="right">
                    <span style="background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.2); color: #fee2e2; font-size: 11px; padding: 4px 10px; border-radius: 9999px; font-weight: 700;">Account Deletion</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #f87171;">Account Deletion Request</h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Hello <strong style="color: #ffffff;">${recipientName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #e2e8f0;">
                We received a request to permanently delete your <strong>SERVIQ</strong> account and all associated fleet data, vehicles, driver records, and maintenance logs.
              </p>

              <!-- Warning Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #271418; border-left: 4px solid #ef4444; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <div style="font-size: 12px; font-weight: 700; color: #f87171; margin-bottom: 2px;">IRREVERSIBLE ACTION</div>
                    <div style="font-size: 12px; color: #fca5a5; line-height: 1.5;">Confirming this operation will permanently purge all telemetry, organization data, vehicle entries, and user profiles. This cannot be undone.</div>
                  </td>
                </tr>
              </table>

              <!-- OTP Code Display -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background: #1a0f12; border: 2px solid #ef4444; border-radius: 14px; padding: 18px 36px; letter-spacing: 10px; font-size: 32px; font-weight: 800; color: #f87171; font-family: 'Courier New', Courier, monospace; text-indent: 10px; box-shadow: 0 0 25px rgba(239, 68, 68, 0.2);">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 12px; color: #94a3b8; text-align: center;">
                This authorization code expires in <strong>10 minutes</strong>.
              </p>

              <p style="margin: 24px 0 0 0; font-size: 12px; color: #ef4444; line-height: 1.5; background: rgba(239, 68, 68, 0.1); padding: 12px 16px; border-radius: 8px;">
                <strong>Did not request this?</strong> If you did not initiate this request, someone may be attempting to access your account. Please log in immediately and change your password.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0c1427; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                © ${new Date().getFullYear()} SERVIQ Fleet Command. Security Notification.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    name: recipientName,
    subject,
    htmlContent,
  });
};

module.exports = {
  sendEmail,
  sendRegistrationOtpEmail,
  sendDeletionOtpEmail,
};
