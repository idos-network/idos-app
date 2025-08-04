import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Buy from '@/components/NotaBank/views/Buy';
import Kyc from '@/components/NotaBank/views/Kyc';
import Landing from '@/components/NotaBank/views/Landing';
import NotaCard from '@/components/NotaBank/views/NotaCard';
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

export const notabankKycRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/kyc',
  component: Kyc,
  loader: async () => {
    // const url = await getKrakenUrl();
    // debugger
    // return { url };
    return {
      url: 'https://kraken.staging.sandbox.fractal.id/kyc?token=eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6IjU1ZGJmODlmLTYzYmMtNDFiYS1hNjgyLTBkYjJhZWI0Y2NmOSIsImt5YyI6dHJ1ZSwibGV2ZWwiOiJwbHVzK2xpdmVuZXNzK2lkb3MiLCJzdGF0ZSI6IjE3NTM4MTM2NTUxODgiLCJpYXQiOjE3NTM4MTM2NTV9.AQTpdRdrnqGhjH9W88Csc9to2hrHj8tN8lfYVyP-cexm477BdOwwl_SXVFtXskXyMbA1NjLOlN9jbIuM7_qir_LHAaie3HOCHoEkkchOW7ust-lYxXvY6dE3-XjDx8wzCa-d2tBsDysaxIVok5pWSnJgaHAwZgYQgztk09LDpxeGDEiL&provider=persona'
    };
  }
});

export const notabankNotaCardRoute = createRoute({
  getParentRoute: () => notabankRoute,
  path: '/notacard',
  component: NotaCard,
});
