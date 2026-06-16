import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Save application to database
    await prisma.application.create({
      data: {
        fullName,
        phoneNumber,
        email,
        preferredLocation,
        jobTitle,
        resumeName: resume.name,
        resumeType: resume.type,
        resumeData: resumeBuffer,
        status: "Active",
      },
    });

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
