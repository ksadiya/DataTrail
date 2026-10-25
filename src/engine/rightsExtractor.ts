import { QuoteVerifier } from './quoteVerifier';

export interface RightsAndContactsResult {
  grievanceOfficerFound: boolean;
  grievanceOfficerName?: string;
  grievanceOfficerEmail?: string;
  grievanceOfficerAddress?: string;
  dpoEmail?: string;
  deletionProcedureStated: boolean;
  deletionSummary?: string;
  optOutStated: boolean;
  evidenceQuotes: string[];
}

export class RightsExtractor {
  public static extract(rawText: string): RightsAndContactsResult {
    const evidenceQuotes: string[] = [];

    // Grievance Officer detection
    const grievanceRegex = /(?:grievance\s*(?:officer|redressal|contact)|nodal\s*officer)/i;
    const grievanceFound = grievanceRegex.test(rawText);

    // Email extraction
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = rawText.match(emailRegex) || [];

    let grievanceEmail: string | undefined;
    let dpoEmail: string | undefined;

    for (const email of emails) {
      if (/grievance/i.test(email)) {
        grievanceEmail = email;
      } else if (/(?:dpo|privacy|protection|compliance)/i.test(email) && !dpoEmail) {
        dpoEmail = email;
      }
    }

    if (!grievanceEmail && emails.length > 0) {
      grievanceEmail = emails[0];
    }

    // Name extraction around grievance officer
    let grievanceName: string | undefined;
    const nameMatch = rawText.match(/Grievance\s+Officer\s*:\s*(?:Mr\.|Ms\.|Dr\.)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
    if (nameMatch) {
      grievanceName = nameMatch[1];
    }

    // Address extraction around grievance
    let grievanceAddress: string | undefined;
    const addressMatch = rawText.match(/Address\s*:\s*([^\n\r]+(?:,\s*[^\n\r]+){2,})/i);
    if (addressMatch) {
      grievanceAddress = addressMatch[1].trim();
    }

    // Deletion procedure detection
    const deletionRegex = /\b(?:delete\s+(?:your\s+)?account|request\s+(?:the\s+)?deletion|right\s+to\s+erasure|erasure\s+or\s+deletion)\b/i;
    const deletionFound = deletionRegex.test(rawText);
    let deletionSummary: string | undefined;

    // Split into sentences to capture verbatim quotes
    const sentences = rawText.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      const s = sentence.trim();
      if (s.length > 30 && s.length < 300) {
        if (grievanceRegex.test(s) && evidenceQuotes.length < 3) {
          const ev = QuoteVerifier.createEvidence(s, rawText, 'Grievance Redressal');
          if (ev) evidenceQuotes.push(ev.quote);
        } else if (deletionRegex.test(s) && !deletionSummary) {
          deletionSummary = s;
          const ev = QuoteVerifier.createEvidence(s, rawText, 'User Rights & Deletion');
          if (ev && !evidenceQuotes.includes(ev.quote)) evidenceQuotes.push(ev.quote);
        }
      }
    }

    const optOutRegex = /\b(?:opt-out|unsubscribe|marketing\s*communications|settings)\b/i;
    const optOutFound = optOutRegex.test(rawText);

    return {
      grievanceOfficerFound: grievanceFound,
      grievanceOfficerName: grievanceName,
      grievanceOfficerEmail: grievanceEmail,
      grievanceOfficerAddress: grievanceAddress,
      dpoEmail: dpoEmail,
      deletionProcedureStated: deletionFound,
      deletionSummary: deletionSummary || (deletionFound ? 'Policy states user may request account and personal data deletion via settings or support.' : undefined),
      optOutStated: optOutFound,
      evidenceQuotes
    };
  }
}
