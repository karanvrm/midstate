import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Credentials to seed. You can replace the email and password values below before running the seed script.
  const name = "Raushan Verma";
  const email = "midstateglobalservices@gmail.com"; // <-- REPLACE WITH YOUR EMAIL PLACEHOLDER
  const password = "King@29";           // <-- REPLACE WITH YOUR PASSWORD PLACEHOLDER
  const phoneNumber = "7783805380";

  console.log("Starting database seed...");

  // Check whether the owner account already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    console.log(`User with email "${email}" already exists. Skipping user creation.`);
    return;
  }

  // Hash password using 12 salt rounds, matching the registration implementation
  const passwordHash = await bcrypt.hash(password, 12);

  // Create default OWNER account set to ACTIVE
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phoneNumber,
      passwordHash,
      role: "OWNER",
      status: "ACTIVE",
    },
  });

  console.log(`Database seeded successfully! Created OWNER account:`);
  console.log(`- Name: ${user.name}`);
  console.log(`- Email: ${user.email}`);
  console.log(`- Phone: ${user.phoneNumber}`);
  console.log(`- Role: ${user.role}`);
  console.log(`- Status: ${user.status}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
