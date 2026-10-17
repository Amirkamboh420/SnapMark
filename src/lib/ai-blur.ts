// SnapMark — AI Auto-Blur detection (regex-based for sensitive info)
// Detects: emails, phone numbers (intl + PK + US), credit cards, CNIC (Pakistani ID)

export type SensitivePattern = "email" | "phone" | "card" | "cnic";

export interface DetectedRegion {
  id: string;
  pattern: SensitivePattern;
  text: string;
  // bounding box relative to canvas (0..1 normalized) OR pixel coords
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number; // 0..1
  blurred: boolean;
}

const PATTERNS: { type: SensitivePattern; regex: RegExp; label: string }[] = [
  {
    type: "email",
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    label: "Email",
  },
  {
    type: "phone",
    // intl + PK + US formats
    regex: /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}|\+92[-.\s]?\d{3}[-.\s]?\d{7}|03\d{2}[-.\s]?\d{7}/g,
    label: "Phone",
  },
  {
    type: "card",
    regex: /\b(?:\d[ -]*?){13,16}\b|\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g,
    label: "Card",
  },
  {
    type: "cnic",
    regex: /\b\d{5}-\d{7}-\d\b/g,
    label: "CNIC",
  },
];

export function scanTextForSensitive(text: string): {
  type: SensitivePattern;
  match: string;
  index: number;
  label: string;
}[] {
  const results: { type: SensitivePattern; match: string; index: number; label: string }[] = [];
  for (const p of PATTERNS) {
    const re = new RegExp(p.regex.source, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      // Luhn-ish sanity for card numbers (avoid false positives on long random numbers)
      if (p.type === "card") {
        const digits = m[0].replace(/\D/g, "");
        if (digits.length < 13 || digits.length > 16) continue;
        if (!luhnCheck(digits)) continue;
      }
      results.push({ type: p.type, match: m[0], index: m.index, label: p.label });
    }
  }
  return results;
}

function luhnCheck(num: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export const PATTERN_INFO: Record<SensitivePattern, { label: string; color: string; description: string }> = {
  email: {
    label: "Email Address",
    color: "#f59e0b",
    description: "Personal email addresses that could identify individuals.",
  },
  phone: {
    label: "Phone Number",
    color: "#10b981",
    description: "Phone numbers in international, US, or Pakistani formats.",
  },
  card: {
    label: "Credit Card",
    color: "#ef4444",
    description: "16-digit card numbers (Luhn-validated to reduce false positives).",
  },
  cnic: {
    label: "CNIC / ID Number",
    color: "#8b5cf6",
    description: "Pakistani national ID format (XXXXX-XXXXXXX-X).",
  },
};

// Generate a sample "sensitive text" overlay so the AI blur demo is realistic.
export const SAMPLE_SENSITIVE_TEXTS = [
  "support@snapmark.io",
  "ahmed.khan@gmail.com",
  "+1 (415) 555-0142",
  "+92 321 1234567",
  "0300-1234567",
  "4111-1111-1111-1111",
  "35201-1234567-1",
  "billing@company.com",
  "(555) 987-6543",
];
