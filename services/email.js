const nodemailer = require("nodemailer");

class EmailServices {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /**
   * Sends email using nodemailer
   * @param {Object} data
   * @param {String} data.to
   * @param {String} data.subject
   * @param {String} data.html
   * @param {String} data.from
   * @returns {Promise<Object>} { status: Boolean, result: Object}
   */
  async sendEmail(data) {
    try {
      const options = {
        from: data.from || process.env.SMTP_USERNAME,
        to: data.to,
        subject: data.subject,
        html: data.html,
      };
      const result = await this.transporter.sendMail(data);
      console.log("Email sent successfully", result.messageId);
      return { status: true, result };
    } catch (error) {
      const error = new Error("Email could not be sent");
      error.statusCode = 500;
      throw error;
    }
  }
}

const emailService = new EmailServices();

module.exports = emailService;