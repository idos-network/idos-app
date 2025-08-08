export const profileStatusStyles: Record<string, string> = {
  verified: 'bg-[#00FFB933] text-[#00FFB9]',
  pending: 'bg-[#FFBB3333] text-[#FFBB33]',
  notVerified: 'bg-[#FF78114D] text-[#FF7811]',
  error: 'bg-[#E2363633] text-[#E23636]',
  noProfile: 'bg-[#7A7A7A33] text-[#7A7A7A]',
  disconnected: 'bg-[#7A7A7A33] text-[#7A7A7A]',
};

export const profileStatusTexts: Record<string, string> = {
  verified: 'Verified',
  pending: 'Pending verification',
  notVerified: 'Not verified',
  error: 'Error',
  disconnected: 'Disconnected',
  noProfile: 'No profile',
};
