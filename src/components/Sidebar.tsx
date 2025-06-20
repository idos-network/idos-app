import { Link } from '@tanstack/react-router';
import CalendarIcon from './icons/calendar';
import MagicIcon from './icons/magic';
import UserIcon from './icons/user';

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col gap-2 border-gray-800 border-r p-5">
      <div className="mb-8 p-2">
        <img src="/idos-logo-dashboard.png" width="159" height="62" />
      </div>
      <nav className="flex flex-col gap-2 font-medium text-lg">
        <Link
          to="/idos-profile"
          className="flex items-center gap-2 rounded-2xl px-3 py-2 [&.active]:bg-neutral-800 [&.active]:bg-opacity-50"
        >
          {({ isActive }) => (
            <>
              <UserIcon className="h-4 w-4" isActive={isActive} /> idOS Profile
            </>
          )}
        </Link>
        <Link
          to="/staking-event"
          className="flex items-center gap-2 rounded px-3 py-2 [&.active]:bg-idos-grey2"
        >
          {({ isActive }) => (
            <>
              <CalendarIcon className="h-4 w-4" isActive={isActive} /> Staking
              Event
            </>
          )}
        </Link>
        <Link
          to="/native-staking"
          className="flex items-center gap-2 rounded px-3 py-2 [&.active]:bg-idos-grey2"
        >
          {({ isActive }) => (
            <>
              <MagicIcon className="h-4 w-4" isActive={isActive} /> Native
              Staking
            </>
          )}
        </Link>
      </nav>
    </aside>
  );
}
