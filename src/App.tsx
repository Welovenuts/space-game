import React, { useState, useEffect, useRef } from 'react';
import { SolarSystemScene, CameraViewMode } from './game/SolarSystemScene';
import { PLANETS_DATA, SPACE_SAMPLES } from './data/solarData';
import { PlanetData, PlayerStats, SpaceSample, ShipUpgrade } from './types/solar';
import { sound } from './utils/audio';

import { Lobby } from './components/Lobby';
import { GameHud } from './components/GameHud';
import { PlanetDetailModal } from './components/PlanetDetailModal';
import { MissionNebula } from './components/MissionNebula';
import { MissionMystery } from './components/MissionMystery';
import { MissionSampleRetrieval } from './components/MissionSampleRetrieval';
import { MissionClassification } from './components/MissionClassification';
import { QuizModal } from './components/QuizModal';
import { EncyclopediaModal } from './components/EncyclopediaModal';
import { ResearchShopModal } from './components/ResearchShopModal';
import { SummaryModal } from './components/SummaryModal';

const INITIAL_STATS: PlayerStats = {
  level: 1,
  exp: 0,
  expToNextLevel: 300,
  coins: 100,
  rankTitle: 'นักบินอวกาศฝึกหัด ม.6',
  completedMissions: {
    nebula: false,
    mystery: false,
    samples: false,
    classification: false
  },
  quizStats: {
    bestScore: 0,
    totalAttempts: 0,
    highestStreak: 0
  },
  visitedPlanets: ['earth'],
  collectedSamples: [],
  equippedShip: 'ship-alpha',
  unlockedShips: ['ship-alpha']
};

