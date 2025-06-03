import { redirect, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAccount } from "wagmi";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected } = useAccount();
  const location = useLocation();

  useEffect(() => {
    if (!isConnected && location.pathname !== "/") {
      redirect({ to: "/" });
    }
  }, [isConnected, location.pathname]);

  if (!isConnected) {
    return null;
  }

  return <>{children}</>;
}
