import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export function NotaBankWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64">
        <Header />
        <main className="flex-1 p-8 text-idos-seasalt">{children}</main>
      </div>
    </div>
  );
}
