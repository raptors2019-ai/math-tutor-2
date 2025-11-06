'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';

/**
 * Completion page - celebration screen after completing all 3 lessons.
 * Shows confetti, achievement badges, and share options.
 */
export default function CompletionPage() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Handle resize
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Math Tutor AI',
          text: 'I just completed all 3 math lessons! 🎉',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `I just completed all 3 math lessons! ${window.location.href}`
      );
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-kid-pink-400 via-kid-purple-300 to-kid-blue-500 px-4 py-8">
      {/* Confetti */}
      {windowSize.width > 0 && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Trophy */}
        <div className="animate-bounce text-9xl">🏆</div>

        {/* Title */}
        <div>
          <h1 className="mb-2 text-6xl font-bold text-white drop-shadow-lg">
            You Did It!
          </h1>
          <p className="text-3xl text-white drop-shadow-md">🎉 🎊 🎉</p>
        </div>

        {/* Subtitle */}
        <p className="max-w-md text-2xl font-bold text-white drop-shadow-md">
          You've Mastered All 3 Lessons!
        </p>

        {/* Achievement Cards */}
        <div className="mx-auto max-w-lg space-y-3 rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur">
          <h2 className="mb-6 text-center text-3xl font-bold text-kid-blue-700">
            Your Achievements 🌟
          </h2>

          <div className="space-y-4">
            {/* Badge 1 */}
            <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 p-4">
              <span className="text-5xl">🎯</span>
              <div className="text-left">
                <p className="text-xl font-bold text-yellow-900">
                  Make-10 Master
                </p>
                <p className="text-sm text-yellow-800">
                  You've learned the making 10 strategy!
                </p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 p-4">
              <span className="text-5xl">🎲</span>
              <div className="text-left">
                <p className="text-xl font-bold text-pink-900">
                  Doubles Expert
                </p>
                <p className="text-sm text-pink-800">
                  You've mastered doubles and near-doubles!
                </p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-100 to-cyan-100 p-4">
              <span className="text-5xl">🔍</span>
              <div className="text-left">
                <p className="text-xl font-bold text-blue-900">
                  Strategy Detective
                </p>
                <p className="text-sm text-blue-800">
                  You can choose the right strategy every time!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={handleShare}
            className="rounded-full bg-white px-8 py-4 text-xl font-bold text-kid-purple-600 shadow-lg hover:bg-gray-100 transition-colors"
          >
            Share Your Success 📱
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-full bg-white/80 px-8 py-4 text-xl font-bold text-kid-purple-600 shadow-lg hover:bg-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20">✨</div>
        <div className="absolute bottom-32 right-10 text-6xl opacity-20">⭐</div>
        <div className="absolute top-1/2 right-20 text-5xl opacity-10">🌟</div>
      </div>
    </div>
  );
}
