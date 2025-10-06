import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stores.com' },
    update: {},
    create: {
      name: 'System Administrator Account',
      email: 'admin@stores.com',
      address: '123 Admin Street, Admin City, Admin State 12345',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('Seeded admin user:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });