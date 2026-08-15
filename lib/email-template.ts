import { SITE_URL, BRAND_NAME } from "./site";

const NAVY = "#1D2236";
const MINT = "#6FE7DB";

export function renderEmail({
  heading,
  bodyHtml,
  ctaLabel,
  ctaUrl,
}: {
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f5f4f0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;">
            <tr>
              <td style="background:${NAVY};padding:28px 24px;text-align:center;">
                <div style="color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">
                  ${BRAND_NAME}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 28px;">
                <h1 style="margin:0 0 18px;font-size:20px;font-weight:bold;color:${NAVY};">${heading}</h1>
                <div style="font-size:14px;line-height:1.7;color:#333333;">${bodyHtml}</div>
                ${
                  ctaUrl
                    ? `<div style="margin-top:26px;">
                        <a href="${ctaUrl}" style="display:inline-block;background:${MINT};color:${NAVY};text-decoration:none;padding:13px 30px;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">
                          ${ctaLabel ?? "Shop now"}
                        </a>
                      </div>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 26px;border-top:1px solid #eeeeee;text-align:center;">
                <p style="margin:0;font-size:11px;letter-spacing:1.5px;color:#999999;text-transform:uppercase;">${BRAND_NAME}</p>
                <p style="margin:8px 0 0;font-size:12px;color:#aaaaaa;">
                  <a href="${SITE_URL}" style="color:#aaaaaa;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
