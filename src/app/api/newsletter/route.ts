import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (audienceId) {
      await resend.contacts.create({
        audienceId,
        email,
        firstName: firstName || undefined,
      });
    }

    // Send welcome email
    await resend.emails.send({
      from: "Gidel Fiavor <noreply@resend.dev>",
      to: email,
      subject: "Welcome to my newsletter!",
      html: `
        <h2>Welcome${firstName ? `, ${firstName}` : ""}!</h2>
        <p>Thank you for subscribing to my newsletter.</p>
        <p>You'll receive updates about new books, events, and exclusive content.</p>
        <p>Best,<br />Gidel Fiavor</p>
      `,
    });

    return NextResponse.json({ message: "Welcome! Check your inbox." }, { status: 200 });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ message: "Failed to subscribe" }, { status: 500 });
  }
}
