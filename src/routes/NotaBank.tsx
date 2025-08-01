import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Buy from '@/components/NotaBank/views/Buy';
import Landing from '@/components/NotaBank/views/Landing';
import { notabankRoute } from '@/routes';
import { createRoute } from '@tanstack/react-router';

export function PageLayout({ children }: { children: React.ReactNode }) {
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



// Landing route for /notabank
export const notabankIndexRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/',
  component: Landing,
});

// Buy route for /notabank/buy
export const notabankBuyRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/buy',
  component: Buy,
});
