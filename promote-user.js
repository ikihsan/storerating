const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function promoteUserToStoreOwner() {
  try {
    // Find the most recent user (likely your test user)
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log('Recent users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Promote the user with email "testuser@test.com" or the most recent user
    const targetEmail = 'testuser@test.com'; // Change this to your email
    
    let userToPromote = users.find(user => user.email === targetEmail);
    
    if (!userToPromote) {
      console.log(`User with email ${targetEmail} not found. Using most recent user instead.`);
      userToPromote = users[0];
    }

    if (userToPromote) {
      const updatedUser = await prisma.user.update({
        where: { id: userToPromote.id },
        data: { role: 'STORE_OWNER' },
      });

      console.log(`\n✅ Successfully promoted user to STORE_OWNER:`);
      console.log(`Name: ${updatedUser.name}`);
      console.log(`Email: ${updatedUser.email}`);
      console.log(`Role: ${updatedUser.role}`);
      
      console.log(`\n🎉 You can now login as ${updatedUser.email} and create stores!`);
    }
  } catch (error) {
    console.error('Error promoting user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

promoteUserToStoreOwner();