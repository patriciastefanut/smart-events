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

const sendInvitationEmail = async (data) => {
  const invitationLink = `http://localhost:4200/events/${data.eventUUID}/invitations/${data.invitationUUID}`;
  const subject = `Invitation to "${data.eventTitle}"`;
  const html = `
  <p>Dear ${data.userFirstname},</p>

  <p>You are invited to <b>${data.eventTitle}</b>.</p>
  <p>Event will take place on ${data.eventFrom} at ${data.eventLocationName} in ${data.eventLocationAddress}.</p>

  <p>Please click the link below to confirm or decline the participation before ${data.respondBefore} :</p>

  <a href="${invitationLink}">${invitationLink}</a>

  <p>Kind regards,</p>
  <p>The organizers</p>
  `;

  await sendEmail(data.userEmail, subject, html);
};

const sendEventConfirmationMail = async (data) => {
  const link = `http://localhost:4200/events/${data.eventUUID}/invitations/${data.invitationUUID}`;
  const subject = `Invitation confirmation to "${data.eventTitle}"`;
  const html = `
  <p>Dear ${data.userFirstname},</p>

  <p>You have confirmed your participation to <b>${data.eventTitle}</b>.</p>

  <p>Please click the link below to cancel your participation before ${data.respondBefore} :</p>

  <a href="${link}">${link}</a>

  <p>Kind regards,</p>
  <p>The organizers</p>
  `;

  await sendEmail(data.userEmail, subject, html);
};

export default { sendEmail, sendInvitationEmail, sendEventConfirmationMail };
