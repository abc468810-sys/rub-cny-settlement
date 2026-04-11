import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const userId = 'clvp1234567890';
  
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'merchant@example.com',
      name: 'Global Merchant',
      role: 'MERCHANT',
    },
  });

  // Initial Wallet
  await prisma.wallet.upsert({
    where: { id: `wallet-cny-${userId}` },
    update: {},
    create: {
      id: `wallet-cny-${userId}`,
      userId: userId,
      currency: 'CNY',
      balance: 452310.89,
    },
  });

  console.log('Seed finished.');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
