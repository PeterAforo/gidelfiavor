import nodemailer from 'nodemailer';

// Create transporter based on environment
const createTransporter = () => {
  // Use environment variables for SMTP configuration
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Fallback to ethereal for testing (creates test account)
  console.warn('SMTP not configured. Email sending disabled.');
  return null;
};

let transporter = null;

// Initialize transporter
export const initEmailService = async () => {
  transporter = createTransporter();
  
  if (transporter) {
    try {
      await transporter.verify();
      console.log('Email service ready');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error.message);
      transporter = null;
      return false;
    }
  }
  return false;
};

// Send contact form email
export const sendContactEmail = async ({ name, email, subject, message }) => {
  if (!transporter) {
    console.warn('Email service not configured. Contact form submission logged only.');
    return { success: false, error: 'Email service not configured' };
  }
  
  const contactEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  
  try {
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: contactEmail,
      subject: subject || `Contact Form: Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 10px; background: #f8f9fa;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Email:</td>
              <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">Subject:</td>
              <td style="padding: 10px; background: #f8f9fa;">${subject}</td>
            </tr>
            ` : ''}
          </table>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This email was sent from the contact form on gidelfiavor.com
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${subject ? `Subject: ${subject}` : ''}

Message:
${message}

---
Sent from gidelfiavor.com contact form
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return { success: false, error: error.message };
  }
};

// Send auto-reply to contact form submitter
export const sendContactAutoReply = async ({ name, email }) => {
  if (!transporter) return { success: false, error: 'Email service not configured' };
  
  const siteName = process.env.SITE_NAME || 'Gidel Fiavor';
  
  try {
    const mailOptions = {
      from: `"${siteName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Thank you for contacting ${siteName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Your Message</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for reaching out. I have received your message and will get back to you as soon as possible.</p>
          
          <p>In the meantime, feel free to explore my books and articles on the website.</p>
          
          <p>Best regards,<br>
          <strong>Gidel Kwasi Fiavor</strong></p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send auto-reply:', error);
    return { success: false, error: error.message };
  }
};

// Send newsletter welcome email
export const sendNewsletterWelcome = async ({ email, name }) => {
  if (!transporter) return { success: false, error: 'Email service not configured' };
  
  const siteName = process.env.SITE_NAME || 'Gidel Fiavor';
  
  try {
    const mailOptions = {
      from: `"${siteName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Welcome to ${siteName}'s Newsletter!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to the Newsletter!</h2>
          
          <p>Dear ${name || 'Friend'},</p>
          
          <p>Thank you for subscribing to my newsletter. You'll receive updates about:</p>
          
          <ul>
            <li>New book releases and announcements</li>
            <li>Latest articles and insights</li>
            <li>Upcoming events and speaking engagements</li>
            <li>Exclusive content for subscribers</li>
          </ul>
          
          <p>Best regards,<br>
          <strong>Gidel Kwasi Fiavor</strong></p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #666; font-size: 12px;">
            You can unsubscribe at any time by clicking the unsubscribe link in any email.
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send newsletter welcome:', error);
    return { success: false, error: error.message };
  }
};

export default { 
  initEmailService, 
  sendContactEmail, 
  sendContactAutoReply,
  sendNewsletterWelcome 
};
