import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { and, eq, inArray, sql } from 'drizzle-orm';
import postgres from 'postgres';
import { referrals, users } from '../db/schema';

async function main() {
  const databaseUrl =
    process.env.NETLIFY_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'postgres://localhost:5432/idos_dev';
  const sqlClient = postgres(databaseUrl, { max: 1 });
  const db = drizzlePostgres(sqlClient);

  console.log('Starting referral recount transaction...');

  await db.transaction(async (tx) => {
    // 1) Build counts of users per referral code (excluding empty/null)
    const counts = await tx
      .select({
        referrerCode: users.referrerCode,
        cnt: sql<number>`COUNT(*)::int`,
      })
      .from(users)
      .where(
        sql`${users.referrerCode} IS NOT NULL AND ${users.referrerCode} <> ''`,
      )
      .groupBy(users.referrerCode);

    console.log(`Found ${counts.length} referral codes in users.`);

    // 2) Zero out all current referral counts to avoid stale overcounts
    await tx.update(referrals).set({ referralCount: 0 });

    if (counts.length === 0) {
      console.log('No referral codes to update.');
      return;
    }

    // 3) Update each referral's count by matching referrals.referralCode
    for (const row of counts) {
      await tx
        .update(referrals)
        .set({ referralCount: row.cnt })
        .where(eq(referrals.referralCode, row.referrerCode || ''));
    }
  });

  console.log('Referral recount completed successfully.');
  await sqlClient.end();
}

main().catch(async (err) => {
  console.error('Referral recount failed:', err);
  process.exitCode = 1;
});
