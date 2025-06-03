import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="flex justify-end gap-2 border-gray-800 border-b p-2 text-idos-seasalt">
      <div className="flex flex-row">
        <ConnectButton />
      </div>
    </header>
  );
}
