import { PrismaClient } from "@prisma/client";
import curriculum from "../lib/content.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding curriculum data...");

  // Clear existing data
  await prisma.sessionResponse.deleteMany();
  await prisma.session.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.lessonItem.deleteMany();
  await prisma.subLesson.deleteMany();
  await prisma.lesson.deleteMany();

  // Seed lessons
  for (const lessonData of curriculum.lessons) {
    const lesson = await prisma.lesson.create({
      data: {
        order: lessonData.order,
        title: lessonData.title,
        description: lessonData.description,
        strategyTag: lessonData.strategyTag,
      },
    });

    console.log(`✅ Created lesson: ${lesson.title}`);

    // Seed sub-lessons
    for (const subLessonData of lessonData.subLessons) {
      const subLesson = await prisma.subLesson.create({
        data: {
          lessonId: lesson.id,
          title: subLessonData.title,
          description: subLessonData.description,
          order: subLessonData.order,
          diagnosticPrompt: subLessonData.diagnosticPrompt,
        },
      });

      console.log(`   📖 Created sub-lesson: ${subLesson.title}`);
    }

    // Seed lesson items
    for (const itemData of lessonData.items) {
      await prisma.lessonItem.create({
        data: {
          lessonId: lesson.id,
          question: itemData.question,
          answer: itemData.answer,
          strategyTag: itemData.strategyTag,
          order: itemData.order,
        },
      });
    }

    console.log(
      `   ✓ Created ${lessonData.items.length} items for ${lesson.title}`
    );
  }

  console.log("\n✅ Curriculum seeded successfully!");
  console.log("📊 Summary:");
  console.log(
    `   - ${curriculum.lessons.length} lessons created`
  );
  console.log(
    `   - ${curriculum.lessons.reduce((acc, l) => acc + l.subLessons.length, 0)} sub-lessons created`
  );
  console.log(
    `   - ${curriculum.lessons.reduce((acc, l) => acc + l.items.length, 0)} lesson items created`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
