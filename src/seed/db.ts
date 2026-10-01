import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "super@admin.local",
        name: "Super Admin",
        passwordHash,
        role: "superadmin",
      },
      {
        email: "admin@admin.local",
        name: "Regular Admin",
        passwordHash,
        role: "admin",
      },
      {
        email: "alice@user.local",
        name: "Alice",
        passwordHash,
        role: "user",
      },
      {
        email: "bob@user.local",
        name: "Bob",
        passwordHash,
        role: "user",
      },
    ],
  });

  console.log("Seeded 4 users");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
