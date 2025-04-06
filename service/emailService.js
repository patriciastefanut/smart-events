import nodemailer from "nodemailer";

/**
 * Send an HTML email asynchronously
 *
 * @param {String} to - The recipient's email address
 * @param {String} subject - The subject of the email
 * @param {String} htmlContent - The HTML content of the email
 * @param {String} [textContent] - Optional plain text version of the email content
 * @returns {Promise} - A promise that resolves when the email is sent
 */
const sendEmail = async (to, subject, htmlContent, textContent = "") => {
  const email = process.env.EMAIL_USER;
  const password = process.env.EMAIL_PASS;

  console.log(email);

  const mailOptions = {
    from: email,
    to: to,
    subject: subject,
    html: htmlContent,
    text: textContent,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
