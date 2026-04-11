import ReportsClient from '@/components/dashboard/ReportsClient';
import { getDashboardData } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function ReportsPage() {
  const data = await getDashboardData();
  
  if (!data) {
    redirect('/login');
  }

  return <ReportsClient />;
}
