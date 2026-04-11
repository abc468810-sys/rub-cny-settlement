import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <DashboardLayout>
      <DashboardSkeleton />
    </DashboardLayout>
  );
}
