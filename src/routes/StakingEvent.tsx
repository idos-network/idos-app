import Header from '@/layout/Header';
import Sidebar from '@/layout/Sidebar';
import { useWalletGate } from '@/hooks/useWalletGate';

export function StakingEvent() {
  useWalletGate();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64">
        <Header />
        <main className="flex-1 p-8 text-idos-seasalt">
          <div>Hello "/staking-event"!</div>
        </main>
      </div>
    </div>
  );
}
