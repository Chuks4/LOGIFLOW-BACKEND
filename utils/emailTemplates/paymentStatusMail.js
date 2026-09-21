const { emailLayout, getActionUrl, escapeHtml } = require("./emailLayout");

const paymentStatusMail = (data) => {
  const { amount, date, reference, status, shipmentId, currency } = data;
  const parsedAmount = amount / 100;
  return emailLayout({
    preheader: "Payment Update",
    eyebrow: status ? "We received your payment" : "Payment failed",
    title: "Payment Status",
    content: status
      ? `
        <p> Thank you for your payment of <strong>${currency} ${Number(escapeHtml(parsedAmount)).toLocaleString()}</strong> on <strong>${new Date(escapeHtml(date)).toDateString()}</strong> with reference <strong>${escapeHtml(reference)}</strong>. </p>
        <p> Your order is being processed and will be shipped out soon. </p>
    `
      : `
        <p> We're sorry, but your payment of <strong>${currency} ${Number(escapeHtml(parsedAmount)).toLocaleString()}</strong> on <strong>${new Date(escapeHtml(date)).toDateString()}}</strong> with reference <strong>${escapeHtml(reference)}</strong> failed. </p>
        <p> Please try again or contact support for further assistance. </p>
      `,
    action: {
      label: "Track your order",
      url: getActionUrl(`/dashboard/shipments`),
    },
  });
};

module.exports = {
  paymentStatusMail,
};
