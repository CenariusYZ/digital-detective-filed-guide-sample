
export enum LensStatus {
  VERIFIED = 'Verified',
  ANONYMOUS = 'Anonymous',
  FABRICATED = 'Fabricated',
  SOLID = 'Solid Evidence',
  VAGUE = 'Vague',
  CONTRADICTORY = 'Contradictory',
  LOGICAL = 'Logical',
  EMOTIONAL = 'Emotional',
  FALLACIOUS = 'Fallacious'
}

export enum VerdictLevel {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED'
}

export interface Claim {
  id: string;
  text: string;
}

export interface SourceLink {
  uri: string;
  title: string;
}

export interface LensEvaluation {
  status: LensStatus;
  label: 'Verified' | 'Anonymous' | 'Fabricated' | 'Solid Evidence' | 'Vague' | 'Contradictory' | 'Logical' | 'Emotional' | 'Fallacious';
  details: string;
  isRedFlag: boolean;
}

export interface AnalysisResult {
  claims: Claim[];
  sourceLens: LensEvaluation;
  factLens: LensEvaluation;
  logicLens: LensEvaluation;
  verdict: VerdictLevel;
  summary: string;
  groundingSources?: SourceLink[];
}
