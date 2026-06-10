import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  phoneNumber: z.string().trim().min(1, "Phone number is required.").max(30),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors[0]?.message ?? "Invalid signup details." },
      { status: 400 },
    );
  }

  const { name, phoneNumber, password } = result.data;
  const email = result.data.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      phoneNumber,
      passwordHash,
      role: "STAFF",
      status: "PENDING",
    },
  });

  return NextResponse.json(
    { message: "Your registration request has been submitted and is awaiting approval from an administrator." },
    { status: 201 },
  );
}
