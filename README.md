# CNY-RUB Cross-Border Settlement System (Demo Version)

Professional framework for Sino-Russian trade settlement, built with Next.js 14, Tailwind CSS, and Prisma.

## 🚀 Key Features

- **Specialized CNY-RUB Dashboard**: Real-time tracking of RMB and Ruble balances.
- **Settlement Engine**: 
  - Automated currency conversion (CNY to RUB).
  - **1.5% fixed service fee** logic integrated into both frontend and backend.
  - Live preview of estimated RUB amounts.
- **Merchant Management**:
  - Wallet balance monitoring (CNY & RUB).
  - Transaction history with detailed status tracking (Requested, Processing, Settled).
- **Admin Approval Portal**:
  - Dedicated `/admin` route to review, approve, or reject merchant requests.
  - Automatic balance adjustment and status updates.
- **Modern Tech Stack**: Next.js App Router, TypeScript, Prisma ORM, Lucide Icons, and Tailwind CSS.

## 🛠️ Project Structure

- `src/app/dashboard`: Main dashboard and wallet views.
- `src/app/dashboard/settlements`: Settlement request form and history.
- `src/services/settlement.ts`: Core business logic for settlement calculation.
- `prisma/schema.prisma`: Data models for Users, Wallets, and Transactions.

## 🏁 Quick Start (Local Environment)

Follow these steps to run the demo on your machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Database**:
   ```bash
   npx prisma db push
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Business Rules
- **Default Fee**: 1.5% of the CNY amount.
- **Conversion**: Calculated based on a demo rate (1 CNY = 12.87 RUB).
- **Status Workflow**: Requested → Processing → Settled.

---
*Developed for the Cross-Border Settlement Strike Team.*
