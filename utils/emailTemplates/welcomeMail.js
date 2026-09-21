const welcomeMail = (name) => {
  const { emailLayout, getActionUrl } = require("./emailLayout");

  return emailLayout({
    preheader: "Your account is ready.",
    eyebrow: "Welcome aboard",
    title: `You are all set${name ? `, ${name}` : "dear"}.`,
    content: `
      <p style="margin:0 0 16px;">Your email has been verified and your LogiFlow account is now active.</p>
      <p style="margin:0;">Sign in to manage shipments, coordinate deliveries, and keep your operation moving.</p>
    `,
    action: {
      label: "Continue",
      url: getActionUrl("/"),
    },
  });
};


module.exports = welcomeMail;