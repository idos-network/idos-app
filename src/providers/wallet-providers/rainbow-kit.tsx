import { env } from "@/env";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";

const projectID = env.VITE_WALLET_CONNECT_PROJECT_ID;

const config = getDefaultConfig({
  appName: "idOS Staking",
  projectId: projectID,
  chains: [mainnet],
  ssr: true,
});

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
}
