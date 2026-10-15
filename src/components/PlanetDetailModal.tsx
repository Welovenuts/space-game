import React from 'react';
import { PlanetData } from '../types/solar';
import { 
  X, 
  Navigation, 
  Eye, 
  Thermometer, 
  Orbit, 
  RotateCw, 
  Compass, 
  Wind, 
  Moon, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { sound } from '../utils/audio';

interface PlanetDetailModalProps {
  planet: PlanetData | null;
  onClose: () => void;
  onFlyToPlanet: (planetId: string) => void;
  onFocusPlanet: (planetId: string) => void;
}

export const PlanetDetailModal: React.FC<PlanetDetailModalProps> = ({
  planet,
  onClose,
  onFlyToPlanet,
  onFocusPlanet
}) => {
  if (!planet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl text-slate-100 shadow-cyan-950/50"
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title Lockup */}
        <div className="flex items-start gap-4 mb-5">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0 border border-white/20"
            style={{ 
              backgroundColor: planet.color + '22',
              boxShadow: `0 0 24px ${planet.color}44` 
            }}
          >
            <div 
              className="w-9 h-9 rounded-full"
              style={{ backgroundColor: planet.color }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-thai text-white">
                {planet.thaiName}
              </h2>
              <span className="text-lg font-scifi text-cyan-400 font-semibold tracking-wider">
                {planet.name}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-medium">
                {planet.typeLabelThai}
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1 italic font-thai">
              "{planet.tagline}"
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-slate-300 mb-6 font-thai bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50">
          {planet.description}
        </p>

        {/* Astronomical Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Orbit className="w-4 h-4 text-cyan-400" />
              <span>ระยะห่างดวงอาทิตย์</span>
            </div>
            <div className="text-base font-bold font-scifi text-white">
              {planet.distanceAU} <span className="text-xs font-normal text-slate-400">AU</span>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>รัศมีเส้นศูนย์สูตร</span>
            </div>
            <div className="text-base font-bold font-scifi text-white">
              {planet.radiusKm.toLocaleString()} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>อุณหภูมิเฉลี่ย</span>
            </div>
            <div className="text-base font-bold font-scifi text-white">
              {planet.temperatureC.mean > 0 ? `+${planet.temperatureC.mean}` : planet.temperatureC.mean}°C
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <RotateCw className="w-4 h-4 text-violet-400" />
              <span>คาบหมุนรอบตัวเอง</span>
            </div>
            <div className="text-sm font-semibold font-scifi text-white">
              {Math.abs(planet.rotationHours)} ชม.
              {planet.rotationHours < 0 && <span className="text-xs text-rose-400 ml-1">(สวนทาง)</span>}
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Orbit className="w-4 h-4 text-blue-400" />
              <span>คาบการโคจร</span>
            </div>
            <div className="text-sm font-semibold font-scifi text-white">
              {planet.orbitPeriodDays > 0 ? `${planet.orbitPeriodDays.toLocaleString()} วัน` : 'ศูนย์กลาง'}
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Moon className="w-4 h-4 text-yellow-300" />
              <span>ดวงจันทร์บริวาร</span>
            </div>
            <div className="text-base font-bold font-scifi text-white">
              {planet.moonsCount} <span className="text-xs font-normal text-slate-400">ดวง</span>
            </div>
          </div>
        </div>

        {/* Atmosphere & Moons */}
        <div className="mb-6 space-y-3">
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-1.5 uppercase tracking-wider">
              <Wind className="w-4 h-4" />
              <span>องค์ประกอบชั้นบรรยากาศ:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {planet.atmosphere.map((atm, idx) => (
                <span 
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-700/60 text-slate-200 border border-slate-600/40"
                >
                  {atm}
                </span>
              ))}
            </div>
          </div>

          {planet.prominentMoons && planet.prominentMoons.length > 0 && (
            <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 text-xs font-semibold text-yellow-300 mb-1.5 uppercase tracking-wider">
                <Moon className="w-4 h-4" />
                <span>ดวงจันทร์บริวารเด่น:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {planet.prominentMoons.map((m, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-yellow-950/40 text-yellow-200 border border-yellow-700/40"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Grade 12 Curriculum Key Facts (ความรู้สำคัญ ม.6) */}
        <div className="mb-6 bg-cyan-950/30 border border-cyan-500/40 rounded-xl p-4">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm mb-3">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>ประเด็นสำคัญตามหลักสูตร ม.6 ดาราศาสตร์</span>
          </div>
          <ul className="space-y-2">
            {planet.keyFactsM6.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-thai">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onFocusPlanet(planet.id);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>ปรับกล้องชมรอบดาว</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              onFlyToPlanet(planet.id);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-cyan-600/30 transition-all hover:scale-105"
          >
            <Navigation className="w-4 h-4" />
            <span>บินยานไปที่นี่ (Autopilot)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
