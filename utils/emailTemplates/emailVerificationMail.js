const emailVerificationMail = (token) => {
  const { emailLayout, getActionUrl } = require("./emailLayout");

  return emailLayout({
    preheader: "Verify your email address.",
    eyebrow: "Verify your account",
    title: "Confirm your email address.",
    content: `
      <p style="margin:0 0 16px;">Thanks for creating a LogiFlow account. Confirm your email address to activate your account and access the platform.</p>
      <p style="margin:0;">This verification link expires in 24 hours.</p>
    `,
    action: {
      label: "Verify email address",
      url: getActionUrl("/verify-email", token),
    },
  });
};

module.exports = emailVerificationMail;
