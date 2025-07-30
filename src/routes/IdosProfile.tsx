import { useEffect } from 'react';
import Header from '@/layout/Header';
import Sidebar from '@/layout/Sidebar';
import { CredentialsCard, WalletsCard } from '@/components/profile';
import { useIdOSLoginStatus } from '@/hooks/useIdOSHasProfile';
import { useSpecificCredential } from '@/hooks/useCredentials';
import { useToast } from '@/hooks/useToast';
import { env } from '@/env';
import OnboardingStepper from '@/components/onboarding/OnboardingStepper';
import { useWalletGate } from '@/hooks/useWalletGate';

export function IdosProfile() {
  useWalletGate();
  const hasProfile = useIdOSLoginStatus();
  const { hasCredential: hasStakingCredential, isLoading } =
    useSpecificCredential(env.VITE_ISSUER_SIGNING_PUBLIC_KEY);
  const { showToast } = useToast();

  useEffect(() => {
    const toastData = localStorage.getItem('showToast');
    if (toastData) {
      try {
        const { type, message } = JSON.parse(toastData);
        showToast({ type, message: message });
      } catch (e) {
        // ignore parse errors
      }
      localStorage.removeItem('showToast');
    }
  }, [showToast]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64">
        <Header />
        <main className="flex-1 flex items-start justify-center text-idos-seasalt">
          {hasProfile && !isLoading && hasStakingCredential ? (
            <div className="container mx-auto max-w-[1050px] flex flex-col px-32 pt-18">
              <div className="gap-3 flex flex-col mb-10">
                <div className="text-2xl font-medium text-neutral-50">
                  idOS Profile
                </div>
                <p className="text-neutral-200 text-base font-['Inter']">
                  View and manage your idOS identity and credentials
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <CredentialsCard
                  onError={(err) => showToast({ type: 'error', message: err })}
                  onSuccess={(msg) =>
                    showToast({ type: 'success', message: msg })
                  }
                />
                <WalletsCard />
              </div>
            </div>
          ) : (
            <div className="container mx-auto flex justify-center pt-18">
              <OnboardingStepper />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
