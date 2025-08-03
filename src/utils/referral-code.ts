import crypto from 'crypto';

// Generates a referral code based on user ID
export function generateReferralCode(
  userId: string,
  length: number = 8,
): string {
  const hash = crypto.createHash('sha256').update(userId).digest('hex');

  return hash.substring(0, length).toUpperCase();
}

// Validates if a referral code matches the expected format
export function validateReferralCode(code: string, userId: string): boolean {
  const expectedCode = generateReferralCode(userId);
  return code === expectedCode;
}
