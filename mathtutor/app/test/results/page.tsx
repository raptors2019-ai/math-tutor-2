'use client';

import { ResultsScreen } from '@/app/lesson/[id]/components/ResultsScreen';

export default function TestResultsPage() {
  return (
    <ResultsScreen
      masteryScore={75}
      passed={false}
      correctCount={7}
      totalCount={10}
      lessonId="lesson-2"
      allLessonsCompleted={false}
      personalizeFeedback="Great job working on your doubles and near-doubles, you're doing awesome! I noticed that sometimes you forgot to add that extra 1 or the remainder after making 10. Remember, when adding numbers like 8+5, make sure to count all the way to 13. Keep practicing and you'll get even better at it! You're a math superstar in the making!"
      recommendedSubLesson={{
        id: "sub-1-1",
        lessonId: "lesson-1",
        title: "Complements to 10 🧩",
        description: "Learn the pairs that make 10! Every number has a special friend that pairs with it to make exactly 10."
      }}
      nextLessonUnlocked={null}
      onRetry={() => console.log('retry')}
      onHome={() => console.log('home')}
    />
  );
}
