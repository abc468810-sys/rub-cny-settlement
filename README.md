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

- `src/app/dashboard`: Main dashboard, with sub-routes for wallets, settlements, compliance, reports, matrix, developer, and receipt views.
- `src/app/admin`: Admin approval portal (review/approve/reject settlements, KYC, system config).
- `src/app/login`: Login page.
- `src/lib/actions.ts`: Core server actions — auth, settlements, wallets, beneficiaries, and system config (business logic lives here, not in a `src/services/` directory).
- `src/lib/auth.ts`: Session/auth helpers (`requireAuth`, `requireAdmin`, session cookie handling).
- `src/lib/prisma.ts`: Shared Prisma client instance.
- `src/lib/dictionaries.ts`: Copy/i18n dictionary data.
- `src/lib/utils.ts`: Small shared utility helpers.
- `src/components/ui`: Reusable UI primitives and the settlement form.
- `src/components/dashboard`: Dashboard-specific components (charts, network map, heatmap, etc.).
- `src/components/layout`: Shared layout/shell components.
- `prisma/schema.prisma`: Data models for Users, Wallets, Transactions, Beneficiaries, and SystemConfig.
- `prisma/seed.ts`: Seed script populating demo users, wallets, settlements, and beneficiaries.

## 🏁 Quick Start (Local Environment)

Follow these steps to run the demo on your machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # edit .env with your own DATABASE_URL
   ```

3. **Setup Database & Seed Demo Data**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Business Rules
- **Default Fee**: 1.5% of the CNY amount.
- **Conversion**: Calculated based on a demo rate (1 CNY = 12.87 RUB).
- **Status Workflow**: Requested → Processing → Settled.

---
*Developed for the Cross-Border Settlement Strike Team.*
