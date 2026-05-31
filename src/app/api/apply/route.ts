import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const APPLICATION_RECIPIENT_EMAIL =
  process.env.APPLICATION_RECIPIENT_EMAIL || "aditi@midstateglobalservices.com";

const isPlaceholderValue = (value: string | undefined) =>
  !value || value.includes("your-") || value.includes("example.com");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;
    const preferredLocation = formData.get("preferredLocation") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const resume = formData.get("resume") as File;
    const allowedLocations = [
      "Gurugram",
      "Noida",
      "Pune",
      "Banglore",
      "Hyderabad",
      "Delhi",
      "Kolkata",
    ];

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !preferredLocation || !jobTitle || !resume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!allowedLocations.includes(preferredLocation)) {
      return NextResponse.json(
        { error: "Invalid preferred location" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedMimeTypes.includes(resume.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, DOC, and DOCX are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (resume.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());

    if (
      isPlaceholderValue(process.env.SMTP_HOST) ||
      isPlaceholderValue(process.env.SMTP_USER) ||
      isPlaceholderValue(process.env.SMTP_PASSWORD)
    ) {
      console.error("Application submission error: SMTP settings are missing or still use placeholder values.");
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 500 }
      );
    }

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    // Send email to recruitment team
    await transporter.sendMail({
      from: senderEmail,
      to: APPLICATION_RECIPIENT_EMAIL,
      subject: `New Job Application - ${jobTitle}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Position Applied For:</strong> ${jobTitle}</p>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Email Address:</strong> ${email}</p>
        <p><strong>Preferred Location:</strong> ${preferredLocation}</p>
        <p><strong>Resume:</strong> See attached file</p>
        <hr />
        <p style="font-size: 12px; color: #666;">
          This is an automated email. Please do not reply to this email address.
        </p>
      `,
      attachments: [
        {
          filename: resume.name,
          content: resumeBuffer,
        },
      ],
    });

    // Send confirmation email to candidate
    try {
      await transporter.sendMail({
        from: senderEmail,
        to: email,
        subject: "Application Received - Midstate Global Services",
        html: `
          <h2>Application Received</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at Midstate Global Services.</p>
          <p>We have received your application and will review it carefully. Our recruitment team will contact you if your profile matches our current requirements.</p>
          <p>Best regards,<br />Midstate Global Services Recruitment Team</p>
        `,
      });
    } catch (confirmationError) {
      console.error("Candidate confirmation email failed:", confirmationError);
    }

    return NextResponse.json(
      { message: "Application submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "Failed to process application. Please try again later." },
      { status: 500 }
    );
  }
}
