/**
 * SubLessonContent component - displays the sub-lesson explanation and content.
 */
export function SubLessonContent({ title }: { title: string }) {
  // Map sub-lesson titles to their content
  const contentMap: Record<string, { explanation: string; examples: string[] }> = {
    'Complements to 10 🧩': {
      explanation:
        'Every number has a special friend that pairs with it to make exactly 10. Once you know these pairs, adding becomes much easier!',
      examples: [
        '1 + 9 = 10',
        '2 + 8 = 10',
        '3 + 7 = 10',
        '4 + 6 = 10',
        '5 + 5 = 10',
      ],
    },
    'Splitting to Apply Make-10 ✂️': {
      explanation:
        'Now that you know the pairs, use them to solve harder problems! Split one number to help you make 10 first, then add what\'s left.',
      examples: [
        '7 + 8: Split 8 into 3 and 5. Make 10 with 7 + 3. Then add 10 + 5 = 15.',
        '9 + 4: Split 4 into 1 and 3. Make 10 with 9 + 1. Then add 10 + 3 = 13.',
      ],
    },
    'Basic Doubles Pairs 👯': {
      explanation:
        'Doubles are when you add a number to itself. They\'re super easy to remember because they follow a pattern!',
      examples: [
        '1 + 1 = 2',
        '2 + 2 = 4',
        '3 + 3 = 6',
        '4 + 4 = 8',
        '5 + 5 = 10',
      ],
    },
    'Adjusting for Near-Doubles ➕➖': {
      explanation:
        'When numbers are close (just 1 apart), start with the double you know, then adjust by 1.',
      examples: [
        '5 + 6 = (5 + 5) + 1 = 10 + 1 = 11',
        '7 + 8 = (7 + 7) + 1 = 14 + 1 = 15',
        '6 + 5 = (5 + 5) + 1 = 10 + 1 = 11',
      ],
    },
    'Strategy Comparison ⚖️': {
      explanation:
        'Both strategies are great! The trick is knowing which one is faster for each problem. When numbers are close, use doubles. When one number is 8 or 9, use make-10.',
      examples: [
        '6 + 7 → Numbers are close → Use doubles',
        '9 + 4 → 9 is close to 10 → Use make-10',
        '7 + 8 → Numbers are close → Use doubles',
        '8 + 3 → 8 is close to 10 → Use make-10',
      ],
    },
    'Mixed Practice Drills 🏃‍♀️': {
      explanation:
        'Now let\'s practice choosing the best strategy for each problem. Remember: doubles for close numbers, make-10 for 8 or 9!',
      examples: [
        'Look at the numbers',
        'Ask: Are they close together?',
        'Ask: Is one of them 8 or 9?',
        'Pick the fastest strategy!',
      ],
    },
    'Which Strategy Fits?': {
      explanation:
        'You now know two powerful strategies! The secret is picking the right one for each problem.',
      examples: [
        'Make-10: Best when one number is 8 or 9',
        'Doubles: Best when numbers are the same or close',
        'Some problems work both ways!',
      ],
    },
  };

  const content = contentMap[title] || {
    explanation: 'Let\'s review this topic!',
    examples: [],
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-6">
        <h3 className="mb-3 text-2xl font-bold text-kid-blue-700">
          What You'll Learn
        </h3>
        <p className="text-lg text-gray-700 leading-relaxed">
          {content.explanation}
        </p>
      </div>

      {content.examples.length > 0 && (
        <div>
          <h4 className="mb-3 text-xl font-bold text-kid-purple-600">
            Key Examples
          </h4>
          <ul className="space-y-2">
            {content.examples.map((example, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-1 text-2xl">✨</span>
                <span className="text-lg text-gray-700">{example}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
