import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="p-24 max-w-7xl mx-auto">
      <DashboardSkeleton />
    </div>
  );
}
