import { db } from '@/db/index';
import { quests } from '@/db/schema';
import { questsConfig } from '@/db/quests';

async function seedQuests() {
  console.log('🌱 Starting quest seeding...');

  try {
    console.log(`📝 Upserting ${questsConfig.length} quests...`);

    const upsertedQuests = [];

    for (const questData of questsConfig) {
      const result = await db
        .insert(quests)
        .values({
          id: questData.id,
          name: questData.name,
          pointsReward: questData.pointsReward,
          isActive: questData.isActive,
        })
        .onConflictDoUpdate({
          target: quests.name,
          set: {
            pointsReward: questData.pointsReward,
            isActive: questData.isActive,
            updatedAt: new Date(),
          },
        })
        .returning();

      upsertedQuests.push(result[0]);
    }

    console.log('✅ Successfully upserted quests:');
    upsertedQuests.forEach((quest) => {
      const status = quest.isActive ? 'Active' : 'Inactive';
      console.log(
        `  - ${quest.name} (${quest.pointsReward} points) [${status}] [ID: ${quest.id}]`,
      );
    });

    console.log(
      `🎉 Seeding completed! Processed ${upsertedQuests.length} quests.`,
    );
  } catch (error) {
    console.error('❌ Error seeding quests:', error);
    process.exit(1);
  }
}

seedQuests()
  .then(() => {
    console.log('🏁 Seed script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed script failed:', error);
    process.exit(1);
  });
