export type PlanetType = 
  | 'sun' 
  | 'terrestrial' 
  | 'gas_giant' 
  | 'ice_giant' 
  | 'dwarf' 
  | 'moon' 
  | 'asteroid_belt' 
  | 'kuiper_belt';

export interface PlanetData {
  id: string;
  name: string;
  thaiName: string;
  type: PlanetType;
  typeLabelThai: string;
  tagline: string;
  description: string;
  distanceAU: number; // in Astronomical Units
  displayDistance: number; // 3D world units
  radiusKm: number; // in km
  displayRadius: number; // 3D world units
  orbitPeriodDays: number; // Earth days to orbit sun
  rotationHours: number; // Rotation period in Earth hours
  axialTiltDeg: number; // Axial tilt in degrees
  temperatureC: {
    min?: number;
    max?: number;
    mean: number;
  };
  gravity: number; // m/s^2
  atmosphere: string[];
  moonsCount: number;
  prominentMoons?: string[];
  discovery?: string;
  keyFactsM6: string[]; // Important concepts for Grade 12 Thai Curriculum
  color: string;
  emissive?: string;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  textureHue?: string;
}

export interface PlayerStats {
  level: number;
  exp: number;
  expToNextLevel: number;
  coins: number;
  rankTitle: string;
  completedMissions: {
    nebula: boolean;
    mystery: boolean;
    samples: boolean;
    classification: boolean;
  };
  quizStats: {
    bestScore: number;
    totalAttempts: number;
    highestStreak: number;
  };
  visitedPlanets: string[];
  collectedSamples: string[];
  equippedShip: string;
  unlockedShips: string[];
}

export interface NebularStage {
  id: number;
  correctOrder: number;
  title: string;
  timeframe: string;
  description: string;
  scientificDetail: string;
  iconName: string;
}

export interface PlanetClueQuest {
  id: string;
  title: string;
  riddleText: string;
  clues: string[];
  targetPlanetId: string;
  rewardExp: number;
  rewardCoins: number;
  explanation: string;
  followUpQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  };
}

export interface SpaceSample {
  id: string;
  name: string;
  thaiName: string;
  originLocation: string;
  color: string;
  position: [number, number, number];
  scientificAnalysis: {
    composition: string;
    formationEra: string;
    significance: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    rationale: string;
  };
}

export interface ClassificationItem {
  id: string;
  name: string;
  thaiName: string;
  category: 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf' | 'small_body';
  description: string;
  hint: string;
}

export interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  scientificRationale: string;
  curriculumPoint: string;
}

export interface ShipUpgrade {
  id: string;
  name: string;
  thaiName: string;
  price: number;
  speedMultiplier: number;
  handling: number;
  description: string;
  color: string;
  badge: string;
}
