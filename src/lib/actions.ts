'use server';

import prisma from './prisma';
import { revalidatePath } from 'next/cache';
import { getSession, setSession, deleteSession, requireAuth, requireAdmin } from './auth';
import { calculateSettlement } from './settlement';

export async function login(email: string) {
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    // For demo convenience, automatically create a user if not found
    user = await prisma.user.create({ 
      data: { 
        email, 
        name: email.split('@')[0],
        role: email.includes('admin') ? 'ADMIN' : 'MERCHANT' 
      } 
    });
  }
  
  await setSession(user.id);
  revalidatePath('/');
  return { success: true, role: user.role };
}

export async function logout() {
  await deleteSession();
  revalidatePath('/');
}

export async function getLatestRate() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/CNY', { next: { revalidate: 3600 } });
    const data = await res.json();
    const rate = data.rates.RUB || 12.87;
    
    await prisma.exchangeRate.upsert({
      where: { id: 'cny-rub' },
      update: { rate },
      create: { id: 'cny-rub', from: 'CNY', to: 'RUB', rate }
    });
    
    return rate;
  } catch (e) {
    const cached = await prisma.exchangeRate.findUnique({ where: { id: 'cny-rub' } });
    return cached?.rate || 12.87;
  }
}

export async function depositCurrency(amount: number, currency: 'CNY' | 'RUB') {
  const session = await requireAuth();
  const userId = session.id;

  await prisma.$transaction(async (tx) => {
    await tx.wallet.upsert({
      where: { id: `wallet-${currency.toLowerCase()}-${userId}`, userId, currency },
      update: { balance: { increment: amount } },
      create: { id: `wallet-${currency.toLowerCase()}-${userId}`, userId, currency, balance: amount },
    });

    await tx.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        fromCurrency: currency,
        toCurrency: currency,
        amount,
        netAmount: amount,
        targetAmount: amount,
        status: 'COMPLETED',
        bankAccount: 'System Deposit',
      },
    });
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/wallets');
}

export async function createSettlement(
  amount: number,
  bankAccount: string,
  contractNo: string,
  commodityType: string
) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Invalid amount: must be a positive number');
  }
  if (!bankAccount || bankAccount.trim().length < 6) {
    throw new Error('Invalid bankAccount: required, minimum 6 characters');
  }
  if (!contractNo || contractNo.trim().length === 0) {
    throw new Error('Invalid contractNo: required');
  }
  if (!commodityType || commodityType.trim().length === 0) {
    throw new Error('Invalid commodityType: required');
  }

  const session = await requireAuth();
  const userId = session.id;
  const baseRate = await getLatestRate(); // This is CNY to RUB

  // We are doing RUB to CNY
  const { fee, netAmount, targetAmount, rate } = calculateSettlement(amount, baseRate);

  await prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findFirst({
      where: { userId, currency: 'RUB' }
    });
    
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient RUB funds');
    }

    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } }
    });

    await tx.transaction.create({
      data: {
        userId,
        type: 'SETTLEMENT',
        fromCurrency: 'RUB',
        toCurrency: 'CNY',
        amount,
        fee,
        netAmount,
        targetAmount,
        rate,
        bankAccount,
        contractNo,
        commodityType,
        status: 'PROCESSING',
      },
    });
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settlements');
}

export async function approveSettlement(id: string) {
  await requireAdmin();

  const tx = await prisma.transaction.update({
    where: { id },
    data: { status: 'COMPLETED' }
  });

  // Increment CNY target wallet balance
  await prisma.wallet.upsert({
    where: { id: `wallet-cny-${tx.userId}`, userId: tx.userId, currency: 'CNY' },
    update: { balance: { increment: tx.targetAmount } },
    create: { id: `wallet-cny-${tx.userId}`, userId: tx.userId, currency: 'CNY', balance: tx.targetAmount },
  });

  revalidatePath('/dashboard');
  revalidatePath('/admin');
}

