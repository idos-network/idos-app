const REFERRAL_STORAGE_KEY = 'idos_referral_code';
const REFERRAL_PARAM = 'ref';

export function extractReferralCodeFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(REFERRAL_PARAM);
}

export function storeReferralCode(referralCode: string): void {
  localStorage.setItem(REFERRAL_STORAGE_KEY, referralCode);
}

export function getStoredReferralCode(): string | null {
  return localStorage.getItem(REFERRAL_STORAGE_KEY);
}

export function clearStoredReferralCode(): void {
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}

export function handleReferralCodeFromUrl(): string | null {
  const referralCode = extractReferralCodeFromUrl();

  if (referralCode) {
    storeReferralCode(referralCode);

    const url = new URL(window.location.href);
    url.searchParams.delete(REFERRAL_PARAM);
    history.pushState({}, '', '/leaderboard');
  }

  return referralCode;
}
