import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/solarData';
import { QuizQuestion } from '../types/solar';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Award, 
  BookOpen, 
  Lightbulb, 
  ChevronRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface QuizModalProps {
  onClose: () => void;
  onQuizFinished: (score: number, maxScore: number, streak: number) => void;
  bestScore: number;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  onClose,
  onQuizFinished,
  bestScore
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [quizDone, setQuizDone] = useState<boolean>(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedOption = selectedAnswers[currentQ.id];
  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && selectedOption === currentQ.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    sound.playClick();
    const newSelected = { ...selectedAnswers, [currentQ.id]: idx };
    setSelectedAnswers(newSelected);

    if (idx === currentQ.correctIndex) {
      sound.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      if (newStreak % 5 === 0) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      }
    } else {
      sound.playWrong();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick();
    setShowHint(false);
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate final score
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) score++;
    });

    setQuizDone(true);
    sound.playMissionComplete();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    onQuizFinished(score, QUIZ_QUESTIONS.length, highestStreak);
  };

  const resetQuiz = () => {
    sound.playClick();
    setSelectedAnswers({});
    setCurrentIndex(0);
    setStreak(0);
    setHighestStreak(0);
    setShowHint(false);
    setQuizDone(false);
  };

  // Grade calculation
  const totalCorrect = Object.entries(selectedAnswers).filter(
    ([id, ans]) => QUIZ_QUESTIONS.find(q => q.id === Number(id))?.correctIndex === ans
  ).length;

  const percentage = Math.round((totalCorrect / QUIZ_QUESTIONS.length) * 100);

  let grade = 'C';
  let gradeColor = 'text-amber-400';
  let gradeComment = 'ควรทบทวนสมมติฐานเนบิวลาและนิยามดาวเคราะห์เพิ่มเติม';
  if (totalCorrect >= 18) {
    grade = 'A+';
    gradeColor = 'text-emerald-400';
    gradeComment = 'ยอดเยี่ยมระดับผู้เชี่ยวชาญดาราศาสตร์ฟิสิกส์ ม.6!';
  } else if (totalCorrect >= 15) {
    grade = 'A';
    gradeColor = 'text-cyan-400';
    gradeComment = 'เข้าใจแนวคิดหลักของดาราศาสตร์ระบบสุริยะได้อย่างดีเยี่ยม';
  } else if (totalCorrect >= 12) {
    grade = 'B';
    gradeColor = 'text-blue-400';
    gradeComment = 'มีความรู้พื้นฐานแน่นหนา มีบางจุดที่สามารถทบทวนเพิ่มเติมได้';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm pointer-events-auto">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-blue-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl text-slate-100 shadow-blue-950/50"
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!quizDone ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/50 text-blue-300 font-bold tracking-wider">
                    แบบทดสอบมาตรฐาน ม.6
                  </span>
                  <span className="text-xs text-slate-400 font-scifi">
                    หมวด: {currentQ.topic}
                  </span>
                </div>
                <h2 className="text-xl font-bold font-thai text-white mt-1">
                  คลังข้อสอบดาราศาสตร์และอวกาศ ม.6
                </h2>
              </div>

              {streak > 1 && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950 border border-orange-500/50 text-orange-300 font-bold font-scifi text-xs">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{streak}x STREAK</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-scifi">
                <span>ข้อที่ {currentIndex + 1} จาก {QUIZ_QUESTIONS.length}</span>
                <span>ตอบแล้ว {Object.keys(selectedAnswers).length}/{QUIZ_QUESTIONS.length} ข้อ</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-5 mb-5 shadow-md">
              <div className="text-base sm:text-lg font-bold text-white font-thai leading-relaxed mb-4">
                {currentIndex + 1}. {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isThisSelected = selectedOption === idx;
                  const isThisCorrect = idx === currentQ.correctIndex;
                  let btnClass = 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      btnClass = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-medium';
                    } else if (isThisSelected) {
                      btnClass = 'bg-rose-950/90 border-rose-500 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-thai transition-all flex items-start gap-3 ${btnClass}`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isAnswered && isThisCorrect 
                          ? 'bg-emerald-500 text-white' 
                          : isAnswered && isThisSelected 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hint button */}
              {!isAnswered && (
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowHint(!showHint);
                    }}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-thai"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'ซ่อนคำใบ้' : 'ขอคำใบ้แนวคิด'}</span>
                  </button>
                </div>
              )}

              {showHint && !isAnswered && (
                <div className="mt-3 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 font-thai leading-relaxed">
                  💡 <strong>คำใบ้:</strong> {currentQ.hint}
                </div>
              )}
            </div>

            {/* Answer Explanation Box (Appears after answer) */}
            {isAnswered && (
              <div className="mb-5 p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  {isCorrect ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-thai">
                      <CheckCircle2 className="w-4 h-4" /> ตอบถูกต้อง!
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-thai">
                      <AlertCircle className="w-4 h-4" /> ตอบผิด คำตอบที่ถูกต้องคือ ({String.fromCharCode(65 + currentQ.correctIndex)})
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-300 font-thai leading-relaxed">
                  📖 <strong className="text-white">คำอธิบายทางวิทยาศาสตร์:</strong> {currentQ.scientificRationale}
                </div>

                <div className="text-[11px] text-cyan-400 font-mono pt-1">
                  🎯 {currentQ.curriculumPoint}
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-thai">
                คะแนนปัจจุบัน: <strong className="text-cyan-400">{totalCorrect}</strong> / {QUIZ_QUESTIONS.length}
              </span>

              <div className="flex gap-2">
                {isAnswered && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
                  >
                    <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'ข้อถัดไป' : 'ดูผลการสอบ'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Quiz Results Report */
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto mb-3">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold font-thai text-white">
                ผลการทดสอบดาราศาสตร์ ม.6
              </h2>
              <p className="text-xs text-slate-400 font-thai mt-1">
                การประเมินความรู้ระบบสุริยะตามมาตรฐานหลักสูตร
              </p>
            </div>

            {/* Score Showcase */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 text-center mb-6">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">
                คะแนนรวมที่คุณทำได้
              </div>
              <div className="text-5xl font-black font-scifi text-cyan-400 mb-1">
                {totalCorrect} <span className="text-2xl font-normal text-slate-400">/ {QUIZ_QUESTIONS.length}</span>
              </div>
              <div className="text-sm font-scifi text-slate-300 mb-3">
                ความถูกต้อง {percentage}%
              </div>

              {/* Grade Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700">
                <span className="text-xs text-slate-400 font-thai">เกรดประเมิน:</span>
                <span className={`text-xl font-bold font-scifi ${gradeColor}`}>{grade}</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-thai">
                {gradeComment}
              </p>
            </div>

            {/* EXP & Coin Rewards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-center">
                <span className="text-xs text-amber-300 block font-thai">ค่าประสบการณ์ (EXP)</span>
                <span className="text-xl font-bold font-scifi text-amber-400">+{totalCorrect * 20} EXP</span>
              </div>
              <div className="bg-yellow-950/30 border border-yellow-500/30 p-3 rounded-xl text-center">
                <span className="text-xs text-yellow-300 block font-thai">เหรียญอวกาศ (Coins)</span>
                <span className="text-xl font-bold font-scifi text-yellow-400">+{totalCorrect * 15} Coins</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ทำข้อสอบใหม่อีกครั้ง</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
