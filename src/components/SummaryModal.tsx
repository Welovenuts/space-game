import React from 'react';
import { PlayerStats } from '../types/solar';
import { X, Award, BookOpen, CheckCircle2, Sparkles, Orbit, Compass, Atom } from 'lucide-react';
import { sound } from '../utils/audio';

interface SummaryModalProps {
  onClose: () => void;
  stats: PlayerStats;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  onClose,
  stats
}) => {
  const completedCount = Object.values(stats.completedMissions).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm pointer-events-auto">
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-thai text-white">
              สมุดบันทึกการเรียนรู้ดาราศาสตร์ ม.6 (Astronomy Learning Log)
            </h2>
            <p className="text-xs text-slate-400 font-thai">
              สรุปองค์ความรู้ระบบสุริยะตามหลักสูตรแกนกลาง สสวท. และผลสัมฤทธิ์ของผู้เล่น
            </p>
          </div>
        </div>

        {/* Player Achievement Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-thai block">ยศนักบินอวกาศ</span>
            <span className="text-sm sm:text-base font-bold font-thai text-cyan-400">{stats.rankTitle}</span>
          </div>

          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-thai block">เลเวล & EXP</span>
            <span className="text-sm sm:text-base font-bold font-scifi text-amber-400">Lv.{stats.level} ({stats.exp} EXP)</span>
          </div>

          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-thai block">ภารกิจสำเร็จ</span>
            <span className="text-sm sm:text-base font-bold font-scifi text-emerald-400">{completedCount} / 4 ด่าน</span>
          </div>

          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 font-thai block">คะแนนสอบสูงสุด</span>
            <span className="text-sm sm:text-base font-bold font-scifi text-blue-400">{stats.quizStats.bestScore} / 20 ข้อ</span>
          </div>
        </div>

        {/* 4 Core Scientific Pillars of Grade 12 Curriculum */}
        <div className="space-y-4 mb-6">
          <h3 className="font-bold text-white text-base font-thai flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>หัวใจสำคัญของบทเรียนดาราศาสตร์ระบบสุริยะ ม.6:</span>
          </h3>

          {/* Pillar 1 */}
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-sm text-cyan-300 font-thai mb-1.5">
              <Orbit className="w-4 h-4 text-cyan-400" />
              <span>1. การกำเนิดระบบสุริยะตามสมมติฐานเนบิวลา (Nebular Hypothesis)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-thai leading-relaxed">
              ระบบสุริยะเริ่มก่อตัวเมื่อประมาณ <strong>4.6 พันล้านปีก่อน</strong> จากการยุบตัวของเนบิวลาสุริยะด้วยแรงโน้มถ่วง มวลส่วนใหญ่ตกสู่ศูนย์กลางกลายเป็นดวงอาทิตย์ตั้งต้น (Protostar) ขณะที่มวลโดยรอบแผ่ออกเป็นจานหมุนวน (Protoplanetary disk) และเกิดการพอกพูนมวล (Accretion) ของวัตถุเค้าดาวเคราะห์ (Planetesimals)
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-300 font-thai mb-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>2. บทบาทของเส้นน้ำแข็ง (Frost Line / Snow Line)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-thai leading-relaxed">
              เส้นน้ำแข็งแบ่งเขตอุณหภูมิในจานเนบิวลา:
              <br />• <strong>ด้านในเส้นน้ำแข็ง (ใกล้ดวงอาทิตย์):</strong> อุณหภูมิสูง สารระเหยง่ายไม่ควบแน่น มีเฉพาะสารประกอบหินและเหล็กที่ทนความร้อนสูงสะสมตัวเป็น <em>ดาวเคราะห์หิน (Terrestrial Planets)</em>
              <br />• <strong>ด้านนอกเส้นน้ำแข็ง (ไกลดวงอาทิตย์):</strong> น้ำแข็งของน้ำ แอมโมเนีย มีเทน สามารถแข็งตัวได้ ทำให้มีมวลของแข็งสะสมตัวเป็นแกนขนาดมหึมา ดึงดูดแก๊ส H และ He รอบตัวกลายเป็น <em>ดาวเคราะห์แก๊สยักษ์ (Gas Giants)</em> และ <em>ดาวเคราะห์น้ำแข็งยักษ์ (Ice Giants)</em>
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-sm text-purple-300 font-thai mb-1.5">
              <Atom className="w-4 h-4 text-purple-400" />
              <span>3. นิยามดาวเคราะห์ของสหพันธ์ดาราศาสตร์สากล (IAU, 2006)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-thai leading-relaxed">
              การเป็นดาวเคราะห์ต้องผ่านเกณฑ์ 3 ข้อ:
              <br />1. โคจรรอบดวงอาทิตย์
              <br />2. มีมวลมากพอจนแรงโน้มถ่วงทำให้มีรูปร่างสมดุลเกือบเป็นทรงกลม (Hydrostatic equilibrium)
              <br />3. มีแรงโน้มถ่วงกวาดล้างและควบคุมวัตถุอื่นในละแวกวงโคจรได้หมด (Clearing the neighborhood)
              <br /><span className="text-rose-300 font-medium">* ดาวพลูโต และ ซีรีส ไม่ผ่านข้อ 3 จึงถูกจัดเป็น "ดาวเคราะห์แคระ (Dwarf Planet)"</span>
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-300 font-thai mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>4. ขอบเขตและโครงสร้างบริวารของระบบสุริยะ</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-thai leading-relaxed">
              เรียงลำดับจากในสู่ขอบนอก:
              <br />• ดาวเคราะห์หินชั้นใน (พุธ ศุกร์ โลก อังคาร)
              <br />• แถบดาวเคราะห์น้อยหลัก (Asteroid Belt) อยู่ระหว่างอังคารกับพฤหัสบดี
              <br />• ดาวเคราะห์ยักษ์ (พฤหัสบดี เสาร์ ยูเรนัส เนปจูน)
              <br />• แถบไคเปอร์ (Kuiper Belt) วงแหวนวัตถุน้ำแข็งและดาวเคราะห์แคระ (30 - 50 AU)
              <br />• เมฆออร์ต (Oort Cloud) ดงหมอกดาวหางทรงกลมขอบนอกสุด (2,000 - 100,000 AU)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
