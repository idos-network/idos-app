import { Link } from '@tanstack/react-router';
import CalendarIcon from '@/components/icons/calendar';
import UserIcon from '@/components/icons/user';
import LayersIcon from '@/components/icons/layers';
import XIcon from '../icons/x-icon';
import { BankIcon } from '../icons/bank';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col gap-14 border-gray-800 border-r px-6 pt-8">
      <div className="p-4">
        <img src="/idos-logo.png" width="141" />
      </div>
      <nav className="flex flex-col gap-2 font-medium text-base">
        <Link
          to="/idos-profile"
          className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30"
        >
          {({ isActive }) => (
            <div
              className={`flex items-center gap-4 w-full rounded-xl px-3 py-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
            >
              <UserIcon className="h-6 w-6" isActive={isActive} /> idOS Profile
            </div>
          )}
        </Link>
        <Link
          to="/staking-event"
          className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30"
        >
          {({ isActive }) => (
            <div
              className={`flex items-center gap-4 w-full rounded-xl px-3 py-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
            >
              <CalendarIcon className="h-6 w-6" isActive={isActive} /> Staking
              Event
            </div>
          )}
        </Link>
        <Link
          to="/idos-staking"
          className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30"
        >
          {({ isActive }) => (
            <div
              className={`flex items-center gap-4 w-full rounded-xl px-3 py-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
            >
              <LayersIcon className="h-6 w-6" isActive={isActive} /> idOS
              Staking
            </div>
          )}
        </Link>
        <Link
          to="/notabank"
          className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30"
        >
          {({ isActive }) => (
            <div
              className={`flex items-center gap-4 w-full rounded-xl px-3 py-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
            >
              <BankIcon className="h-6 w-6" isActive={isActive} /> NotaBank
            </div>
          )}
        </Link>
      </nav>
      <footer className="mt-auto flex items-center h-13 pb-4 pt-4 border-t border-gray-800 -mx-6 px-4">
        <a
          href="https://x.com/idOS_network"
          target="_blank"
          rel="noopener noreferrer"
        >
          <XIcon className="cursor-pointer h-5 w-5 hover:text-aquamarine-400" />
        </a>
      </footer>
    </aside>
  );
}
