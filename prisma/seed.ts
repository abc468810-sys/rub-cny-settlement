import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

// Fallback CNY->RUB rate, matching the fallback used in src/lib/actions.ts::getLatestRate()
const BASE_RATE = 12.87;
const RUB_TO_CNY_RATE = 1 / BASE_RATE;

// Demo-only credentials, hashed below before being written to the DB.
const MERCHANT_PASSWORD = 'MerchantPass123!';
const ADMIN_PASSWORD = 'AdminPass123!';

function computeSettlement(amount: number) {
  const fee = amount * 0.015;
  const netAmount = amount - fee;
  const targetAmount = netAmount * RUB_TO_CNY_RATE;
  return { amount, fee, netAmount, targetAmount };
}

async function main() {
  const merchantId = 'clvp1234567890';
  const adminId = 'clvpadmin0000001';

  const [merchantPasswordHash, adminPasswordHash] = await Promise.all([
    bcrypt.hash(MERCHANT_PASSWORD, 10),
    bcrypt.hash(ADMIN_PASSWORD, 10),
  ]);

  const merchant = await prisma.user.upsert({
    where: { id: merchantId },
    update: {},
    create: {
      id: merchantId,
      email: 'merchant@example.com',
      password: merchantPasswordHash,
      name: 'Global Merchant',
      role: 'MERCHANT',
      kycStatus: 'APPROVED',
    },
  });

  const admin = await prisma.user.upsert({
    where: { id: adminId },
    update: {},
    create: {
      id: adminId,
      email: 'admin@tradebridge.cn',
      password: adminPasswordHash,
      name: 'Platform Admin',
      role: 'ADMIN',
      kycStatus: 'APPROVED',
    },
  });

  // Merchant CNY wallet (kept from the original seed)
  const cnyWalletId = `wallet-cny-${merchantId}`;
  await prisma.wallet.upsert({
    where: { id: cnyWalletId },
    update: {},
    create: {
      id: cnyWalletId,
      userId: merchantId,
      currency: 'CNY',
      balance: 452310.89,
    },
  });

  // Sample settlements: 1 PROCESSING, 1 COMPLETED, 1 REJECTED
  const processing = computeSettlement(50000);
  const completed = computeSettlement(80000);
  const rejected = computeSettlement(30000);

  // Merchant RUB wallet. Settlement creation escrows funds immediately (see
  // createSettlement in src/lib/actions.ts); REJECTED settlements refund the
  // hold, PROCESSING/COMPLETED do not, so the resting balance below reflects
  // an initial 500,000 RUB minus the two settlements still holding funds.
  const initialRubBalance = 500000;
  const rubWalletId = `wallet-rub-${merchantId}`;
  await prisma.wallet.upsert({
    where: { id: rubWalletId },
    update: {},
    create: {
      id: rubWalletId,
      userId: merchantId,
      currency: 'RUB',
      balance: initialRubBalance - processing.amount - completed.amount,
    },
  });

  await prisma.transaction.create({
    data: {
      userId: merchantId,
      type: 'SETTLEMENT',
      fromCurrency: 'RUB',
      toCurrency: 'CNY',
      amount: processing.amount,
      fee: processing.fee,
      netAmount: processing.netAmount,
      targetAmount: processing.targetAmount,
      rate: RUB_TO_CNY_RATE,
      bankAccount: '6222021234567890123',
      contractNo: 'CT-2026-0917-001',
      commodityType: 'Industrial Equipment',
      status: 'PROCESSING',
    },
  });

  await prisma.transaction.create({
    data: {
      userId: merchantId,
      type: 'SETTLEMENT',
      fromCurrency: 'RUB',
      toCurrency: 'CNY',
      amount: completed.amount,
      fee: completed.fee,
      netAmount: completed.netAmount,
      targetAmount: completed.targetAmount,
      rate: RUB_TO_CNY_RATE,
      bankAccount: '6222021234567890123',
      contractNo: 'CT-2026-0910-002',
      commodityType: 'Cold Chain Equipment',
      status: 'COMPLETED',
    },
  });

  await prisma.transaction.create({
    data: {
      userId: merchantId,
      type: 'SETTLEMENT',
      fromCurrency: 'RUB',
      toCurrency: 'CNY',
      amount: rejected.amount,
      fee: rejected.fee,
      netAmount: rejected.netAmount,
      targetAmount: rejected.targetAmount,
      rate: RUB_TO_CNY_RATE,
      bankAccount: '6222021234567890123',
      contractNo: 'CT-2026-0905-003',
      commodityType: 'Auto Parts',
      status: 'REJECTED',
    },
  });

  // The COMPLETED settlement's payout, mirroring approveSettlement() in
  // src/lib/actions.ts, so the CNY balance already reflects it.
  await prisma.wallet.update({
    where: { id: cnyWalletId },
    data: { balance: { increment: completed.targetAmount } },
  });

  await prisma.beneficiary.create({
    data: {
      userId: merchantId,
      name: 'Moscow Trading LLC',
      accountNumber: '40702810900000012345',
      bankName: 'Sberbank',
      currency: 'RUB',
    },
  });

  await prisma.beneficiary.create({
    data: {
      userId: merchantId,
      name: 'Shanghai Supply Co.',
      accountNumber: '6222020200088888888',
      bankName: 'Bank of China',
      currency: 'CNY',
    },
  });

  console.log('Seed finished.');
  console.log(`Admin login: ${admin.email} / ${ADMIN_PASSWORD}`);
  console.log(`Merchant login: ${merchant.email} / ${MERCHANT_PASSWORD}`);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
