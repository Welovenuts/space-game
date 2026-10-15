import React from 'react';
import { SHIP_UPGRADES } from '../data/solarData';
import { ShipUpgrade } from '../types/solar';
import { X, Rocket, Coins, Check, Zap, Shield, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface ResearchShopModalProps {
  onClose: () => void;
  playerCoins: number;
  equippedShipId: string;
  unlockedShipIds: string[];
  onBuyShip: (ship: ShipUpgrade) => void;
  onEquipShip: (shipId: string) => void;
}

export const ResearchShopModal: React.FC<ResearchShopModalProps> = ({
  onClose,
  playerCoins,
  equippedShipId,
  unlockedShipIds,
  onBuyShip,
  onEquipShip
}) => {
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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-thai text-white">
                อู่ต่อยาน & สถาบันวิจัยอวกาศ
              </h2>
              <p className="text-xs text-slate-400 font-thai">
                ปลดล็อกเครื่องยนต์ขับดันและยานสำรวจใหม่ด้วย Space Coins
              </p>
            </div>
          </div>

          {/* Coin Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-950/80 border border-yellow-500/50 text-yellow-300 font-scifi font-bold text-sm">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{playerCoins.toLocaleString()} COINS</span>
          </div>
        </div>

        {/* Ship List */}
        <div className="space-y-4 mb-6">
          {SHIP_UPGRADES.map(ship => {
            const isUnlocked = unlockedShipIds.includes(ship.id);
            const isEquipped = equippedShipId === ship.id;
            const canAfford = playerCoins >= ship.price;

            return (
              <div 
                key={ship.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isEquipped
                    ? 'bg-amber-950/20 border-amber-500/60 shadow-lg'
                    : 'bg-slate-800/60 border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/20 shadow-md"
                      style={{ backgroundColor: ship.color + '33' }}
                    >
                      <Rocket className="w-6 h-6" style={{ color: ship.color }} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-white text-base font-thai">{ship.thaiName}</h3>
                        <span className="text-xs font-scifi text-slate-400">{ship.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-thai">
                          {ship.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-thai mt-1">
                        {ship.description}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs font-scifi text-slate-300">
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Zap className="w-3.5 h-3.5" /> ความเร็ว: x{ship.speedMultiplier}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-300">
                          <Shield className="w-3.5 h-3.5" /> การควบคุม: x{ship.handling}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buy / Equip Button */}
                  <div className="shrink-0 flex items-center justify-end">
                    {isEquipped ? (
                      <span className="px-4 py-2 rounded-xl bg-amber-600/30 border border-amber-500/50 text-amber-300 font-bold text-xs font-thai flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> กำลังใช้งาน
                      </span>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => {
                          sound.playClick();
                          onEquipShip(ship.id);
                        }}
                        className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs font-thai transition-colors"
                      >
                        สวมใส่ยานลำนี้
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          sound.playClick();
                          onBuyShip(ship);
                        }}
                        className={`px-5 py-2 rounded-xl font-bold text-xs font-thai flex items-center gap-1.5 transition-all ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5 text-yellow-300" />
                        <span>ปลดล็อก {ship.price} เหรียญ</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
