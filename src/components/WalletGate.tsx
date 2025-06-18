import { WalletConnector } from './WalletConnector';

export default function WalletGate() {
  return (
    <div className="grid grid-cols-2 min-h-screen bg-idos-dark-mode">
      <div className="bg-idos-grey4"></div>
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-bold text-4xl text-idos-seasalt">
            Welcome to idOS Staking
          </h1>
          <p className="text-idos-grey4 text-lg">
            Please connect your wallet to access the application
          </p>
          <WalletConnector />
        </div>
      </div>
    </div>
  );
}
