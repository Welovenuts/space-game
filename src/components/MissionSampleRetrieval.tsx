import React, { useState } from 'react';
import { SPACE_SAMPLES } from '../data/solarData';
import { SpaceSample } from '../types/solar';
import { 
  X, 
  FlaskConical, 
  CheckCircle2, 
  Navigation, 
  Sparkles, 
  Radio, 
  Atom,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface MissionSampleRetrievalProps {
  onClose: () => void;
  collectedSampleIds: string[];
  activeSampleForLab: SpaceSample | null;
  onAnswerLabQuiz: (sampleId: string, isCorrect: boolean) => void;
  onMissionComplete: (missionKey: 'samples', rewardExp: number, rewardCoins: number) => void;
  isAlreadyCompleted: boolean;
}

export const MissionSampleRetrieval: React.FC<MissionSampleRetrievalProps> = ({
  onClose,
  collectedSampleIds,
  activeSampleForLab,
  onAnswerLabQuiz,
  onMissionComplete,
  isAlreadyCompleted
}) => {
  const [selectedSample, setSelectedSample] = useState<SpaceSample>(
    activeSampleForLab || SPACE_SAMPLES[0]
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredMap, setAnsweredMap] = useState<Record<string, boolean>>({});

  const isCollected = collectedSampleIds.includes(selectedSample.id);
  const isAnswered = answeredMap[selectedSample.id];

  const handleSelectOption = (idx: number) => {
    sound.playClick();
    setSelectedOption(idx);
    const correct = idx === selectedSample.quiz.correctIndex;

    if (correct) {
      sound.playCorrect();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      setAnsweredMap(prev => ({ ...prev, [selectedSample.id]: true }));
      onAnswerLabQuiz(selectedSample.id, true);

      // Check if all samples collected and answered
      if (collectedSampleIds.length >= 4 && !isAlreadyCompleted) {
        sound.playMissionComplete();
        onMissionComplete('samples', 350, 180);
      }
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl text-slate-100 shadow-emerald-950/50"
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

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold tracking-wider">
                ภารกิจที่ 3
              </span>
              <span className="text-xs text-slate-400 font-scifi">
                เก็บแล้ว {collectedSampleIds.length} / {SPACE_SAMPLES.length} ชิ้น
              </span>
              {isAlreadyCompleted && (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-medium">
                  ✓ สำเร็จสมบูรณ์
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-thai text-white mt-1">
              ภารกิจเก็บตัวอย่างอวกาศ & ห้องแล็บสเปกโตรมิเตอร์
            </h2>
          </div>
        </div>

        {/* How to play hint */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 mb-5 text-xs sm:text-sm text-slate-300 flex items-start gap-3 font-thai">
          <Radio className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <strong className="text-white">คำแนะนำการบินสำรวจ:</strong> ขับยานอวกาศของคุณในฉาก 3D (ใช้ปุ่ม W/A/S/D หรือหน้าจอสัมผัส) มุ่งหน้าไปยังตำแหน่งของสัญญาณเรดาร์ เมื่อเข้าใกล้วัตถุเรืองแสงในระยะ 6 หน่วย ตัวอย่างจะถูกเก็บเข้าสู่ห้องแล็บเพื่อการวิเคราะห์โดยอัตโนมัติ
          </div>
        </div>

        {/* Grid layout: Sample Picker List (Left) + Laboratory Analysis (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
          {/* Sample Cards List */}
          <div className="md:col-span-5 space-y-2.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              รายการตัวอย่างสสารในระบบสุริยะ:
            </label>
            {SPACE_SAMPLES.map(sample => {
              const collected = collectedSampleIds.includes(sample.id);
              const isSelected = selectedSample.id === sample.id;

              return (
                <div
                  key={sample.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedSample(sample);
                    setSelectedOption(null);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-400 shadow-md'
                      : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: sample.color }}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white font-thai">{sample.thaiName}</h4>
                        <p className="text-xs text-slate-400 font-scifi">{sample.originLocation}</p>
                      </div>
                    </div>

                    {collected ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-medium shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> เก็บแล้ว
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-400 font-medium shrink-0 flex items-center gap-1">
                        <Radio className="w-3 h-3 text-cyan-400" /> รอเก็บในฉาก
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Laboratory Analysis Panel */}
          <div className="md:col-span-7 bg-slate-800/90 border border-slate-700 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Atom className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white font-thai">
                  ผลการสแกนสเปกโตรสโกปี (Spectroscopy)
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {selectedSample.id}
              </span>
            </div>

            {/* Scientific Breakdown */}
            <div className="space-y-3 mb-5 text-xs sm:text-sm font-thai">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-xs mb-0.5">สารประกอบทางเคมีที่ตรวจพบ:</span>
                <span className="text-white font-semibold">{selectedSample.scientificAnalysis.composition}</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-xs mb-0.5">ยุคสมัยการก่อตัว:</span>
                <span className="text-cyan-300 font-semibold">{selectedSample.scientificAnalysis.formationEra}</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-xs mb-0.5">ความสำคัญทางดาราศาสตร์ฟิสิกส์:</span>
                <span className="text-slate-200 leading-relaxed">{selectedSample.scientificAnalysis.significance}</span>
              </div>
            </div>

            {/* Scientific Analysis Question */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>แบบทดสอบวิเคราะห์สสาร ม.6:</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white mb-3 font-thai">
                {selectedSample.quiz.question}
              </p>

              <div className="space-y-2">
                {selectedSample.quiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === selectedSample.quiz.correctIndex;
                  let style = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200';

                  if (selectedOption !== null || isAnswered) {
                    if (isCorrect) style = 'bg-emerald-900/80 border-emerald-500 text-emerald-200';
                    else if (isSelected) style = 'bg-rose-900/80 border-rose-500 text-rose-200';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered || selectedOption !== null}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs font-thai flex items-start gap-2 transition-all ${style}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {(selectedOption !== null || isAnswered) && (
                <div className="mt-3 p-3 rounded bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 font-thai leading-relaxed">
                  💡 <strong className="text-emerald-300">เฉลย:</strong> {selectedSample.quiz.rationale}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-thai">
            รางวัลภารกิจรวม: <span className="text-amber-400 font-bold">+350 EXP</span>, <span className="text-yellow-400 font-bold">+180 Coins</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
