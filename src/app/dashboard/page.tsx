import { Suspense } from 'react';
import AdminClient from '@/components/Pages/Admin/Admin';

export const metadata = {
  title: 'Admin Dashboard | East CMSA',
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminClient />
    </Suspense>
  );
}