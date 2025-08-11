import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useWalletGate } from '@/hooks/useWalletGate';
import { Outlet } from '@tanstack/react-router';

export default function AppLayout() {
  useWalletGate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:ml-64">
        <Header />
        <main className="flex-1 p-8 text-idos-seasalt">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
