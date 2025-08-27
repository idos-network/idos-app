import { eq } from 'drizzle-orm';
import { db, userWallets } from './index';

export interface UserWalletData {
  userId: string;
  address: string;
  walletType: string;
}

export async function saveUserWallets(
  userId: string,
  wallets: Omit<UserWalletData, 'userId'>[],
) {
  if (wallets.length === 0) {
    return [];
  }

  return await db.transaction(async (tx) => {
    await tx.delete(userWallets).where(eq(userWallets.userId, userId));

    const walletsToInsert = wallets.map((wallet) => ({
      userId,
      address: wallet.address,
      walletType: wallet.walletType,
    }));

    return await tx.insert(userWallets).values(walletsToInsert);
  });
}

export async function getUserWallets(userId: string) {
  return await db
    .select()
    .from(userWallets)
    .where(eq(userWallets.userId, userId));
}
