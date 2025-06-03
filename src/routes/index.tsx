import WalletGate from "@/components/WalletGate";
import { useWalletGuard } from "@/hooks/useWalletGate";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { isConnected } = useWalletGuard();

  if (!isConnected) {
    return <WalletGate />;
  }

  return null;
}
