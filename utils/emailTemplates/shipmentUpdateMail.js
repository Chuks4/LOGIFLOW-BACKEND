const { emailLayout, escapeHtml, getActionUrl } = require("./emailLayout");

const shipmentUpdateMail = ({
  trackingNumber,
  status,
  event,
  notes,
  updatedAt,
  driverName,
  driverContact,
}) =>
  emailLayout({
    preheader: `Shipment ${trackingNumber} status update.`,
    eyebrow: "Shipment update",
    title: `Shipment ${trackingNumber} is ${status}.`,
    content: `
      <p style="margin:0 0 16px;">Your shipment status has been updated to <strong>${escapeHtml(status)}</strong>.</p>
      ${
        event
          ? `<p style="margin:0 0 16px;"><strong>Update:</strong> ${escapeHtml(event)}</p>`
          : ""
      }
      ${notes ? `<p style="margin:0 0 16px;">${escapeHtml(notes)}</p>` : ""}
      ${
        updatedAt
          ? `<p style="margin:0;color:#899287;font-size:13px;">Updated on ${new Date(escapeHtml(updatedAt)).toLocaleDateString()}.</p>`
          : ""
      }
      ${
        driverName
          ? `<p style="margin:0;color:#899287;font-size:13px;">Driver: ${escapeHtml(driverName)}</p>`
          : ""
      }
      ${
        driverContact
          ? `<p style="margin:0;color:#899287;font-size:13px;">Driver contact: ${escapeHtml(driverContact)}</p>`
          : ""
      }
    `,
    action: {
      label: "View shipment",
      url: getActionUrl("/dashboard/shipments"),
    },
  });

module.exports = shipmentUpdateMail;
