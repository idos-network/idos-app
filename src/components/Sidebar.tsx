import { Link } from '@tanstack/react-router';
import CalendarIcon from '@/components/icons/calendar';
import UserIcon from '@/components/icons/user';
import LayersIcon from '@/components/icons/layers';

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col gap-2 border-gray-800 border-r p-5">
      <div className="mb-8 p-2">
        <img src="/idos-logo-dashboard.png" width="159" height="62" />
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
          to="/native-staking"
          className="flex items-center gap-4 rounded-xl hover:bg-neutral-800/30"
        >
          {({ isActive }) => (
            <div
              className={`flex items-center gap-4 w-full rounded-xl px-3 py-4 ${isActive ? 'bg-neutral-800/50' : ''}`}
            >
              <LayersIcon className="h-6 w-6" isActive={isActive} /> Native
              Staking
            </div>
          )}
        </Link>
      </nav>
    </aside>
  );
}
