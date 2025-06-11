import CustomConnectButton from './CustomConnectButton';

export default function Header() {
  return (
    <header className="flex justify-end gap-2 border-gray-800 border-b p-4 text-idos-seasalt">
      <CustomConnectButton />
    </header>
  );
}
