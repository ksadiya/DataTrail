import { describe, it, expect } from 'vitest';
import { PolicyAnalyzerEngine } from './analyzer';
import { SAMPLE_POLICIES } from '../data/samples';
import { QuoteVerifier } from './quoteVerifier';

describe('PolicyAnalyzerEngine & QuoteVerifier', () => {
  it('extracts categories from Swiggy sample policy', () => {
    const swiggy = SAMPLE_POLICIES[0];
    const result = PolicyAnalyzerEngine.analyze(swiggy.text, swiggy.name);

    expect(result.discoveredDataTypes.length).toBeGreaterThanOrEqual(3);
    const locationType = result.discoveredDataTypes.find(t => t.id === 'location');
    expect(locationType).toBeDefined();

    // Verify 4 stages exist
    expect(locationType?.stages.collect).toBeDefined();
    expect(locationType?.stages.use).toBeDefined();
    expect(locationType?.stages.share).toBeDefined();
    expect(locationType?.stages.keep).toBeDefined();

    // Swiggy collect stage should have quotes
    expect(locationType?.stages.collect.evidence.length).toBeGreaterThan(0);
    const quote = locationType?.stages.collect.evidence[0].quote;
    expect(quote).toBeTruthy();

    // Verify verbatim quote is actually in the raw policy text!
    if (quote) {
      expect(swiggy.text.includes(quote)).toBe(true);
    }
  });

  it('detects grievance officer details', () => {
    const swiggy = SAMPLE_POLICIES[0];
    const result = PolicyAnalyzerEngine.analyze(swiggy.text, swiggy.name);

    expect(result.rightsAndContacts.grievanceOfficerFound).toBe(true);
    expect(result.rightsAndContacts.grievanceOfficerEmail).toBe('grievanceofficer@swiggy.in');
  });

  it('verifies quote verifier returns valid substring', () => {
    const text = 'We collect precise location data when the app is in the background.';
    const verification = QuoteVerifier.verifyQuote('precise location data', text);
    expect(verification.isVerbatim).toBe(true);
    expect(verification.exactSubstring).toBe('precise location data');
  });
});
