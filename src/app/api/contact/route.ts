import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, inquiryType, subject, message, honeypot } = body;

    // Spam check
    if (honeypot) {
      return NextResponse.json({ message: "Message sent!" }, { status: 200 });
    }

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "contact@example.com";

    await resend.emails.send({
      from: "Gidel Fiavor Website <noreply@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `[${inquiryType || "Contact"}] ${subject || "New message"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Type:</strong> ${inquiryType || "General"}</p>
        <p><strong>Subject:</strong> ${subject || "N/A"}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}
