// Predefined sensitive regions for demo screenshots (normalized 0..1 coordinates).
// These represent where the AI vision system would detect sensitive text.
import type { SensitivePattern } from "./ai-blur";

export interface SensitiveRegionDef {
  x: number; // 0..1
  y: number;
  w: number;
  h: number;
  pattern: SensitivePattern;
  text: string;
}

export const DEMO_SENSITIVE_REGIONS: Record<string, SensitiveRegionDef[]> = {
  "demo-support": [
    { x: 0.422, y: 0.213, w: 0.235, h: 0.045, pattern: "email", text: "sarah.johnson@gmail.com" },
    { x: 0.641, y: 0.213, w: 0.16, h: 0.045, pattern: "phone", text: "+1 (415) 555-0142" },
    { x: 0.422, y: 0.283, w: 0.235, h: 0.045, pattern: "email", text: "ahmed.khan@gmail.com" },
    { x: 0.641, y: 0.283, w: 0.16, h: 0.045, pattern: "phone", text: "+92 321 1234567" },
    { x: 0.422, y: 0.353, w: 0.235, h: 0.045, pattern: "email", text: "maria.g@outlook.com" },
    { x: 0.641, y: 0.353, w: 0.16, h: 0.045, pattern: "phone", text: "(555) 987-6543" },
    { x: 0.422, y: 0.423, w: 0.235, h: 0.045, pattern: "email", text: "david.chen@yahoo.com" },
    { x: 0.641, y: 0.423, w: 0.16, h: 0.045, pattern: "phone", text: "+1 (628) 220-3344" },
    { x: 0.422, y: 0.493, w: 0.235, h: 0.045, pattern: "email", text: "fatima.ali@gmail.com" },
    { x: 0.641, y: 0.493, w: 0.16, h: 0.045, pattern: "phone", text: "0300-1234567" },
    { x: 0.422, y: 0.563, w: 0.235, h: 0.045, pattern: "email", text: "r.smith@company.com" },
    { x: 0.641, y: 0.563, w: 0.16, h: 0.045, pattern: "phone", text: "+1 (212) 555-7890" },
  ],
  "demo-checkout": [
    { x: 0.056, y: 0.225, w: 0.46, h: 0.05, pattern: "card", text: "4111 1111 1111 1111" },
    { x: 0.056, y: 0.55, w: 0.46, h: 0.05, pattern: "email", text: "ahmed.raza@gmail.com" },
    { x: 0.056, y: 0.675, w: 0.46, h: 0.05, pattern: "phone", text: "+92 321 7654321" },
    { x: 0.056, y: 0.775, w: 0.46, h: 0.05, pattern: "cnic", text: "35201-1234567-1" },
  ],
  "demo-code": [
    { x: 0.07, y: 0.72, w: 0.22, h: 0.03, pattern: "email", text: "billing@snapmark.io" },
    { x: 0.07, y: 0.89, w: 0.2, h: 0.03, pattern: "phone", text: "+1 (415) 555-0199" },
  ],
  "demo-analytics": [
    { x: 0.69, y: 0.543, w: 0.21, h: 0.027, pattern: "email", text: "billing@acme.com" },
    { x: 0.69, y: 0.613, w: 0.21, h: 0.027, pattern: "email", text: "ops@globex.io" },
    { x: 0.69, y: 0.683, w: 0.24, h: 0.027, pattern: "email", text: "finance@initech.com" },
    { x: 0.69, y: 0.753, w: 0.25, h: 0.027, pattern: "email", text: "support@umbrella.dev" },
    { x: 0.078, y: 0.785, w: 0.27, h: 0.03, pattern: "email", text: "jamie.rodriguez@growthlytics.io" },
    { x: 0.078, y: 0.81, w: 0.18, h: 0.03, pattern: "phone", text: "+1 (415) 555-0142" },
  ],
};
