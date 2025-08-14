import {
  clearStoredReferralCode,
  getStoredReferralCode,
  handleReferralCodeFromUrl,
} from '@/utils/referral';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

interface ReferralContextValue {
  referralCode: string | null;
  isLoading: boolean;
  clearReferralCode: () => void;
}

const ReferralContext = createContext<ReferralContextValue | null>(null);

interface ReferralProviderProps {
  children: ReactNode;
}

export function ReferralProvider({ children }: ReferralProviderProps) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlReferralCode = handleReferralCodeFromUrl();
    const storedReferralCode = urlReferralCode || getStoredReferralCode();

    setReferralCode(storedReferralCode);
    setIsLoading(false);
  }, []);

  const clearReferralCode = () => {
    clearStoredReferralCode();
    setReferralCode(null);
  };

  return (
    <ReferralContext.Provider
      value={{
        referralCode,
        isLoading,
        clearReferralCode,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferralCode() {
  const context = useContext(ReferralContext);

  if (!context) {
    throw new Error('useReferralCode must be used within a ReferralProvider');
  }

  return context;
}
