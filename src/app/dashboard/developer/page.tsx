import DeveloperClient from '@/components/dashboard/DeveloperClient';
import { getDashboardData } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function DeveloperPage() {
  const data = await getDashboardData();
  
  if (!data) {
    redirect('/login');
  }

  return <DeveloperClient />;
}
