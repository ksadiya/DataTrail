import { VerbatimEvidence } from '../types/policy';
import { VAGUENESS_HEDGES } from './patterns';

export interface VerifiedQuoteResult {
  isVerbatim: boolean;
  exactSubstring: string;
  hedgesFound: string[];
  lineNumber?: number;
  highlightIndices?: [number, number];
}

export class QuoteVerifier {
  /**
   * Verifies that the candidate quote exists verbatim in the raw policy text.
   * If not directly matching due to whitespace differences, normalizes spaces
   * while locating the exact span in the original text.
   */
  public static verifyQuote(candidate: string, rawText: string): VerifiedQuoteResult {
    const trimmed = candidate.trim();
    if (!trimmed) {
      return { isVerbatim: false, exactSubstring: '', hedgesFound: [] };
    }

    // Direct substring check
    const directIdx = rawText.indexOf(trimmed);
    if (directIdx !== -1) {
      const hedges = this.detectHedges(trimmed);
      const lineNumber = rawText.slice(0, directIdx).split('\n').length;
      return {
        isVerbatim: true,
        exactSubstring: trimmed,
        hedgesFound: hedges,
        lineNumber,
        highlightIndices: [directIdx, directIdx + trimmed.length]
      };
    }

    // Normalized whitespace comparison
    const normalizedRaw = rawText.replace(/\s+/g, ' ');
    const normalizedCandidate = trimmed.replace(/\s+/g, ' ');
    const normIdx = normalizedRaw.indexOf(normalizedCandidate);

    if (normIdx !== -1) {
      const hedges = this.detectHedges(trimmed);
      return {
        isVerbatim: true,
        exactSubstring: trimmed,
        hedgesFound: hedges
      };
    }

    return {
      isVerbatim: false,
      exactSubstring: trimmed,
      hedgesFound: []
    };
  }

  /**
   * Detects vague legal hedges in a sentence
   */
  public static detectHedges(text: string): string[] {
    const matched: string[] = [];
    for (const hedge of VAGUENESS_HEDGES) {
      hedge.regex.lastIndex = 0;
      if (hedge.regex.test(text)) {
        matched.push(hedge.phrase);
      }
    }
    return matched;
  }

  /**
   * Extracts clean evidence object
   */
  public static createEvidence(
    quote: string,
    rawText: string,
    sectionName?: string
  ): VerbatimEvidence | null {
    const result = this.verifyQuote(quote, rawText);
    if (!result.isVerbatim && quote.length > 20) {
      // In rare boundary cases, attempt sentence boundary match
      return {
        quote: quote.trim(),
        sourceSection: sectionName,
        hedgesFound: this.detectHedges(quote)
      };
    }

    return {
      quote: result.exactSubstring,
      sourceSection: sectionName,
      hedgesFound: result.hedgesFound,
      lineNumber: result.lineNumber,
      highlightIndices: result.highlightIndices
    };
  }
}
