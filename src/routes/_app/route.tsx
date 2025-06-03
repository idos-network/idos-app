import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useWalletGuard } from "@/hooks/useWalletGate";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  useWalletGuard();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8 text-idos-seasalt">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
