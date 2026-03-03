// src/app/dashboard/page.tsx
import { Suspense } from 'react';
import AdminClient from '@/components/Pages/Admin/Admin';

export const metadata = {
  title: 'Admin Dashboard | East CMSA',
};

// Loading component
function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="h-12 w-12 bg-blue-200 rounded-full mx-auto mb-4"></div>
        <div className="text-gray-600">Inapakia dashibodi...</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminClient />
    </Suspense>
  );
}