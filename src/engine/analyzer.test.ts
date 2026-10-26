import { describe, it, expect } from 'vitest';
import { PolicyAnalyzerEngine } from './analyzer';
import { SAMPLE_POLICIES } from '../data/samples';
import { QuoteVerifier } from './quoteVerifier';

describe('PolicyAnalyzerEngine & QuoteVerifier', () => {
  it('extracts categories from Swiggy sample policy', () => {
    const swiggy = SAMPLE_POLICIES[0];
    const result = PolicyAnalyzerEngine.analyze(swiggy.text, swiggy.name);

    expect(result.isValidPolicy).toBe(true);
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

  it('handles invalid or non-privacy text honestly with isValidPolicy: false', () => {
    // 1. Brief text
    const briefText = 'This is an ordinary recipe for chocolate cake.';
    const briefResult = PolicyAnalyzerEngine.analyze(briefText, 'Cake Recipe');
    expect(briefResult.isValidPolicy).toBe(false);
    expect(briefResult.emptyReason).toContain('too brief');

    // 2. Long non-privacy text (> 30 words)
    const longNonPolicyText = 'This is an ordinary recipe for chocolate cake. Mix flour, cocoa powder, sugar, baking soda, and salt in a large bowl. In another bowl, combine eggs, milk, vegetable oil, and vanilla extract. Whisk the wet ingredients into the dry ingredients until smooth. Pour the batter into greased pans and bake for thirty-five minutes at three hundred fifty degrees until a toothpick inserted into the center comes out clean.';
    const result = PolicyAnalyzerEngine.analyze(longNonPolicyText, 'Baking Recipe');

    expect(result.isValidPolicy).toBe(false);
    expect(result.discoveredDataTypes.length).toBe(0);
    expect(result.emptyReason).toContain('No personal data categories');
  });

  it('produces different trails for different policies', () => {
    const swiggy = SAMPLE_POLICIES[0];
    const whatsapp = SAMPLE_POLICIES[2];

    const swiggyResult = PolicyAnalyzerEngine.analyze(swiggy.text, swiggy.name);
    const whatsappResult = PolicyAnalyzerEngine.analyze(whatsapp.text, whatsapp.name);

    expect(swiggyResult.policyTitle).not.toBe(whatsappResult.policyTitle);
    // WhatsApp should discover communications & messages
    const waComms = whatsappResult.discoveredDataTypes.find(t => t.id === 'communications');
    expect(waComms).toBeDefined();
    // Swiggy should discover financial & payment data
    const swiggyFinance = swiggyResult.discoveredDataTypes.find(t => t.id === 'financial');
    expect(swiggyFinance).toBeDefined();
  });

  it('guarantees 100% of extracted quotes across all sample policies exist verbatim in source text', () => {
    for (const sample of SAMPLE_POLICIES) {
      const result = PolicyAnalyzerEngine.analyze(sample.text, sample.name);
      for (const dataType of result.discoveredDataTypes) {
        for (const stageKey of ['collect', 'use', 'share', 'keep'] as const) {
          const stage = dataType.stages[stageKey];
          for (const ev of stage.evidence) {
            expect(sample.text).toContain(ev.quote);
          }
        }
      }
    }
  });
});
