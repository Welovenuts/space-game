import React, { useState } from 'react';
import { PLANETS_DATA } from '../data/solarData';
import { PlanetData, PlanetType } from '../types/solar';
import { X, BookOpen, Search, Eye, Navigation, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface EncyclopediaModalProps {
  onClose: () => void;
  onSelectPlanet: (planet: PlanetData) => void;
  onFlyToPlanet: (planetId: string) => void;
}

export const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({
  onClose,
  onSelectPlanet,
  onFlyToPlanet
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = PLANETS_DATA.filter(p => {
    const matchesSearch = 
      p.thaiName.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    if (filterType === 'all') return matchesSearch;
    if (filterType === 'terrestrial') return matchesSearch && p.type === 'terrestrial';
    if (filterType === 'gas_giant') return matchesSearch && p.type === 'gas_giant';
    if (filterType === 'ice_giant') return matchesSearch && p.type === 'ice_giant';
    if (filterType === 'dwarf') return matchesSearch && p.type === 'dwarf';
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl text-slate-100 shadow-cyan-950/50"
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
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-thai text-white">
              สารานุกรมระบบสุริยะ 3D (Solar Encyclopedia)
            </h2>
            <p className="text-xs text-slate-400 font-thai">
              รวมข้อมูลดาราศาสตร์และฟิสิกส์ดาวเคราะห์ตามหลักสูตร ม.6 สสวท.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อดาวเคราะห์ ภาษาไทย หรือ อังกฤษ..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-thai"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'terrestrial', label: 'ดาวเคราะห์หิน' },
              { id: 'gas_giant', label: 'แก๊สยักษ์' },
              { id: 'ice_giant', label: 'น้ำแข็งยักษ์' },
              { id: 'dwarf', label: 'ดาวเคราะห์แคระ' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setFilterType(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-thai transition-colors ${
                  filterType === tab.id
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Planets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-5">
          {filtered.map(planet => (
            <div
              key={planet.id}
              className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-cyan-500/40 hover:bg-slate-800 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div 
                    className="w-8 h-8 rounded-full shrink-0 shadow-md border border-white/20"
                    style={{ backgroundColor: planet.color }}
                  />
                  <div>
                    <h3 className="font-bold text-white text-base font-thai">{planet.thaiName}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-scifi">{planet.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 border border-slate-700 font-thai">
                        {planet.typeLabelThai}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-thai line-clamp-3 mb-3 leading-relaxed">
                  {planet.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 mb-3 font-scifi">
                  <div>
                    <span className="text-slate-400 block text-[10px]">ระยะห่าง:</span>
                    <span className="text-white font-semibold">{planet.distanceAU} AU</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">อุณหภูมิ:</span>
                    <span className="text-amber-400 font-semibold">{planet.temperatureC.mean}°C</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-700/60">
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectPlanet(planet);
                    onClose();
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-200 font-thai flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ดูรายละเอียด</span>
                </button>
                <button
                  onClick={() => {
                    sound.playSelect();
                    onFlyToPlanet(planet.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-thai font-semibold flex items-center gap-1 transition-colors"
                  title="บินยานไปสำรวจ"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>บินไป</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
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
