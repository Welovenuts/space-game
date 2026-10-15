import React, { useState } from 'react';
import { CameraViewMode } from '../game/SolarSystemScene';
import { PLANETS_DATA } from '../data/solarData';
import { PlanetData, PlayerStats } from '../types/solar';
import { 
  Navigation, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Home, 
  Eye, 
  Layers, 
  Gauge, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Flame, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Zap,
  BookOpen
} from 'lucide-react';
import { sound } from '../utils/audio';

interface GameHudProps {
  viewMode: CameraViewMode;
  onSetViewMode: (mode: CameraViewMode) => void;
  speed: number;
  distance: number;
  nearestTarget: string;
  stats: PlayerStats;
  timeSpeed: number;
  onSetTimeSpeed: (speed: number) => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  onSelectPlanet: (planet: PlanetData) => void;
  onReturnToLobby: () => void;
  onOpenMission: (missionId: string) => void;
  onOpenSummary: () => void;
  onOpenEncyclopedia: () => void;
  onOpenShop: () => void;
  inputState: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    boost: boolean;
  };
}

export const GameHud: React.FC<GameHudProps> = ({
  viewMode,
  onSetViewMode,
  speed,
  distance,
  nearestTarget,
  stats,
  timeSpeed,
  onSetTimeSpeed,
  showOrbits,
  onToggleOrbits,
  onSelectPlanet,
  onReturnToLobby,
  onOpenMission,
  onOpenSummary,
  onOpenEncyclopedia,
  onOpenShop,
  inputState
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden font-thai">
      {/* 1. TOP PERIMETER CLUSTER */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-3 pointer-events-none">
        {/* Top-Left: Player Stats & Quick Launchers */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              sound.playClick();
              onReturnToLobby();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-bold shadow-lg transition-all hover:scale-105"
            title="กลับสู่ห้องควบคุมหลัก (Lobby)"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">หน้าหลัก</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs shadow-lg">
            <span className="text-amber-400 font-bold font-scifi">Lv.{stats.level}</span>
            <span className="w-1 h-3 bg-slate-700" />
            <span className="text-yellow-400 font-bold font-scifi">{stats.coins} 🪙</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenEncyclopedia();
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-medium shadow-lg transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>สารานุกรม</span>
          </button>
        </div>

        {/* Top-Center: Telemetry Cluster (Low-Occlusion) */}
        <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 rounded-xl bg-slate-900/85 border border-cyan-500/30 text-xs shadow-xl pointer-events-auto">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400">ความเร็ว:</span>
            <span className="font-scifi font-bold text-white tabular-nums">{speed}</span>
            <span className="text-[10px] text-slate-400">km/s</span>
          </div>

          <div className="w-px h-3 bg-slate-700" />

          <div className="flex items-center gap-1.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-400">พิกัดใกล้เคียง:</span>
            <span className="font-bold text-cyan-300">{nearestTarget}</span>
          </div>
        </div>

        {/* Top-Right: Sound, Fullscreen, Learning Log */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              sound.playClick();
              onOpenSummary();
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-medium shadow-lg transition-colors"
            title="สรุปความรู้ดาราศาสตร์ ม.6"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">สรุปความรู้ ม.6</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white shadow-lg transition-colors"
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white shadow-lg transition-colors"
            title="เต็มจอ"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. MOBILE TOUCH CONTROLS (Bottom Left Steering & Bottom Right Thrust) */}
      <div className="sm:hidden absolute bottom-24 left-3 flex flex-col gap-1 pointer-events-auto">
        <button
          onTouchStart={() => { inputState.forward = true; }}
          onTouchEnd={() => { inputState.forward = false; }}
          className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700 active:bg-cyan-600 flex items-center justify-center text-white"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex gap-1">
          <button
            onTouchStart={() => { inputState.left = true; }}
            onTouchEnd={() => { inputState.left = false; }}
            className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700 active:bg-cyan-600 flex items-center justify-center text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onTouchStart={() => { inputState.backward = true; }}
            onTouchEnd={() => { inputState.backward = false; }}
            className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700 active:bg-cyan-600 flex items-center justify-center text-white"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onTouchStart={() => { inputState.right = true; }}
            onTouchEnd={() => { inputState.right = false; }}
            className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700 active:bg-cyan-600 flex items-center justify-center text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="sm:hidden absolute bottom-24 right-3 flex flex-col gap-2 pointer-events-auto">
        <button
          onTouchStart={() => { inputState.boost = true; }}
          onTouchEnd={() => { inputState.boost = false; }}
          className="w-14 h-14 rounded-2xl bg-amber-600 active:bg-amber-500 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg"
        >
          <Zap className="w-5 h-5" />
          <span>BOOST</span>
        </button>
      </div>

      {/* 3. UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK (Mandatory Three.js Directive) */}
      <div 
        className="absolute pointer-events-auto transition-transform duration-300 ease-out"
        style={{
          bottom: '16px',
          left: '50%',
          transform: isDockCollapsed ? 'translate(-50%, calc(100% - 32px))' : 'translate(-50%, 0)',
          maxWidth: 'min(960px, 96vw)',
          width: '100%'
        }}
      >
        {/* Collapse / Expand Toggle Button Attached to Top Edge of Dock */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => {
              sound.playClick();
              setIsDockCollapsed(!isDockCollapsed);
            }}
            className="flex items-center gap-1 px-4 py-1 rounded-t-xl bg-slate-900/95 border-t border-x border-cyan-500/40 text-[11px] font-medium text-slate-300 hover:text-white shadow-lg transition-colors cursor-pointer"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>แสดงแถบควบคุม (Expand Dock)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>ซ่อนแถบควบคุม (Cinema Mode)</span>
              </>
            )}
          </button>
        </div>

        {/* Main Dock Container */}
        <div className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl text-slate-100 shadow-slate-950/80">
          <div className="flex flex-col gap-3">
            {/* Top row: View Modes & Time Speed Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Camera Mode Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/70 border border-slate-800">
                <button
                  onClick={() => {
                    sound.playClick();
                    onSetViewMode('ship');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'ship'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>ขับยานสำรวจ (Ship)</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onSetViewMode('orbit');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'orbit'
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>ทั้งระบบ (Orbit)</span>
                </button>
              </div>

              {/* Simulation Speed Pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 px-1 font-scifi">SPEED:</span>
                {[0.5, 1.0, 5.0, 15.0].map(sp => (
                  <button
                    key={sp}
                    onClick={() => {
                      sound.playClick();
                      onSetTimeSpeed(sp);
                    }}
                    className={`px-2 py-1 rounded text-xs font-scifi transition-colors ${
                      timeSpeed === sp
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>

              {/* Orbits Line Toggle & Missions Launcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onToggleOrbits();
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                    showOrbits
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  วงโคจร: {showOrbits ? 'เปิด' : 'ปิด'}
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenMission('nebula');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  ภารกิจ ม.6 🚀
                </button>
              </div>
            </div>

            {/* Quick Planet Selector Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              <span className="text-[11px] text-slate-400 shrink-0 font-thai">เลือกดาว:</span>
              {PLANETS_DATA.map(planet => (
                <button
                  key={planet.id}
                  onClick={() => {
                    sound.playSelect();
                    onSelectPlanet(planet);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 hover:border-cyan-500/50 text-slate-200 text-xs shrink-0 transition-colors"
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: planet.color }}
                  />
                  <span>{planet.thaiName}</span>
                </button>
              ))}
            </div>

            {/* Control Hints Footer Line */}
            <div className="hidden sm:flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 font-scifi">
              <span>WASD / ลูกศร ขับเคลื่อน · SPACE เร่งบูสต์ · Q/E ปรับระดับ · ลากเมาส์หมุนมุมมอง · ล้อเลื่อนซูม</span>
              <span className="text-cyan-400 font-thai">คลิกที่ดาวเพื่อดูข้อมูลวิทย์ ม.6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