export async function rejectSettlement(id: string) {
  await requireAdmin();

  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx || tx.status !== 'PROCESSING') return;

  await prisma.$transaction(async (db) => {
    await db.transaction.update({
      where: { id },
      data: { status: 'REJECTED' }
    });

    const wallet = await db.wallet.findFirst({
      where: { userId: tx.userId, currency: 'RUB' }
    });
    
    if (wallet) {
      await db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: tx.amount } }
      });
    }
  });

  revalidatePath('/dashboard');
  revalidatePath('/admin');
}

export async function getDashboardData() {
  const session = await getSession();
  if (!session) return null;
  const userId = session.id;

  const wallets = await prisma.wallet.findMany({ where: { userId } });
  const transactions = await prisma.transaction.findMany({ 
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  const cnyBalance = wallets.find(w => w.currency === 'CNY')?.balance || 0;
  const rubBalance = wallets.find(w => w.currency === 'RUB')?.balance || 0;
  const currentRate = await getLatestRate();

  return { cnyBalance, rubBalance, transactions, currentRate, user: session };
}

export async function getAdminPending() {
  await requireAdmin();

  return await prisma.transaction.findMany({
    where: { type: 'SETTLEMENT', status: 'PROCESSING' },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getTransaction(id: string) {
  return await prisma.transaction.findUnique({
    where: { id },
    include: { user: true }
  });
}

export async function approveKyc(userId: string) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: 'APPROVED' }
  });
  revalidatePath('/admin');
  revalidatePath('/dashboard');
}

export async function submitKyc(data: { businessLicense: string; directorId: string }) {
  const session = await requireAuth();
  // Simulated upload - in reality we'd use S3/Cloudinary
  console.log('KYC Documents submitted:', data);
  await prisma.user.update({
    where: { id: session.id },
    data: { kycStatus: 'PENDING' }
  });
  revalidatePath('/dashboard');
}

export async function getAdminUsers() {
  await requireAdmin();
  return await prisma.user.findMany({
    where: { role: 'MERCHANT' },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getAdminStats() {
  await requireAdmin();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todaysSettlements = await prisma.transaction.findMany({
    where: {
      type: 'SETTLEMENT',
      fromCurrency: 'RUB',
      createdAt: { gte: startOfDay },
    },
    select: { amount: true },
  });
  const dailyFlowRub = todaysSettlements.reduce((sum, t) => sum + t.amount, 0);

  const cnyWallets = await prisma.wallet.findMany({
    where: { currency: 'CNY' },
    select: { balance: true },
  });
  const cnyLiquidity = cnyWallets.reduce((sum, w) => sum + w.balance, 0);

  const activeUsers = await prisma.user.count({ where: { role: 'MERCHANT' } });

  return { dailyFlowRub, cnyLiquidity, activeUsers };
}

export async function getBeneficiaries() {
  const session = await requireAuth();
  return await prisma.beneficiary.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' }
  });
}

export async function addBeneficiary(name: string, accountNumber: string, bankName?: string) {
  const session = await requireAuth();
  await prisma.beneficiary.create({
    data: {
      userId: session.id,
      name,
      accountNumber,
      bankName,
      currency: 'CNY'
    }
  });
  revalidatePath('/dashboard/settlements');
}

export async function getSystemConfig() {
  return await prisma.systemConfig.upsert({
    where: { id: 'global' },
    update: {},
    create: { 
      id: 'global', 
      brandName: 'TradeBridge',
      accentColor: '#3b82f6',
      fee: 1.5, 
      routingPath: 'MOSCOW', 
      isMaintenance: false,
      advisoryText: 'Node synchronization 100% complete. RUB-CNY corridors active.'
    }
  });
}

export async function updateSystemConfig(data: Partial<{ 
  fee: number; 
  routingPath: string; 
  isMaintenance: boolean;
  brandName: string;
  accentColor: string;
  advisoryText: string;
}>) {
  await requireAdmin();
  const config = await prisma.systemConfig.update({
    where: { id: 'global' },
    data
  });
  revalidatePath('/dashboard');
  revalidatePath('/admin');
  return config;
}
