import { db } from './connection';
import { userTokens } from './schema';
import { eq, sql } from 'drizzle-orm';

export async function getExistingToken(publicAddress: string) {
  return await db
    .select()
    .from(userTokens)
    .where(
      eq(sql`lower(${userTokens.publicAddress})`, publicAddress.toLowerCase()),
    )
    .limit(1);
}

export async function insertUserToken(
  userId: string,
  publicAddress: string,
  walletType: string,
  accessToken: string,
  refreshToken: string,
) {
  await db.insert(userTokens).values({
    userId,
    publicAddress,
    walletType,
    accessToken,
    refreshToken,
  });
}

export async function updateUserToken(
  userId: string,
  accessToken: string,
  refreshToken: string,
  existingTokenId: number,
) {
  return await db
    .update(userTokens)
    .set({
      userId,
      accessToken,
      refreshToken,
    })
    .where(eq(userTokens.id, existingTokenId));
}
