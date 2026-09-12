import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      name: 'Admin',
      username: 'admin',
      email: 'admin@pos.com',
      password: hashedPassword,
      role: 'OWNER',
    },
  });

  // Create default shop data
  const shopData = await prisma.shopData.findFirst();
  if (!shopData) {
    await prisma.shopData.create({
      data: {
        name: 'My Store',
        tax: 10,
      },
    });
  }

  console.log('Seed completed:', { adminUser: adminUser.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
