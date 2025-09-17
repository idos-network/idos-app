import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { quests } from '../db/schema';
import questsData from '../quests.json';

interface QuestData {
  id: number;
  name: string;
  pointsReward: number;
  isActive: boolean;
  isRepeatable: boolean;
}

async function main() {
  const databaseUrl =
    process.env.NETLIFY_DATABASE_URL || 'postgres://localhost:5432/idos_dev';
  const sql = postgres(databaseUrl);
  const db = drizzlePostgres(sql);

  console.log('Starting quests population...');

  try {
    console.log('Clearing existing quests...');
    await db.delete(quests);

    console.log(`Inserting ${questsData.length} quests...`);

    const questsToInsert: QuestData[] = questsData.map((quest) => ({
      id: quest.id,
      name: quest.name,
      pointsReward: quest.pointsReward,
      isActive: quest.isActive,
      isRepeatable: quest.isRepeatable,
    }));

    await db.insert(quests).values(questsToInsert);

    console.log(`Successfully populated ${questsToInsert.length} quests:`);
    questsToInsert.forEach((quest) => {
      console.log(
        `  - ${quest.name} (ID: ${quest.id}, Points: ${quest.pointsReward}, Active: ${quest.isActive}, Repeatable: ${quest.isRepeatable})`,
      );
    });
  } catch (error) {
    console.error('Error populating quests:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
