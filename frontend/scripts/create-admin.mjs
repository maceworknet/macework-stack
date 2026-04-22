import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Admin";

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);

await prisma.user.upsert({
  where: { email: email.toLowerCase().trim() },
  update: { passwordHash, name, role: "ADMIN" },
  create: {
    email: email.toLowerCase().trim(),
    name,
    passwordHash,
    role: "ADMIN",
  },
});

await prisma.$disconnect();
console.log(`Admin user is ready: ${email}`);
