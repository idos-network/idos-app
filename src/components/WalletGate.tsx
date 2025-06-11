import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletGate() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-idos-dark-mode">
      <div className="mb-8 text-center">
        <h1 className="mb-4 font-bold text-4xl text-idos-seasalt">
          Welcome to idOS Staking
        </h1>
        <p className="text-idos-grey4 text-lg">
          Please connect your wallet to access the application
        </p>
      </div>
      <ConnectButton />
    </div>
  );
}
