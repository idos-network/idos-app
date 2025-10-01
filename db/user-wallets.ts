import { eq, sql } from 'drizzle-orm';
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

  const walletsToInsert = wallets.map((wallet) => ({
    userId,
    address: wallet.address,
    walletType: wallet.walletType,
  }));

  return await db
    .insert(userWallets)
    .values(walletsToInsert)
    .onConflictDoNothing({ target: [userWallets.userId, userWallets.address] });
}

export async function getUserWallets(userId: string) {
  return await db
    .select()
    .from(userWallets)
    .where(eq(userWallets.userId, userId));
}

export async function getUserWalletByAddress(publicAddress: string) {
  return await db
    .select()
    .from(userWallets)
    .where(eq(sql`lower(${userWallets.address})`, publicAddress.toLowerCase()))
    .limit(1);
}
