import React, { useState } from 'react';
import { PLANET_CLUE_QUESTS, PLANETS_DATA } from '../data/solarData';
import { PlanetClueQuest } from '../types/solar';
import { X, Search, CheckCircle2, AlertCircle, Compass, HelpCircle, Navigation, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface MissionMysteryProps {
  onClose: () => void;
  onMissionComplete: (missionKey: 'mystery', rewardExp: number, rewardCoins: number) => void;
  onFlyToPlanet: (planetId: string) => void;
  isAlreadyCompleted: boolean;
}

export const MissionMystery: React.FC<MissionMysteryProps> = ({
  onClose,
  onMissionComplete,
  onFlyToPlanet,
  isAlreadyCompleted
}) => {
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('');
  const [revealedClues, setRevealedClues] = useState<number>(1);
  const [showFollowUp, setShowFollowUp] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);

  const quest = PLANET_CLUE_QUESTS[currentQuestIndex];

  const handleGuessPlanet = (planetId: string) => {
    sound.playClick();
    setSelectedPlanetId(planetId);

    if (planetId === quest.targetPlanetId) {
      sound.playCorrect();
      setFeedbackMessage({
        type: 'success',
        text: `ถูกต้อง! เป้าหมายคือ "${PLANETS_DATA.find(p => p.id === planetId)?.thaiName}"!`
      });
      setShowFollowUp(true);
    } else {
      sound.playWrong();
      setFeedbackMessage({
        type: 'error',
        text: 'ยังไม่ใช่ดาวดวงนี้! ลองอ่านคำใบ้เพิ่มเติม หรือนึกถึงลักษณะเฉพาะของดาว'
      });
    }
  };

  const handleAnswerFollowUp = (optionIndex: number) => {
    sound.playClick();
    setSelectedOption(optionIndex);

    if (optionIndex === quest.followUpQuestion.correctIndex) {
      sound.playCorrect();
      setIsAnsweredCorrectly(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

      const newCompleted = [...completedQuestIds, quest.id];
      setCompletedQuestIds(newCompleted);

      // Check if all quests are finished
      if (newCompleted.length === PLANET_CLUE_QUESTS.length) {
        sound.playMissionComplete();
        onMissionComplete('mystery', 300, 150);
      }
    } else {
      sound.playWrong();
      setIsAnsweredCorrectly(false);
    }
  };

  const nextQuest = () => {
    sound.playClick();
    if (currentQuestIndex < PLANET_CLUE_QUESTS.length - 1) {
      setCurrentQuestIndex(prev => prev + 1);
      setSelectedPlanetId('');
      setRevealedClues(1);
      setShowFollowUp(false);
      setSelectedOption(null);
      setIsAnsweredCorrectly(false);
      setFeedbackMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-amber-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl text-slate-100 shadow-amber-950/50"
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
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase px-2 py-0.5 rounded bg-amber-950 border border-amber-500/50 text-amber-300 font-bold tracking-wider">
                ภารกิจที่ 2
              </span>
              <span className="text-xs text-slate-400 font-scifi">
                ปริศนาที่ {currentQuestIndex + 1} จาก {PLANET_CLUE_QUESTS.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-thai text-white mt-1">
              ภารกิจสำรวจดาว: {quest.title}
            </h2>
          </div>
        </div>

        {/* Riddle Card */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-800/80 to-slate-900 border border-amber-500/40 rounded-xl p-5 mb-5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>ปริศนาคำกลอนจากนักดาราศาสตร์:</span>
          </div>
          <p className="text-base sm:text-lg text-amber-100 font-thai italic leading-relaxed">
            "{quest.riddleText}"
          </p>

          {/* Clues */}
          <div className="mt-4 pt-3 border-t border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-300 font-medium font-thai">
                คำใบ้ทางวิทยาศาสตร์ ({revealedClues}/{quest.clues.length}):
              </span>
              {revealedClues < quest.clues.length && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setRevealedClues(prev => prev + 1);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  + ปลดล็อกคำใบ้ถัดไป
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              {quest.clues.slice(0, revealedClues).map((clue, idx) => (
                <div key={idx} className="text-xs sm:text-sm text-slate-200 flex items-center gap-2 font-thai">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{clue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className={`p-3.5 rounded-xl mb-5 flex items-center gap-2.5 text-sm ${
            feedbackMessage.type === 'success' 
              ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200' 
              : 'bg-rose-950/60 border border-rose-500/50 text-rose-200'
          }`}>
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Planet Selection Grid (Guess target) */}
        {!showFollowUp && (
          <div className="mb-6">
            <label className="block text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2.5">
              เลือกดาวเคราะห์ที่เป็นคำตอบของปริศนานี้:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PLANETS_DATA.filter(p => p.id !== 'sun').map(planet => (
                <button
                  key={planet.id}
                  onClick={() => handleGuessPlanet(planet.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedPlanetId === planet.id
                      ? 'bg-amber-600/30 border-amber-400 scale-102'
                      : 'bg-slate-800/60 border-slate-700 hover:border-amber-500/40 hover:bg-slate-800'
                  }`}
                >
                  <div 
                    className="w-7 h-7 rounded-full shadow-md"
                    style={{ backgroundColor: planet.color }}
                  />
                  <span className="text-sm font-bold text-white font-thai">{planet.thaiName}</span>
                  <span className="text-xs text-slate-400 font-scifi">{planet.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up Question Stage */}
        {showFollowUp && (
          <div className="bg-slate-800/80 border border-emerald-500/40 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                คำถามตรวจสอบความรู้เชิงลึก ม.6
              </span>
              <button
                onClick={() => {
                  sound.playSelect();
                  onFlyToPlanet(quest.targetPlanetId);
                  onClose();
                }}
                className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                <Navigation className="w-3.5 h-3.5" />
                บินสำรวจดาวดวงนี้ในฉาก 3D
              </button>
            </div>

            <p className="text-sm sm:text-base font-bold text-white mb-4 font-thai">
              {quest.followUpQuestion.question}
            </p>

            <div className="space-y-2 mb-4">
              {quest.followUpQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === quest.followUpQuestion.correctIndex;
                let btnStyle = 'bg-slate-700/60 border-slate-600 hover:bg-slate-700';

                if (selectedOption !== null) {
                  if (isCorrect) btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                  else if (isSelected) btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswerFollowUp(idx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all font-thai flex items-start gap-2.5 ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-700 text-xs text-slate-300 leading-relaxed font-thai">
                💡 <strong className="text-white">คำอธิบายทางวิทยาศาสตร์:</strong> {quest.followUpQuestion.rationale}
              </div>
            )}
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-thai">
            ความคืบหน้า: {completedQuestIds.length} / {PLANET_CLUE_QUESTS.length} ปริศนา
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium"
            >
              ปิด
            </button>

            {isAnsweredCorrectly && currentQuestIndex < PLANET_CLUE_QUESTS.length - 1 && (
              <button
                onClick={nextQuest}
                className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-600/30 transition-all hover:scale-105"
              >
                ปริศนาถัดไป →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
