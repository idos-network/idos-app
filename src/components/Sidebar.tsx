import { Link } from "@tanstack/react-router";
import IdosPrimaryHorizontal from "./branding/idos-primary-hor";
import CalendarIcon from "./icons/calendar";
import MagicIcon from "./icons/magic";
import UserIcon from "./icons/user";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-col gap-2 border-gray-800 border-r p-5">
      <div className="mb-8 p-2">
        <IdosPrimaryHorizontal className="h-10 w-auto" />
      </div>
      <nav className="flex flex-col gap-2">
        <Link
          to="/idos-profile"
          className="flex items-center gap-2 rounded px-3 py-2 [&.active]:bg-idos-grey2"
        >
          <UserIcon className="h-4 w-4" /> idOS Profile
        </Link>
        <Link
          to="/staking-event"
          className="flex items-center gap-2 rounded px-3 py-2 [&.active]:bg-idos-grey2"
        >
          <CalendarIcon className="h-4 w-4" /> Staking Event
        </Link>
        <Link
          to="/native-staking"
          className="flex items-center gap-2 rounded px-3 py-2 [&.active]:bg-idos-grey2"
        >
          <MagicIcon className="h-4 w-4" /> Native Staking
        </Link>
      </nav>
    </aside>
  );
}
