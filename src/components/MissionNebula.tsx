import React, { useState } from 'react';
import { NEBULAR_STAGES } from '../data/solarData';
import { NebularStage } from '../types/solar';
import { X, ArrowUp, ArrowDown, CheckCircle2, AlertCircle, Sparkles, BookOpen, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface MissionNebulaProps {
  onClose: () => void;
  onMissionComplete: (missionKey: 'nebula', rewardExp: number, rewardCoins: number) => void;
  isAlreadyCompleted: boolean;
}

export const MissionNebula: React.FC<MissionNebulaProps> = ({
  onClose,
  onMissionComplete,
  isAlreadyCompleted
}) => {
  // Start with shuffled stages
  const [stages, setStages] = useState<NebularStage[]>(() => {
    return [...NEBULAR_STAGES].sort(() => Math.random() - 0.5);
  });

  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    hints?: string[];
  }>({ status: 'idle', message: '' });

  const moveStage = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStages.length) return;

    const temp = newStages[index];
    newStages[index] = newStages[targetIndex];
    newStages[targetIndex] = temp;
    setStages(newStages);
    setFeedback({ status: 'idle', message: '' });
  };

  const checkOrder = () => {
    const isCorrect = stages.every((s, idx) => s.correctOrder === idx + 1);

    if (isCorrect) {
      sound.playMissionComplete();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setFeedback({
        status: 'success',
        message: 'ยอดเยี่ยมมาก! คุณเรียงลำดับเหตุการณ์การกำเนิดระบบสุริยะตามสมมติฐานเนบิวลาได้ถูกต้อง 100%'
      });
      onMissionComplete('nebula', 250, 120);
    } else {
      sound.playWrong();
      // Generate scientific hint
      const hints: string[] = [];
      stages.forEach((s, idx) => {
        if (s.correctOrder !== idx + 1) {
          if (s.correctOrder === 1 && idx > 0) {
            hints.push('💡 "การยุบตัวของเนบิวลาสุริยะ" ต้องเป็นจุดเริ่มต้นแรกสุดของการกำเนิด');
          } else if (s.correctOrder === 5 && idx < 4) {
            hints.push('💡 "ลมสุริยะพัดเป่าแก๊สส่วนเกิน" เกิดขึ้นหลังสุดเมื่อดาวเคราะห์ก่อตัวเสร็จสิ้นแล้ว');
          } else if (s.correctOrder === 3 && idx > 3) {
            hints.push('💡 "เส้นน้ำแข็ง (Frost Line)" มีบทบาทตั้งแต่ก่อนที่วัตถุเค้าดาวเคราะห์จะสะสมตัว');
          }
        }
      });
      if (hints.length === 0) {
        hints.push('💡 สังเกตช่วงเวลาทางธรณีวิทยา (~4.6 -> ~4.5 พันล้านปีก่อน)');
      }

      setFeedback({
        status: 'error',
        message: 'ลำดับเหตุการณ์ยังไม่ถูกต้อง ลองพิจารณาคำใบ้ทางวิทยาศาสตร์ด้านล่างนี้',
        hints: Array.from(new Set(hints))
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl text-slate-100 shadow-indigo-950/50"
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

        {/* Mission Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/50 text-indigo-300 font-bold tracking-wider">
                ภารกิจที่ 1
              </span>
              {isAlreadyCompleted && (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> สำเร็จแล้ว
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold font-thai text-white mt-1">
              กำเนิดระบบสุริยะ: สมมติฐานเนบิวลา (Nebular Hypothesis)
            </h2>
          </div>
        </div>

        {/* Instruction */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5 mb-5 text-sm text-slate-300 leading-relaxed font-thai">
          <p>
            🔭 <strong className="text-white">คำสั่งภารกิจ:</strong> ใช้ปุ่มลูกศรขึ้น-ลงเพื่อเรียงลำดับขั้นตอนการกำเนิดระบบสุริยะตามเวลาจริง จากขั้นตอนแรกสุด (4.6 พันล้านปีก่อน) ไปยังขั้นตอนสุดท้ายเมื่อระบบสุริยะเข้าสู่ภาวะเสถียร
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback.status === 'success' && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{feedback.message}</span>
            </div>
            <p className="text-xs text-emerald-300/90 mt-1 font-thai">
              🎉 ได้รับ +250 EXP และ +120 Space Coins! ได้เรียนรู้การยุบตัวของเนบิวลา จานดาวเคราะห์ และเส้นน้ำแข็ง
            </p>
          </div>
        )}

        {feedback.status === 'error' && (
          <div className="mb-5 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200">
            <div className="flex items-center gap-2 font-bold mb-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>{feedback.message}</span>
            </div>
            {feedback.hints && feedback.hints.length > 0 && (
              <ul className="space-y-1 text-xs text-rose-300">
                {feedback.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Stages Reordering List */}
        <div className="space-y-3 mb-6">
          {stages.map((stage, idx) => {
            const isCorrectPosition = feedback.status === 'success' || stage.correctOrder === idx + 1;
            return (
              <div 
                key={stage.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  feedback.status === 'success'
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-800/70 border-slate-700 hover:border-indigo-500/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    feedback.status === 'success'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-white font-thai">
                        {stage.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-scifi">
                        {stage.timeframe}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 font-thai leading-relaxed">
                      {stage.description}
                    </p>
                    {feedback.status === 'success' && (
                      <p className="text-xs text-indigo-300 mt-1.5 font-thai bg-indigo-950/40 p-2 rounded border border-indigo-500/20">
                        📖 <strong className="text-indigo-200">เจาะลึก ม.6:</strong> {stage.scientificDetail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Move buttons */}
                {feedback.status !== 'success' && (
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => moveStage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 text-slate-200 transition-colors"
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveStage(idx, 'down')}
                      disabled={idx === stages.length - 1}
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 text-slate-200 transition-colors"
                      title="เลื่อนลง"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-thai">
            รางวัลภารกิจ: <span className="text-amber-400 font-bold">+250 EXP</span>, <span className="text-yellow-400 font-bold">+120 Coins</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              ปิด
            </button>

            {feedback.status !== 'success' && (
              <button
                onClick={checkOrder}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ตรวจสอบลำดับ</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