export default function App() {
  // Game View State ('lobby' | 'gameplay')
  const [gameState, setGameState] = useState<'lobby' | 'gameplay'>('lobby');

  // Player Stats with LocalStorage Persistence
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('solar_explorer_stats_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STATS;
  });

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    | null
    | 'planet_detail'
    | 'mission_nebula'
    | 'mission_mystery'
    | 'mission_samples'
    | 'mission_classification'
    | 'quiz'
    | 'encyclopedia'
    | 'shop'
    | 'summary'
  >(null);

  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [activeLabSample, setActiveLabSample] = useState<SpaceSample | null>(null);

  // 3D Scene Controls State
  const [viewMode, setViewMode] = useState<CameraViewMode>('ship');
  const [telemetry, setTelemetry] = useState({ speed: 0, distance: 0, target: 'โลก' });
  const [timeSpeed, setTimeSpeed] = useState<number>(1.0);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);

  // 3D Scene instance and Canvas Container Ref
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const sceneInstanceRef = useRef<SolarSystemScene | null>(null);

  // Save Stats whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('solar_explorer_stats_v1', JSON.stringify(stats));
    } catch {}
  }, [stats]);

  // Progression calculation helper
  const addRewards = (earnedExp: number, earnedCoins: number) => {
    setStats(prev => {
      let newExp = prev.exp + earnedExp;
      let newLevel = prev.level;
      let newExpToNext = prev.expToNextLevel;

      while (newExp >= newExpToNext) {
        newExp -= newExpToNext;
        newLevel += 1;
        newExpToNext = Math.round(newExpToNext * 1.35);
      }

      let rank = 'นักบินอวกาศฝึกหัด ม.6';
      if (newLevel >= 8) rank = 'ผู้บัญชาการกองเรือสำรวจสุริยะ';
      else if (newLevel >= 5) rank = 'นายเรือดาราศาสตร์ฟิสิกส์';
      else if (newLevel >= 3) rank = 'เจ้าหน้าที่สำรวจระบบสุริยะ';

      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        expToNextLevel: newExpToNext,
        coins: prev.coins + earnedCoins,
        rankTitle: rank
      };
    });
  };

  // Mount Three.js Scene once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const scene = new SolarSystemScene(canvasMountRef.current, {
      onPlanetSelect: (planet) => {
        setSelectedPlanet(planet);
        setActiveModal('planet_detail');
      },
      onSampleCollect: (sample) => {
        setActiveLabSample(sample);
        setActiveModal('mission_samples');
        setStats(prev => {
          if (!prev.collectedSamples.includes(sample.id)) {
            return {
              ...prev,
              collectedSamples: [...prev.collectedSamples, sample.id]
            };
          }
          return prev;
        });
      },
      onShipTelemetry: (speed, distance, target) => {
        setTelemetry({ speed, distance, target });
      }
    });

    sceneInstanceRef.current = scene;

    return () => {
      scene.dispose();
      sceneInstanceRef.current = null;
    };
  }, []);

  // Sync simulation speeds and orbits with Three.js scene instance
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.timeSpeedMultiplier = timeSpeed;
    }
  }, [timeSpeed]);

  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setOrbitVisibility(showOrbits);
    }
  }, [showOrbits]);

  // Handle user starting game
  const handleStartGame = () => {
    sound.startAmbient();
    setGameState('gameplay');
  };

  const handleReturnToLobby = () => {
    setGameState('lobby');
    setActiveModal(null);
  };

  // View mode changes
  const handleSetViewMode = (mode: CameraViewMode) => {
    setViewMode(mode);
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.setViewMode(mode);
    }
  };

  // Fly to planet
  const handleFlyToPlanet = (planetId: string) => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.flyShipToPlanet(planetId);
      setViewMode('ship');
    }
  };

  // Focus planet camera
  const handleFocusPlanet = (planetId: string) => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.focusPlanet(planetId);
      setViewMode('planet_focus');
    }
  };

  // Mission completions
  const handleMissionComplete = (
    missionKey: 'nebula' | 'mystery' | 'samples' | 'classification',
    rewardExp: number,
    rewardCoins: number
  ) => {
    addRewards(rewardExp, rewardCoins);
    setStats(prev => ({
      ...prev,
      completedMissions: {
        ...prev.completedMissions,
        [missionKey]: true
      }
    }));
  };

  // Quiz completion
  const handleQuizFinished = (score: number, maxScore: number, streak: number) => {
    const earnedExp = score * 20;
    const earnedCoins = score * 15;
    addRewards(earnedExp, earnedCoins);

    setStats(prev => ({
      ...prev,
      quizStats: {
        bestScore: Math.max(prev.quizStats.bestScore, score),
        totalAttempts: prev.quizStats.totalAttempts + 1,
        highestStreak: Math.max(prev.quizStats.highestStreak, streak)
      }
    }));
  };

  // Shop actions
  const handleBuyShip = (ship: ShipUpgrade) => {
    if (stats.coins >= ship.price) {
      sound.playCorrect();
      setStats(prev => ({
        ...prev,
        coins: prev.coins - ship.price,
        unlockedShips: [...prev.unlockedShips, ship.id],
        equippedShip: ship.id
      }));
    }
  };

  const handleEquipShip = (shipId: string) => {
    setStats(prev => ({ ...prev, equippedShip: shipId }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-thai">
      {/* 1. 3D WebGL Canvas Mount Container (Permanent, outside React UI re-renders) */}
      <div 
        ref={canvasMountRef} 
        className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
      />

      {/* 2. Lobby View Overlay */}
      {gameState === 'lobby' && (
        <div className="absolute inset-0 z-20 overflow-y-auto pointer-events-auto bg-slate-950/85 backdrop-blur-md">
          <Lobby
            stats={stats}
            onStartGame={handleStartGame}
            onOpenMission={(missionId) => {
              setActiveModal(`mission_${missionId}` as any);
            }}
            onOpenQuiz={() => setActiveModal('quiz')}
            onOpenEncyclopedia={() => setActiveModal('encyclopedia')}
            onOpenShop={() => setActiveModal('shop')}
            onOpenSummary={() => setActiveModal('summary')}
          />
        </div>
      )}

      {/* 3. In-Game 3D HUD & Perimeter Controls (Active when in gameplay mode) */}
      {gameState === 'gameplay' && (
        <GameHud
          viewMode={viewMode}
          onSetViewMode={handleSetViewMode}
          speed={telemetry.speed}
          distance={telemetry.distance}
          nearestTarget={telemetry.target}
          stats={stats}
          timeSpeed={timeSpeed}
          onSetTimeSpeed={setTimeSpeed}
          showOrbits={showOrbits}
          onToggleOrbits={() => setShowOrbits(!showOrbits)}
          onSelectPlanet={(planet) => {
            setSelectedPlanet(planet);
            setActiveModal('planet_detail');
          }}
          onReturnToLobby={handleReturnToLobby}
          onOpenMission={(missionId) => setActiveModal(`mission_${missionId}` as any)}
          onOpenSummary={() => setActiveModal('summary')}
          onOpenEncyclopedia={() => setActiveModal('encyclopedia')}
          onOpenShop={() => setActiveModal('shop')}
          inputState={sceneInstanceRef.current?.inputState || {
            forward: false,
            backward: false,
            left: false,
            right: false,
            up: false,
            down: false,
            boost: false
          }}
        />
      )}

      {/* 4. Modals */}
      {/* Planet Detail Card */}
      {activeModal === 'planet_detail' && (
        <PlanetDetailModal
          planet={selectedPlanet}
          onClose={() => setActiveModal(null)}
          onFlyToPlanet={handleFlyToPlanet}
          onFocusPlanet={handleFocusPlanet}
        />
      )}

      {/* Mission 1: Nebular Hypothesis */}
      {activeModal === 'mission_nebula' && (
        <MissionNebula
          onClose={() => setActiveModal(null)}
          onMissionComplete={handleMissionComplete}
          isAlreadyCompleted={stats.completedMissions.nebula}
        />
      )}

      {/* Mission 2: Planet Mystery Clues */}
      {activeModal === 'mission_mystery' && (
        <MissionMystery
          onClose={() => setActiveModal(null)}
          onMissionComplete={handleMissionComplete}
          onFlyToPlanet={(pId) => {
            handleFlyToPlanet(pId);
            setGameState('gameplay');
          }}
          isAlreadyCompleted={stats.completedMissions.mystery}
        />
      )}

      {/* Mission 3: Space Sample Retrieval */}
      {activeModal === 'mission_samples' && (
        <MissionSampleRetrieval
          onClose={() => setActiveModal(null)}
          collectedSampleIds={stats.collectedSamples}
          activeSampleForLab={activeLabSample}
          onAnswerLabQuiz={(sampleId, isCorrect) => {
            if (isCorrect) {
              addRewards(100, 50);
            }
          }}
          onMissionComplete={handleMissionComplete}
          isAlreadyCompleted={stats.completedMissions.samples}
        />
      )}

      {/* Mission 4: Classification */}
      {activeModal === 'mission_classification' && (
        <MissionClassification
          onClose={() => setActiveModal(null)}
          onMissionComplete={handleMissionComplete}
          isAlreadyCompleted={stats.completedMissions.classification}
        />
      )}

      {/* Quiz Modal (20 questions) */}
      {activeModal === 'quiz' && (
        <QuizModal
          onClose={() => setActiveModal(null)}
          onQuizFinished={handleQuizFinished}
          bestScore={stats.quizStats.bestScore}
        />
      )}

      {/* Encyclopedia Modal */}
      {activeModal === 'encyclopedia' && (
        <EncyclopediaModal
          onClose={() => setActiveModal(null)}
          onSelectPlanet={(planet) => {
            setSelectedPlanet(planet);
            setActiveModal('planet_detail');
          }}
          onFlyToPlanet={(planetId) => {
            handleFlyToPlanet(planetId);
            setGameState('gameplay');
          }}
        />
      )}

      {/* Research Shop Modal */}
      {activeModal === 'shop' && (
        <ResearchShopModal
          onClose={() => setActiveModal(null)}
          playerCoins={stats.coins}
          equippedShipId={stats.equippedShip}
          unlockedShipIds={stats.unlockedShips}
          onBuyShip={handleBuyShip}
          onEquipShip={handleEquipShip}
        />
      )}

      {/* Learning Log Summary Modal */}
      {activeModal === 'summary' && (
        <SummaryModal
          onClose={() => setActiveModal(null)}
          stats={stats}
        />
      )}
    </div>
  );
}
