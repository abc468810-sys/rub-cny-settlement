'use client';

import { motion } from 'framer-motion';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-50 ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
         <Skeleton className="h-12 w-64" />
         <div className="flex space-x-4">
           <Skeleton className="h-12 w-12 rounded-2xl" />
           <Skeleton className="h-12 w-12 rounded-2xl" />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <Skeleton className="h-48 rounded-[3rem]" />
         <Skeleton className="h-48 rounded-[3rem]" />
         <Skeleton className="h-48 rounded-[3rem]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Skeleton className="h-64 col-span-2 rounded-[4rem]" />
         <Skeleton className="h-64 rounded-[4rem]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Skeleton className="h-80 rounded-[4rem]" />
         <Skeleton className="h-80 rounded-[4rem]" />
      </div>

      <Skeleton className="h-[500px] rounded-[4.5rem]" />
    </div>
  );
}
