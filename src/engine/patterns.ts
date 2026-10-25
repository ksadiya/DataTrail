export interface CategoryDefinition {
  id: string;
  label: string;
  iconName: string;
  categoryName: string;
  description: string;
  keywords: RegExp[];
  stageKeywords: {
    collect: RegExp[];
    use: RegExp[];
    share: RegExp[];
    keep: RegExp[];
  };
  necessityBaseline: {
    coreUtilityRelation: string;
    expectedRetention: string;
    sharingExpectation: string;
  };
}

export const VAGUENESS_HEDGES: { phrase: string; regex: RegExp; impact: 'high' | 'medium' | 'low'; explanation: string }[] = [
  {
    phrase: 'including but not limited to',
    regex: /\bincluding\s+(?:but\s+not\s+limited\s+to|without\s+limitation)\b/gi,
    impact: 'high',
    explanation: 'Expands data handling scope indefinitely without establishing an exhaustive legal boundary.'
  },
  {
    phrase: 'may collect / may share',
    regex: /\bmay\s+(?:collect|share|disclose|transfer|store|access|use|retain)\b/gi,
    impact: 'medium',
    explanation: 'Expresses potential permission rather than a binding commitment or definite constraint.'
  },
  {
    phrase: 'as long as necessary',
    regex: /\b(?:as\s+long\s+as\s+necessary|for\s+the\s+period\s+necessary|as\s+deemed\s+necessary)\b/gi,
    impact: 'high',
    explanation: 'Leaves the retention schedule entirely at the company’s discretion with no concrete time limit.'
  },
  {
    phrase: 'commercial / business partners',
    regex: /\b(?:commercial|merchant|marketing|business|advertising)\s+partners\b/gi,
    impact: 'medium',
    explanation: 'Discloses data to unnamed third-party entities whose identities and safeguards are undisclosed.'
  },
  {
    phrase: 'legitimate business need',
    regex: /\blegitimate\s+(?:legal\s+or\s+)?business\s+(?:need|purpose|interest)s?\b/gi,
    impact: 'medium',
    explanation: 'Subjective legal justification not tied to explicit contractual fulfillment.'
  },
  {
    phrase: 'from time to time',
    regex: /\bfrom\s+time\s+to\s+time\b/gi,
    impact: 'medium',
    explanation: 'Allows indefinite ongoing collection or sharing without renewed user consent.'
  },
  {
    phrase: 'relevant / tailored offerings',
    regex: /\b(?:relevant|tailored|personalized|targeted)\s+(?:offerings|ads|advertisements|promotions|content)\b/gi,
    impact: 'low',
    explanation: 'Signals secondary profiling and third-party advertising monetization.'
  },
  {
    phrase: 'such other purposes',
    regex: /\bsuch\s+other\s+purposes?\b/gi,
    impact: 'high',
    explanation: 'Catch-all clause granting unilateral discretion for unstated uses.'
  }
];

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    id: 'location',
    label: 'Precise Geolocation & GPS',
    iconName: 'MapPin',
    categoryName: 'Sensory & Physical Telemetry',
    description: 'Real-time GPS coordinates, Wi-Fi BSSID access points, cell towers, and background movement tracking.',
    keywords: [
      /\b(?:precise|approximate|real-time|coarse)?\s*location\s*(?:data|information)?\b/i,
      /\bgps\b/i,
      /\bgeolocation\b/i,
      /\bwi-fi\s*access\s*points?\b/i,
      /\bcell(?:ular)?\s*(?:towers?|network)\b/i,
      /\bbackground\s*(?:location|tracking)\b/i
    ],
    stageKeywords: {
      collect: [/\b(?:collect|receive|gather|access|permit|settings|foreground|background|device)\b/i],
      use: [/\b(?:deliver|delivery|track|estimate|suggest|nearby|calculate|restaurant|store|check-in|fulfill)\b/i],
      share: [/\b(?:delivery\s*partners?|merchants?|vendors?|service\s*providers?|logistics|affiliates|authorities)\b/i],
      keep: [/\b(?:retain|store|period|delete|deletion|anonymize|history|duration|as\s+long\s+as)\b/i]
    },
    necessityBaseline: {
      coreUtilityRelation: 'Delivery, navigation, and localized dispatch rely directly on physical coordinates.',
      expectedRetention: 'Retention should ideally terminate once order fulfillment or trip completion is finalized, except minimal audit logs.',
      sharingExpectation: 'Strictly shared with the assigned courier/merchant for direct delivery fulfillment.'
    }
  },
  {
    id: 'contacts',
    label: 'Contact List & Address Book',
    iconName: 'Users',
    categoryName: 'Social Graph & Communications',
    description: 'Personal address book, friend connections, phone numbers, and phonebook synchronization.',
    keywords: [
      /\b(?:address\s*book|contact\s*list|contacts|phonebook)\b/i,
      /\b(?:friends?|referral\s*programs?|bill\s*splitting)\b/i
    ],
    stageKeywords: {
      collect: [/\b(?:access|sync|store|permit|device\s*permissions?|upload|regularly\s*access)\b/i],
      use: [/\b(?:referral|split|share|discover|invite|gift|connect|social)\b/i],
      share: [/\b(?:friends|contacts|recipients|affiliates|third\s*parties)\b/i],
      keep: [/\b(?:store|retain|delete|authorization|manage)\b/i]
    },
    necessityBaseline: {
      coreUtilityRelation: 'Address book access is secondary/optional for convenience (e.g. referrals, bill splitting) and is NOT required for basic utility.',
      expectedRetention: 'Should not be indefinitely cached on cloud servers if the user does not use social sharing.',
      sharingExpectation: 'Should never be shared with advertisers or third-party brokers.'
    }
  },
  {
    id: 'device_ids',
    label: 'Device Identifiers & Telemetry',
    iconName: 'Smartphone',
    categoryName: 'Hardware & Network Fingerprinting',
    description: 'Hardware model, IMEI, MAC address, Android ID, Advertising ID (IDFA), IP address, and OS telemetry.',
    keywords: [
      /\b(?:device\s*identifiers?|hardware\s*model|operating\s*system|os\s*version)\b/i,
      /\b(?:imei|mac\s*address|android\s*id|idfa|advertising\s*id|ip\s*address)\b/i,
      /\b(?:telemetry|crash\s*logs?|connection\s*information|battery\s*level)\b/i
    ],
    stageKeywords: {
      collect: [/\b(?:automatically\s*collect|record|gather|receive|hardware|connection)\b/i],
      use: [/\b(?:troubleshoot|diagnostics?|maintenance|fraud|security|integrity|support|verification)\b/i],
      share: [/\b(?:analytics|advertising\s*networks?|vendors?|affiliates|sponsors|attribution)\b/i],
      keep: [/\b(?:retain|store|statutory|anonymize|erasure|period)\b/i]
    },
    necessityBaseline: {
      coreUtilityRelation: 'Basic OS and IP logging is standard for security and fraud prevention, but persistent hardware IDs enable cross-app tracking.',
      expectedRetention: 'Technical logs should rotate and purge within 30 to 90 days.',
      sharingExpectation: 'Frequently shared with commercial analytics and ad attribution networks.'
    }
  },
  {
    id: 'financial',
    label: 'Financial & Transaction Records',
    iconName: 'CreditCard',
    categoryName: 'Monetary & Commercial Records',
    description: 'Payment transactions, card tokenization, order invoices, billing addresses, and tax records.',
    keywords: [
      /\b(?:financial|transactional?|payment\s*card|order\s*history|invoice|billing|tokenized)\b/i,
      /\b(?:rbi|payment\s*gateway|tax\s*invoices?|accounting)\b/i
    ],
    stageKeywords: {
      collect: [/\b(?:collect|process|details|amount|order|history|gateway)\b/i],
      use: [/\b(?:fulfill|process|accounting|tax|dispute|settlement|support)\b/i],
      share: [/\b(?:payment\s*gateway|banks?|regulators?|authorities|tax|merchants?)\b/i],
      keep: [/\b(?:years?|statutory|compliance|audit|retain|statute)\b/i]
    },
    necessityBaseline: {
      coreUtilityRelation: 'Directly necessary to complete transactions and issue receipts.',
      expectedRetention: 'Strict statutory retention (often 5 to 8 years under Indian taxation and banking laws).',
      sharingExpectation: 'Confined to certified payment processors and tax authorities.'
    }
  },
  {
    id: 'communications',
    label: 'Communications & Messages',
    iconName: 'MessageSquare',
    categoryName: 'User Content & Transmissions',
    description: 'Message contents, chats, media attachments, customer support transcripts, and metadata.',
    keywords: [
      /\b(?:messages?|chats?|voice\s*messages?|support\s*inquiries?|transcripts?)\b/i,
      /\b(?:end-to-end\s*encrypt(?:ed|ion)?|communication\s*logs?)\b/i
    ],
    stageKeywords: {
      collect: [/\b(?:receive|collect|transmit|deliver|support|feedback)\b/i],
      use: [/\b(?:operate|provide|troubleshoot|safety|integrity|customer\s*support)\b/i],
      share: [/\b(?:recipient|contacts|service\s*providers|law\s*enforcement)\b/i],
      keep: [/\b(?:delete|deleted|servers?|30\s*days?|retain|undelivered)\b/i]
    },
    necessityBaseline: {
      coreUtilityRelation: 'Core functionality for communication apps; customer service records for commerce apps.',
      expectedRetention: 'End-to-end encrypted messages should not be stored once delivered. Support tickets kept for dispute history.',
      sharingExpectation: 'Delivered only to intended recipients; never commercialized.'
    }
  },
  {
    id: 'biometric',
    label: 'Biometric & Identity Verification',
    iconName: 'Fingerprint',
    categoryName: 'Sensitive Biological Identifiers',
    description: 'Fingerprints, facial geometry recognition, voice recognition, and official government IDs.',
    keywords: [
      /\bbiometric\b/i,
      /\bfingerprints?\b/i,
      /\bfacial\s*(?:recognition|geometry)\b/i,
      /\bvoice\s*prints?\b/i
    ],
    stageKeywords: {
      collect: [/\b(?:collect|gather|scan|verify|identity)\b/i],
      use: [/\b(?:authenticate|verification|security|access)\b/i],
      share: [/\b(?:identity\s*vendors?|government|verification\s*partners?)\b/i],
      keep: [/\b(?:retain|erasure|purge|immediate)\b/i]
    },
    necessityBaseline: {
      coreUtilityRelation: 'Highly sensitive data requiring strict local device storage or cryptographic hashing.',
      expectedRetention: 'Should be discarded immediately after verification.',
      sharingExpectation: 'No third-party marketing or cross-platform transmission.'
    }
  }
];
