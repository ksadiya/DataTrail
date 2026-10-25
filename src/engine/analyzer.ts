import {
  DataTypeTrail,
  HonestyStatus,
  PolicyAnalysisResult,
  StageName,
  TrailStage,
  VerbatimEvidence
} from '../types/policy';
import { CATEGORY_DEFINITIONS, CategoryDefinition, VAGUENESS_HEDGES } from './patterns';
import { QuoteVerifier } from './quoteVerifier';
import { RightsExtractor } from './rightsExtractor';

export class PolicyAnalyzerEngine {
  /**
   * Main entry point: deterministically analyzes policy text
   */
  public static analyze(rawText: string, policyTitle: string): PolicyAnalysisResult {
    const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
    const paragraphs = rawText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const sentences = this.tokenizeSentences(rawText);

    // 1. Detect global vagueness hedges across policy
    const hedgesDetected = this.scanGlobalHedges(rawText);

    // 2. Discover personal data categories present in the text
    const discoveredCategories = this.discoverCategories(sentences, rawText);

    // 3. Build 4-stage data trails for each category
    const discoveredDataTypes = discoveredCategories.map(cat =>
      this.buildCategoryTrail(cat, sentences, rawText)
    );

    // 4. Extract Rights and Grievance contacts
    const rightsAndContacts = RightsExtractor.extract(rawText);

    return {
      policyTitle: policyTitle || 'Analyzed Privacy Policy',
      wordCount,
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      analyzedAt: new Date().toISOString(),
      discoveredDataTypes,
      rightsAndContacts,
      hedgesDetected,
      rawText
    };
  }

  /**
   * Tokenizes text into sentences while respecting headings and legal numbering
   */
  private static tokenizeSentences(text: string): string[] {
    const rawTokens = text.split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/);
    const cleaned: string[] = [];

    for (const token of rawTokens) {
      const trimmed = token.trim();
      if (trimmed.length > 15) {
        cleaned.push(trimmed);
      }
    }

