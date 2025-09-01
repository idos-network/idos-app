import CalendarIcon from '@/components/icons/calendar';
import LayersIcon from '@/components/icons/layers';
import UserIcon from '@/components/icons/user';
import { isProduction } from '@/env';
import { Link } from '@tanstack/react-router';
import { BankIcon } from '../icons/bank';
import XIcon from '../icons/x-icon';
import AppTag from '../NotaBank/components/Tag';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex-col gap-14 border-gray-800 border-r px-6 pt-8 hidden z-30 bg-ui-background-dark lg:flex">
      <div className="p-4">
        <img src="/idos-logo.png" width="141" />
      </div>
      <nav className="flex flex-col gap-2 font-medium text-base">
        <Link
          to="/idos-profile"
          className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30 transition-colors duration-200"
        >
          {({ isActive }) => (
            <div
              className={`flex items-center gap-4 w-full rounded-xl p-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
            >
              <UserIcon className="h-6 w-6" isActive={isActive} /> idOS Profile
            </div>
          )}
        </Link>

        {!isProduction && (
          <>
            <Link
              to="/notabank"
              className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30 transition-colors duration-200"
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-4 w-full rounded-xl p-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
                >
                  <BankIcon isActive={isActive} /> NotaBank
                  <AppTag className="ml-auto" variant="success">
                    <span>New</span>
                  </AppTag>
                </div>
              )}
            </Link>
            <Link
              to="/staking-event"
              className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30 transition-colors duration-200"
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-4 w-full rounded-xl p-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
                >
                  <CalendarIcon className="h-6 w-6" isActive={isActive} />{' '}
                  Staking Event
                </div>
              )}
            </Link>
            <Link
              to="/idos-ico"
              className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30 transition-colors duration-200"
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-4 w-full rounded-xl p-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
                >
                  <LayersIcon className="h-6 w-6" isActive={isActive} /> IDOS
                  ICO
                </div>
              )}
            </Link>
            <Link
              to="/idos-staking"
              className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30 transition-colors duration-200"
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-4 w-full rounded-xl px-4 py-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
                >
                  <LayersIcon className="h-6 w-6" isActive={isActive} /> IDOS
                  Staking
                </div>
              )}
            </Link>
          </>
        )}
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
