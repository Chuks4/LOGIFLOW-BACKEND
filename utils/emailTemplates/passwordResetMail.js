const passwordResetMail = (token) => {
  const { emailLayout, getActionUrl } = require("./emailLayout");

  return emailLayout({
    preheader: "Reset your password.",
    eyebrow: "Account security",
    title: "Create a new password.",
    content: `
      <p style="margin:0 0 16px;">We received a request to reset your LogiFlow password. Use the button below to choose a new one.</p>
      <p style="margin:0;">This password reset link expires in 15 minutes.</p>
    `,
    action: {
      label: "Reset password",
      url: getActionUrl("/reset-password", token),
    },
  });
};

module.exports = passwordResetMail;
