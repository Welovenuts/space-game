import React from 'react';
import { PlayerStats } from '../types/solar';
import { 
  Rocket, 
  Sparkles, 
  Coins, 
  Award, 
  BookOpen, 
  Search, 
  FlaskConical, 
  Layers, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ShieldCheck,
  CheckCircle2,
  Atom,
  Orbit
} from 'lucide-react';
import { sound } from '../utils/audio';

interface LobbyProps {
  stats: PlayerStats;
  onStartGame: () => void;
  onOpenMission: (missionId: 'nebula' | 'mystery' | 'samples' | 'classification') => void;
  onOpenQuiz: () => void;
  onOpenEncyclopedia: () => void;
  onOpenShop: () => void;
  onOpenSummary: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  stats,
  onStartGame,
  onOpenMission,
  onOpenQuiz,
  onOpenEncyclopedia,
  onOpenShop,
  onOpenSummary
}) => {
  const [isMuted, setIsMuted] = React.useState(() => sound.getMuted());

  const toggleSound = () => {
    const m = sound.toggleMute();
    setIsMuted(m);
  };

  const expPercentage = Math.min(100, Math.round((stats.exp / stats.expToNextLevel) * 100));

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden font-thai select-none">
      {/* Background Animated Deep Space Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Bar: Brand Logo & User Profile / Sound */}
      <header className="relative z-10 px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Orbit className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-scifi tracking-wider text-white">
              SOLAR SYSTEM EXPLORER
            </h1>
            <p className="text-xs text-cyan-400 font-thai">
              เกมสำรวจอวกาศและการเรียนรู้ระบบสุริยะ ม.6
            </p>
          </div>
        </div>

        {/* Currency & Audio control */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-950/60 border border-yellow-500/40 text-yellow-300 font-scifi font-bold text-xs sm:text-sm cursor-pointer hover:bg-yellow-950 transition-colors shadow-md"
            title="เปิดอู่ต่อยาน & ร้านวิจัย"
          >
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{stats.coins.toLocaleString()}</span>
          </div>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        {/* Hero Section: Astronaut Avatar & Level Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8">
          {/* Astronaut Hero Profile Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />

            <div className="flex items-center gap-5 mb-5">
              {/* Stylized 3D Astronaut Avatar Lockup */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-cyan-400/50 flex items-center justify-center shadow-xl shadow-cyan-950/50 shrink-0">
                {/* Astronaut Helmet Visor */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-cyan-300 shadow-inner flex items-center justify-center relative overflow-hidden border border-white/40">
                  {/* Visor Glare */}
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-white/40 rounded-full blur-xs" />
                  <Sparkles className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-600 text-[10px] font-scifi font-bold text-white shadow">
                  PILOT
                </div>
              </div>

              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-thai font-semibold">
                  {stats.rankTitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-thai text-white mt-1">
                  นักสำรวจอวกาศ ม.6
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-scifi">
                  <span>LEVEL {stats.level}</span>
                  <span>•</span>
                  <span>{stats.equippedShip.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* EXP Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1 font-scifi">
                <span>EXP ความชำนาญ</span>
                <span className="text-cyan-400">{stats.exp} / {stats.expToNextLevel} ({expPercentage}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${expPercentage}%` }}
                />
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">ภารกิจผ่าน</span>
                <span className="text-emerald-400 font-bold font-scifi text-sm">
                  {Object.values(stats.completedMissions).filter(Boolean).length}/4
                </span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">ข้อสอบสูงสุด</span>
                <span className="text-blue-400 font-bold font-scifi text-sm">
                  {stats.quizStats.bestScore}/20
                </span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[10px]">คอมโบสูงสุด</span>
                <span className="text-amber-400 font-bold font-scifi text-sm">
                  {stats.quizStats.highestStreak}x
                </span>
              </div>
            </div>
          </div>

          {/* Main Action Showcase (Big Start CTA & Overview) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/60 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
                <Atom className="w-3.5 h-3.5 text-cyan-400" />
                <span>จำลองระบบสุริยะ 3D ตามกฎของเคปเลอร์</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-thai text-white mb-2 leading-tight">
                ทะยานสู่อวกาศ สำรวจดาวเคราะห์ครบ 8 ดวง และเรียนรู้ฟิสิกส์ดาราศาสตร์
              </h2>
              <p className="text-sm text-slate-300 font-thai leading-relaxed mb-6">
                ขับยานสำรวจ 3D หมุนซูมพิจารณาดวงดาวอย่างอิสระ สัมผัสทฤษฎีการเกิดระบบสุริยะเมื่อ 4.6 พันล้านปีก่อน แถบดาวเคราะห์น้อย และแบบทดสอบ ม.6 พร้อมคำอธิบายวิทยาศาสตร์
              </p>

              {/* Big Start Button */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    sound.playSelect();
                    onStartGame();
                  }}
                  className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold font-thai text-base sm:text-lg shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Rocket className="w-5 h-5 animate-pulse" />
                  <span>เริ่มการสำรวจ 3D (Launch Mission)</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenQuiz();
                  }}
                  className="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold font-thai text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>คลังข้อสอบ 20 ข้อ</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Mission Chapters Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-thai text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>ภารกิจการเรียนรู้ 4 ด่านหลัก (Curriculum Missions)</span>
            </h3>
            <button
              onClick={() => {
                sound.playClick();
                onOpenSummary();
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-thai"
            >
              <span>อ่านสรุปความรู้ ม.6</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Mission 1 */}
            <div
              onClick={() => {
                sound.playClick();
                onOpenMission('nebula');
              }}
              className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-400 hover:bg-slate-800/80 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider font-scifi">
                    MISSION 01
                  </span>
                  {stats.completedMissions.nebula ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-scifi font-bold">+250 EXP</span>
                  )}
                </div>
                <h4 className="font-bold text-white text-base font-thai mb-1 group-hover:text-indigo-300 transition-colors">
                  กำเนิดระบบสุริยะ
                </h4>
                <p className="text-xs text-slate-400 font-thai leading-relaxed">
                  เรียงลำดับเหตุการณ์การยุบตัวของเนบิวลา จานดาวเคราะห์ และเส้นน้ำแข็ง
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold font-thai">
                <span>เล่นภารกิจ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Mission 2 */}
            <div
              onClick={() => {
                sound.playClick();
                onOpenMission('mystery');
              }}
              className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400 hover:bg-slate-800/80 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider font-scifi">
                    MISSION 02
                  </span>
                  {stats.completedMissions.mystery ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-scifi font-bold">+300 EXP</span>
                  )}
                </div>
                <h4 className="font-bold text-white text-base font-thai mb-1 group-hover:text-amber-300 transition-colors">
                  ภารกิจสำรวจดาว
                </h4>
                <p className="text-xs text-slate-400 font-thai leading-relaxed">
                  ถอดรหัสคำใบ้ดาราศาสตร์ 5 ปริศนา ค้นหาดาวเป้าหมายและตอบคำถาม
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold font-thai">
                <span>เล่นภารกิจ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Mission 3 */}
            <div
              onClick={() => {
                sound.playClick();
                onOpenMission('samples');
              }}
              className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-800/80 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-scifi">
                    MISSION 03
                  </span>
                  {stats.completedMissions.samples ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-scifi font-bold">+350 EXP</span>
                  )}
                </div>
                <h4 className="font-bold text-white text-base font-thai mb-1 group-hover:text-emerald-300 transition-colors">
                  ขับยานเก็บตัวอย่าง
                </h4>
                <p className="text-xs text-slate-400 font-thai leading-relaxed">
                  บินยานเก็บสสารอุกกาบาตและฝุ่นดาวหาง 3D นำเข้าแล็บสเปกโตรมิเตอร์
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold font-thai">
                <span>เล่นภารกิจ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Mission 4 */}
            <div
              onClick={() => {
                sound.playClick();
                onOpenMission('classification');
              }}
              className="p-5 rounded-2xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400 hover:bg-slate-800/80 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider font-scifi">
                    MISSION 04
                  </span>
                  {stats.completedMissions.classification ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ผ่านแล้ว
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-scifi font-bold">+300 EXP</span>
                  )}
                </div>
                <h4 className="font-bold text-white text-base font-thai mb-1 group-hover:text-purple-300 transition-colors">
                  จัดประเภทวัตถุ
                </h4>
                <p className="text-xs text-slate-400 font-thai leading-relaxed">
                  จำแนกดาวเคราะห์หิน แก๊สยักษ์ น้ำแข็งยักษ์ และดาวเคราะห์แคระตามนิยาม IAU
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-semibold font-thai">
                <span>เล่นภารกิจ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Hub Links (Encyclopedia & Shop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => {
              sound.playClick();
              onOpenEncyclopedia();
            }}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 flex items-center gap-4 cursor-pointer transition-all hover:bg-slate-850"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white font-thai text-sm">สารานุกรมระบบสุริยะ 3D</h4>
              <p className="text-xs text-slate-400 font-thai">สถิติและข้อมูลเปรียบเทียบเชิงลึกของดาวทุกดวง</p>
            </div>
          </div>

          <div
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 flex items-center gap-4 cursor-pointer transition-all hover:bg-slate-850"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white font-thai text-sm">อู่ต่อยาน & วิจัยอวกาศ</h4>
              <p className="text-xs text-slate-400 font-thai">อัปเกรดยานสำรวจรุ่น Vanguard และ Helios Titan</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-8 py-3 text-center border-t border-slate-900 text-xs text-slate-400 font-thai bg-slate-950/70">
        Solar System Explorer ม.6 • พัฒนาเพื่อการเรียนรู้ดาราศาสตร์และอวกาศ • ข้อมูลอ้างอิงสถาบันส่งเสริมการสอนวิทยาศาสตร์และเทคโนโลยี (สสวท.)
      </footer>
    </div>
  );
};
