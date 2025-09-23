import { saveUserSchema } from '@/interfaces/user';
import { generateReferralCode, questsConfig } from '@/utils/quests';
import { count, eq } from 'drizzle-orm';
import crypto from 'node:crypto';
import { db, users } from './index';
import { getUserQuestsSummary } from './user-quests';

export async function saveUser(data: any, name: string) {
  const user = saveUserSchema.parse(data);
  return await db.insert(users).values({
    ...user,
    name,
  }).onConflictDoNothing();
}

export async function updateUser(data: any) {
  const user = saveUserSchema.parse(data);
  return await db.update(users).set(user).where(eq(users.id, user.id));
}

export async function setUserPopCredentialId(userId: string, credentialId: string) {
  return await db.update(users).set({
    popCredentialsId: credentialId,
  }).where(eq(users.id, userId));
}

export async function updateUserFaceSign(
  userId: string,
  faceSignUserId: string,
) {
  return await db
    .update(users)
    .set({
      faceSignUserId,
      faceSignToken: null,
      faceSignTokenCreatedAt: null,
    })
    .where(eq(users.id, userId));
}

export async function generateFaceScanToken(userId: string) {
  // Only for users without face-scans
  const user = await getUserById(userId).then((res) => res[0]);

  if (!user || user.faceSignUserId !== null || user.popCredentialsId) {
    throw new Error("This user can't do face sign.");
  }

  if (
    user.faceSignTokenCreatedAt &&
    user.faceSignToken &&
    new Date(user.faceSignTokenCreatedAt).getTime() > Date.now() - 30 * 60 * 1000
  ) {
    // Token is new and valid
    return user.faceSignToken;
  }

  const token = crypto.randomBytes(32).toString('hex');

  await db
    .update(users)
    .set({
      faceSignToken: token,
      faceSignTokenCreatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return token;
}

export function getUserById(userId: string) {
  return db.select().from(users).where(eq(users.id, userId));
}

export async function getUserReferralCount(
  referralCode: string,
): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.referrerCode, referralCode));

  return result[0].count;
}

export async function getUserPoints(userId: string): Promise<{
  questPoints: number;
  socialPoints: number;
  contributionPoints: number;
  totalPoints: number;
}> {
  const [questSummaries, user] = await Promise.all([
    getUserQuestsSummary(userId),
    getUserById(userId),
  ]);

  const getMultiplier = (count: number) => {
    if (count >= 1000) return 3;
    if (count >= 100) return 2.75;
    if (count >= 25) return 2.5;
    if (count >= 5) return 2;
    return 1;
  };

  const questLookup = new Map(questsConfig.map((quest) => [quest.name, quest]));

  let questPoints = questSummaries.reduce((points, summary) => {
    const quest = questLookup.get(summary.questName);
    if (quest) {
      points += quest.pointsReward * summary.completionCount;
    }
    return points;
  }, 0);

  if (user[0]?.id) {
    const referralCode = generateReferralCode(user[0].id);
    const referralCount = await getUserReferralCount(referralCode);
    const referralQuest = questLookup.get('referral_program');
    if (referralQuest && referralCount > 0) {
      questPoints += referralQuest.pointsReward * referralCount;
    }
    questPoints = Math.floor(questPoints * getMultiplier(referralCount));
  }

  questPoints = Math.floor(questPoints);
  const socialPoints = 0;
  const contributionPoints = 0;
  const totalPoints = questPoints + socialPoints + contributionPoints;

  return { questPoints, socialPoints, contributionPoints, totalPoints };
}

export async function saveUserCookieConsent(userId: string, accepted: boolean) {
  return await db
    .update(users)
    .set({
      cookieConsent: accepted,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function getUserCookieConsent(
  userId: string,
): Promise<boolean | null> {
  const result = await db
    .select({
      cookieConsent: users.cookieConsent,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (result.length === 0) {
    return null;
  }

  return result[0].cookieConsent;
}

export async function getUserByFaceSignToken(token: string) {
  const user = await db.select().from(users).where(eq(users.faceSignToken, token))
    .then(res => res[0]);

  if (!user) {
    return null;
  }

  // Check token validity (30 minutes)
  if (
    !user.faceSignTokenCreatedAt ||
    new Date(user.faceSignTokenCreatedAt).getTime() < Date.now() - 30 * 60 * 1000
  ) {
    return null;
  }

  return user;
}

export async function userNameExists(name: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.name, name))
    .limit(1);

  return !!result[0];
}
