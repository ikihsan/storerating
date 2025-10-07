import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  const userPassword = await bcrypt.hash('User123!', 12);
  
  // Create admin user
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

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@stores.com' },
    update: {},
    create: {
      name: 'Regular User Account for Testing',
      email: 'user@stores.com',
      address: '456 User Avenue, User City, User State 67890',
      password: userPassword,
      role: UserRole.USER,
    },
  });

  // Create store owners and their stores
  const storeOwner1 = await prisma.user.upsert({
    where: { email: 'owner1@stores.com' },
    update: {},
    create: {
      name: 'Store Owner One Account Testing',
      email: 'owner1@stores.com',
      address: '789 Owner Street, Business District, City 11111',
      password: userPassword,
      role: UserRole.STORE_OWNER,
    },
  });

  const storeOwner2 = await prisma.user.upsert({
    where: { email: 'owner2@stores.com' },
    update: {},
    create: {
      name: 'Store Owner Two Account Testing',
      email: 'owner2@stores.com',
      address: '321 Commerce Ave, Shopping Center, City 22222',
      password: userPassword,
      role: UserRole.STORE_OWNER,
    },
  });

  // Create stores
  const store1 = await prisma.store.upsert({
    where: { email: 'contact@techstore.com' },
    update: {},
    create: {
      name: 'Tech Electronics Store',
      email: 'contact@techstore.com',
      address: '100 Tech Plaza, Electronics District, Tech City 33333',
      ownerId: storeOwner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: 'info@fashionboutique.com' },
    update: {},
    create: {
      name: 'Fashion Boutique & Accessories',
      email: 'info@fashionboutique.com',
      address: '200 Fashion Street, Style District, Fashion City 44444',
      ownerId: storeOwner2.id,
    },
  });

  // Create some sample ratings
  await prisma.rating.create({
    data: {
      value: 5,
      userId: user.id,
      storeId: store1.id,
    },
  });

  await prisma.rating.create({
    data: {
      value: 4,
      userId: admin.id,
      storeId: store2.id,
    },
  });

}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });