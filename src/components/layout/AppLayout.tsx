import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useWalletGate } from '@/hooks/useWalletGate';
import { Outlet } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import Footer from '@/components/layout/Footer';

export default function AppLayout() {
  useWalletGate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Toaster position="top-center" />
      <div className="flex flex-1 flex-col lg:ml-64">
        <Header />
        <main className="flex-1 p-8 text-idos-seasalt overflow-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