    return cleaned;
  }

  /**
   * Discovers which personal data categories are genuinely claimed in the text
   */
  private static discoverCategories(
    _sentences: string[],
    rawText: string
  ): CategoryDefinition[] {
    const matched: CategoryDefinition[] = [];

    for (const cat of CATEGORY_DEFINITIONS) {
      let matchCount = 0;
      for (const kw of cat.keywords) {
        if (kw.test(rawText)) {
          matchCount += 1;
        }
      }

      // If at least one keyword matches, category is discovered
      if (matchCount > 0) {
        matched.push(cat);
      }
    }

    // Fallback: If minimal match, return at least the first 2 common categories so the user has an explorable trail
    if (matched.length === 0) {
      matched.push(CATEGORY_DEFINITIONS[0], CATEGORY_DEFINITIONS[2]);
    }

    return matched;
  }

  /**
   * Builds the 4-stage data trail (Collect → Use → Share → Keep) for one data type
   */
  private static buildCategoryTrail(
    cat: CategoryDefinition,
    sentences: string[],
    rawText: string
  ): DataTypeTrail {
    // Find sentences relevant to this data category
    const relevantSentences = sentences.filter(s => {
      return cat.keywords.some(kw => kw.test(s));
    });

    const stages: Record<StageName, TrailStage> = {
      collect: this.analyzeStage('collect', cat, relevantSentences, sentences, rawText),
      use: this.analyzeStage('use', cat, relevantSentences, sentences, rawText),
      share: this.analyzeStage('share', cat, relevantSentences, sentences, rawText),
      keep: this.analyzeStage('keep', cat, relevantSentences, sentences, rawText)
    };

    // Calculate completeness metrics
    let statedCount = 0;
    let vagueCount = 0;
    let missingCount = 0;

    for (const stageKey of ['collect', 'use', 'share', 'keep'] as StageName[]) {
      const status = stages[stageKey].status;
      if (status === 'stated') statedCount++;
      else if (status === 'vague') vagueCount++;
      else if (status === 'not_found') missingCount++;
    }

    // Necessity & Proportionality Note
    const necessityNote = this.evaluateNecessity(cat, stages);

    return {
      id: cat.id,
      label: cat.label,
      iconName: cat.iconName,
      categoryName: cat.categoryName,
      description: cat.description,
      stages,
      necessityNote,
      metrics: {
        completenessScore: statedCount + (vagueCount * 0.5),
        statedStages: statedCount,
        vagueStages: vagueCount,
        missingStages: missingCount
      }
    };
  }

  /**
   * Evaluates one specific lifecycle stage for a data type
   */
  private static analyzeStage(
    stage: StageName,
    cat: CategoryDefinition,
    categorySentences: string[],
    allSentences: string[],
    rawText: string
  ): TrailStage {
    const stageKeywords = cat.stageKeywords[stage];
    const candidateQuotes: string[] = [];

    // Check direct category sentences first
    for (const s of categorySentences) {
      if (stageKeywords.some(kw => kw.test(s))) {
        candidateQuotes.push(s);
      }
    }

    // If stage is 'share' or 'keep', also check section-wide clauses that govern data broadly
    if (candidateQuotes.length === 0 && (stage === 'share' || stage === 'keep')) {
      for (const s of allSentences) {
        if (stage === 'share' && /\b(?:share\s+your\s+personal\s+data|disclose\s+information\s+with\s+third\s+parties)\b/i.test(s)) {
          candidateQuotes.push(s);
        } else if (stage === 'keep' && /\b(?:retain\s+your\s+personal\s+information|retention\s+period|delete\s+or\s+anonymize)\b/i.test(s)) {
          candidateQuotes.push(s);
        }
      }
    }

    // If no quotes found at all: NOT FOUND
    if (candidateQuotes.length === 0) {
      return {
        stage,
        title: this.getStageTitle(stage),
        status: 'not_found',
        headline: `No disclosure regarding ${stage} found for this data type.`,
        summary: `The policy makes no explicit claims or commitments describing how ${cat.label.toLowerCase()} is ${this.getStagePastTense(stage)}.`,
        evidence: [],
        directClaimCount: 0,
        vagueClaimCount: 0
      };
    }

    // Verify quotes and check for vagueness hedges
    const verifiedEvidence: VerbatimEvidence[] = [];
    let vagueCount = 0;
    let hedgesFoundTotal: string[] = [];

    for (const q of candidateQuotes.slice(0, 3)) {
      const ev = QuoteVerifier.createEvidence(q, rawText, `${cat.label} • ${this.getStageTitle(stage)}`);
      if (ev) {
        verifiedEvidence.push(ev);
        if (ev.hedgesFound && ev.hedgesFound.length > 0) {
          vagueCount++;
          hedgesFoundTotal.push(...ev.hedgesFound);
        }
      }
    }

    const uniqueHedges = Array.from(new Set(hedgesFoundTotal));
    const isVague = vagueCount > 0 || (stage === 'keep' && candidateQuotes.some(q => /as\s+long\s+as\s+necessary/i.test(q)));

    const status: HonestyStatus = isVague ? 'vague' : 'stated';

    // Generate concise stage headline and summary
    const { headline, summary, vaguenessReason } = this.synthesizeStageSummary(
      stage,
      cat,
      status,
      uniqueHedges,
      verifiedEvidence
    );

    return {
      stage,
      title: this.getStageTitle(stage),
      status,
      headline,
      summary,
      evidence: verifiedEvidence,
      vaguenessReason,
      directClaimCount: candidateQuotes.length - vagueCount,
      vagueClaimCount: vagueCount
    };
  }

  private static getStageTitle(stage: StageName): string {
    switch (stage) {
      case 'collect': return '1. COLLECT';
      case 'use': return '2. USE';
      case 'share': return '3. SHARE';
      case 'keep': return '4. KEEP';
    }
  }

  private static getStagePastTense(stage: StageName): string {
    switch (stage) {
      case 'collect': return 'collected or ingested';
      case 'use': return 'used or processed';
      case 'share': return 'shared or disclosed';
      case 'keep': return 'retained or stored';
    }
  }

  private static synthesizeStageSummary(
    stage: StageName,
    cat: CategoryDefinition,
    status: HonestyStatus,
    hedges: string[],
    evidence: VerbatimEvidence[]
  ): { headline: string; summary: string; vaguenessReason?: string } {
    const firstQuote = evidence[0]?.quote || '';

    if (stage === 'collect') {
      if (status === 'vague') {
        return {
          headline: 'Collected under broad or conditional language',
          summary: 'Policy states collection occurs, but incorporates permissive phrasing or broad device access.',
          vaguenessReason: hedges.length > 0 ? `Uses qualifiers like "${hedges.join('", "')}"` : undefined
        };
      }
      return {
        headline: 'Directly collected with declared device triggers',
        summary: `Policy explicitly states collection of ${cat.label.toLowerCase()} via user input, sensors, or device permissions.`
      };
    }

    if (stage === 'use') {
      if (status === 'vague') {
        return {
          headline: 'Processed for operational utility + commercial optimization',
          summary: 'Used for service fulfillment but also general enhancements and promotional personalization.',
          vaguenessReason: hedges.length > 0 ? `Includes open-ended justification like "${hedges.join('", "')}"` : undefined
        };
      }
      return {
        headline: 'Specific operational purposes declared',
        summary: `Policy explicitly defines operational goals for ${cat.label.toLowerCase()} (e.g. order fulfillment, security verification).`
      };
    }

    if (stage === 'share') {
      if (status === 'vague') {
        return {
          headline: 'Disclosed to partners with broad categories',
          summary: 'Disclosed beyond immediate service providers to commercial partners, affiliates, or advertising networks.',
          vaguenessReason: hedges.length > 0 ? `Discloses to entities described ambiguously as "${hedges.join('", "')}"` : undefined
        };
      }
      return {
        headline: 'Disclosed to specified operational vendors',
        summary: `Policy limits sharing of ${cat.label.toLowerCase()} to direct fulfillment partners (e.g. delivery couriers, cloud processors).`
      };
    }

    if (stage === 'keep') {
      if (/as\s+long\s+as\s+necessary/i.test(firstQuote)) {
        return {
          headline: 'Indefinite retention: "As long as necessary"',
          summary: 'Policy does not specify a calendar duration; data is retained at corporate discretion.',
          vaguenessReason: 'The clause "as long as necessary" sets no concrete retention ceiling.'
        };
      }
      if (status === 'vague') {
        return {
          headline: 'Conditional retention tied to statutory obligations',
          summary: 'Retained for legal compliance, tax audits, or dispute resolution without exact expiration dates.',
          vaguenessReason: hedges.length > 0 ? `Governed by clauses like "${hedges.join('", "')}"` : undefined
        };
      }
      return {
        headline: 'Explicit retention or deletion commitments stated',
        summary: 'Policy provides concrete timeframes (e.g. deleted upon delivery, or fixed statutory period).'
      };
    }

    return {
      headline: 'Policy clause identified',
      summary: 'Evidence captured from source text.'
    };
  }

  /**
   * Generates analytical observation on functional necessity
   * (Clearly designated as an interpretation, NOT a policy claim)
   */
  private static evaluateNecessity(
    cat: CategoryDefinition,
    stages: Record<StageName, TrailStage>
  ): {
    coreUtilityRelation: string;
    proportionalityAssessment: string;
    status: 'proportional' | 'excessive_scope' | 'vague_justification';
  } {
    const isShareVague = stages.share.status === 'vague';
    const isKeepVague = stages.keep.status === 'vague' || stages.keep.status === 'not_found';

    if (isShareVague && isKeepVague) {
      return {
        coreUtilityRelation: cat.necessityBaseline.coreUtilityRelation,
        proportionalityAssessment: `While collection may assist core services, broad partner sharing and open-ended retention ("as long as necessary") exceed what is strictly necessary for real-time app functionality.`,
        status: 'excessive_scope'
      };
    }

    if (isShareVague || isKeepVague) {
      return {
        coreUtilityRelation: cat.necessityBaseline.coreUtilityRelation,
        proportionalityAssessment: `Collection aligns with stated operational needs, but third-party disclosure or indefinite retention lacks concrete operational boundaries.`,
        status: 'vague_justification'
      };
    }

    return {
      coreUtilityRelation: cat.necessityBaseline.coreUtilityRelation,
      proportionalityAssessment: `Collection, use, and disclosure terms appear tightly bounded to direct functional fulfillment without open-ended secondary exploitation.`,
      status: 'proportional'
    };
  }

  /**
   * Scans global vagueness hedges throughout the document
   */
  private static scanGlobalHedges(text: string): { phrase: string; count: number; impact: 'high' | 'medium' | 'low' }[] {
    const results: { phrase: string; count: number; impact: 'high' | 'medium' | 'low' }[] = [];

    for (const h of VAGUENESS_HEDGES) {
      h.regex.lastIndex = 0;
      const matches = text.match(h.regex);
      if (matches && matches.length > 0) {
        results.push({
          phrase: h.phrase,
          count: matches.length,
          impact: h.impact
        });
      }
    }

    return results;
  }
}
