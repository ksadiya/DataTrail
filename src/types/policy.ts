export type HonestyStatus = 'stated' | 'vague' | 'not_found' | 'interpreted';

export type StageName = 'collect' | 'use' | 'share' | 'keep';

export interface VerbatimEvidence {
  quote: string;
  sourceSection?: string;
  hedgesFound?: string[]; // e.g. ["including but not limited to", "may share with partners"]
  lineNumber?: number;
  highlightIndices?: [number, number];
}

export interface TrailStage {
  stage: StageName;
  title: string;
  status: HonestyStatus;
  headline: string;
  summary: string;
  evidence: VerbatimEvidence[];
  vaguenessReason?: string;
  directClaimCount: number;
  vagueClaimCount: number;
}

export interface DataTypeTrail {
  id: string; // e.g. "location", "contacts", "device_ids", "financial", "biometric", "activity"
  label: string;
  iconName: string;
  categoryName: string;
  description: string;
  stages: Record<StageName, TrailStage>;
  necessityNote: {
    coreUtilityRelation: string;
    proportionalityAssessment: string;
    status: 'proportional' | 'excessive_scope' | 'vague_justification';
  };
  metrics: {
    completenessScore: number; // e.g. 3 out of 4 stages covered
    statedStages: number;
    vagueStages: number;
    missingStages: number;
  };
}

export interface PolicyAnalysisResult {
  policyTitle: string;
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  analyzedAt: string;
  discoveredDataTypes: DataTypeTrail[];
  rightsAndContacts: {
    grievanceOfficerFound: boolean;
    grievanceOfficerName?: string;
    grievanceOfficerEmail?: string;
    grievanceOfficerAddress?: string;
    dpoEmail?: string;
    deletionProcedureStated: boolean;
    deletionSummary?: string;
    optOutStated: boolean;
    evidenceQuotes: string[];
  };
  hedgesDetected: {
    phrase: string;
    count: number;
    impact: 'high' | 'medium' | 'low';
  }[];
  rawText: string;
}

export interface PolicySample {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  region: string;
  date: string;
  description: string;
  text: string;
}
