import React, { useState } from 'react';
import { CLASSIFICATION_ITEMS } from '../data/solarData';
import { ClassificationItem } from '../types/solar';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

type CategoryKey = 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf' | 'small_body';

interface CategoryConfig {
  key: CategoryKey;
  titleThai: string;
  titleEng: string;
  color: string;
  borderColor: string;
  bgLight: string;
  definition: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'terrestrial',
    titleThai: 'ดาวเคราะห์หิน',
    titleEng: 'Terrestrial Planets',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgLight: 'bg-amber-950/20',
    definition: 'มีพื้นผิวแข็งเป็นหินและโลหะ อยู่ในเส้นน้ำแข็ง'
  },
  {
    key: 'gas_giant',
    titleThai: 'ดาวเคราะห์แก๊สยักษ์',
    titleEng: 'Gas Giants',
    color: 'text-orange-400',
    borderColor: 'border-orange-500/40',
    bgLight: 'bg-orange-950/20',
    definition: 'มวลมหาศาล องค์ประกอบหลักคือ H และ He'
  },
  {
    key: 'ice_giant',
    titleThai: 'ดาวเคราะห์น้ำแข็งยักษ์',
    titleEng: 'Ice Giants',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    bgLight: 'bg-cyan-950/20',
    definition: 'แมนเทิลอุดมด้วยน้ำแข็งน้ำ แอมโมเนีย มีเทน'
  },
  {
    key: 'dwarf',
    titleThai: 'ดาวเคราะห์แคระ',
    titleEng: 'Dwarf Planets',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    bgLight: 'bg-purple-950/20',
    definition: 'ทรงกลม โคจรรอบดวงอาทิตย์ แต่วงโคจรไม่ปลอดโปร่ง'
  },
  {
    key: 'small_body',
    titleThai: 'วัตถุขนาดเล็ก',
    titleEng: 'Small Solar System Bodies',
    color: 'text-slate-300',
    borderColor: 'border-slate-500/40',
    bgLight: 'bg-slate-800/30',
    definition: 'ดาวเคราะห์น้อย ดาวหาง สะเก็ดดาว'
  }
];

interface MissionClassificationProps {
  onClose: () => void;
  onMissionComplete: (missionKey: 'classification', rewardExp: number, rewardCoins: number) => void;
  isAlreadyCompleted: boolean;
}

export const MissionClassification: React.FC<MissionClassificationProps> = ({
  onClose,
  onMissionComplete,
  isAlreadyCompleted
}) => {
  const [unplacedItems, setUnplacedItems] = useState<ClassificationItem[]>(() => [...CLASSIFICATION_ITEMS].sort(() => Math.random() - 0.5));
  const [placedItems, setPlacedItems] = useState<Record<CategoryKey, ClassificationItem[]>>({
    terrestrial: [],
    gas_giant: [],
    ice_giant: [],
    dwarf: [],
    small_body: []
  });
  const [selectedItem, setSelectedItem] = useState<ClassificationItem | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handlePlaceIntoCategory = (catKey: CategoryKey) => {
    if (!selectedItem) return;

    if (selectedItem.category === catKey) {
      sound.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);

      setPlacedItems(prev => ({
        ...prev,
        [catKey]: [...prev[catKey], selectedItem]
      }));

      const remaining = unplacedItems.filter(i => i.id !== selectedItem.id);
      setUnplacedItems(remaining);
      setSelectedItem(null);
      setFeedback({
        message: `ถูกต้อง! "${selectedItem.thaiName}" คือ ${CATEGORIES.find(c => c.key === catKey)?.titleThai} (${newStreak}x Combo!)`,
        isError: false
      });

      if (remaining.length === 0) {
        sound.playMissionComplete();
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        onMissionComplete('classification', 300, 150);
      }
    } else {
      sound.playWrong();
      setStreak(0);
      setFeedback({
        message: `ยังไม่ถูกต้อง! "${selectedItem.thaiName}" ไม่ใช่ ${CATEGORIES.find(c => c.key === catKey)?.titleThai} (คำใบ้: ${selectedItem.hint})`,
        isError: true
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-purple-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl text-slate-100 shadow-purple-950/50"
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase px-2 py-0.5 rounded bg-purple-950 border border-purple-500/50 text-purple-300 font-bold tracking-wider">
                  ภารกิจที่ 4
                </span>
                {isAlreadyCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    ✓ สำเร็จแล้ว
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-thai text-white mt-1">
                จัดประเภทวัตถุในระบบสุริยะตามนิยาม IAU & หลักสูตร ม.6
              </h2>
            </div>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 font-bold font-scifi text-sm">
              <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
              <span>{streak}x STREAK</span>
            </div>
          )}
        </div>

        {/* Instruction */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 mb-4 text-xs sm:text-sm text-slate-300 font-thai">
          <strong className="text-white">วิธีเล่น:</strong> คลิกเลือกวัตถุอวกาศจากแถบด้านบน แล้วกดเลือก "กล่องหมวดหมู่" ด้านล่างให้ถูกต้องตามเกณฑ์วิทยาศาสตร์
        </div>

        {/* Feedback message banner */}
        {feedback && (
          <div className={`p-3 rounded-xl mb-4 text-xs sm:text-sm flex items-center gap-2 font-thai ${
            feedback.isError 
              ? 'bg-rose-950/70 border border-rose-500/50 text-rose-200' 
              : 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
          }`}>
            {feedback.isError ? <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Unplaced Items Pool */}
        <div className="mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              วัตถุที่รอจัดหมวดหมู่ ({unplacedItems.length} ชิ้น):
            </span>
            {selectedItem && (
              <span className="text-xs text-purple-400 font-thai">
                กำลังเลือก: <strong className="text-white">{selectedItem.thaiName}</strong>
              </span>
            )}
          </div>

          {unplacedItems.length === 0 ? (
            <div className="py-6 text-center text-emerald-300 font-bold font-thai">
              🎉 ยอดเยี่ยม! จัดหมวดหมู่วัตถุครบถ้วนทุกรายการแล้ว!
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {unplacedItems.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedItem(item);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-thai font-semibold border transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-400 scale-105 shadow-lg shadow-purple-600/30'
                        : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:border-purple-500/40 hover:bg-slate-700'
                    }`}
                  >
                    <span>{item.thaiName}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5 Category Drop Bins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {CATEGORIES.map(cat => {
            const placed = placedItems[cat.key];
            return (
              <div
                key={cat.key}
                onClick={() => selectedItem && handlePlaceIntoCategory(cat.key)}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${cat.borderColor} ${cat.bgLight} ${
                  selectedItem ? 'cursor-pointer hover:border-white hover:scale-101' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className={`font-bold font-thai text-base ${cat.color}`}>{cat.titleThai}</h4>
                      <span className="text-[11px] text-slate-400 font-scifi block">{cat.titleEng}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900/80 font-bold text-slate-300 border border-slate-700">
                      {placed.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-thai mb-3">
                    {cat.definition}
                  </p>

                  {/* Placed Items in this category */}
                  <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                    {placed.map(p => (
                      <span
                        key={p.id}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 text-white border border-slate-700/60 font-thai flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {p.thaiName}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedItem && (
                  <button 
                    onClick={() => handlePlaceIntoCategory(cat.key)}
                    className="mt-3 w-full py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-thai font-semibold text-white border border-slate-600 transition-colors"
                  >
                    วางไว้ที่นี่
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-thai">
            รางวัลภารกิจ: <span className="text-amber-400 font-bold">+300 EXP</span>, <span className="text-yellow-400 font-bold">+150 Coins</span>
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
