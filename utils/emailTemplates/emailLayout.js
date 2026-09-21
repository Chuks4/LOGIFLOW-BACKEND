const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getClientUrl = () =>
  (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/+$/, "");

const getActionUrl = (path, token) =>
  token
    ? `${getClientUrl()}${path}?token=${encodeURIComponent(token)}`
    : `${getClientUrl()}${path}`;

const emailLayout = ({ preheader, eyebrow, title, content, action }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f7f8f5;color:#111512;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(preheader)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f8f5;padding:36px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e6df;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px;background:#111512;color:#f5f8f2;">
                <span style="display:inline-block;width:32px;height:32px;line-height:32px;border-radius:9px;background:#9be85b;color:#10150f;text-align:center;font-weight:800;font-size:18px;">L</span>
                <span style="margin-left:8px;vertical-align:8px;font-size:19px;font-weight:700;">LogiFlow</span>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 32px;">
                <p style="margin:0 0 14px;color:#3c8625;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${escapeHtml(eyebrow)}</p>
                <h1 style="margin:0;color:#111512;font-size:32px;line-height:1.1;letter-spacing:-1px;">${escapeHtml(title)}</h1>
                <div style="margin-top:20px;color:#5f695c;font-size:16px;line-height:1.65;">${content}</div>
                ${
                  action
                    ? `
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:28px;">
                  <tr>
                    <td style="border-radius:7px;background:#9be85b;">
                      <a href="${escapeHtml(action.url)}" style="display:inline-block;padding:14px 22px;color:#0d140b;text-decoration:none;font-size:14px;font-weight:700;">${escapeHtml(action.label)}</a>
                    </td>
                  </tr>
                </table>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #e2e6df;color:#8a9386;font-size:12px;line-height:1.5;">
                This is an automated message from LogiFlow. If you did not request this email, you can safely ignore it.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

module.exports = { escapeHtml, getActionUrl, emailLayout };
