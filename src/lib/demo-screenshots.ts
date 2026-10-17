// Demo screenshots rendered as SVG data URLs.
// Each simulates a real webpage screenshot containing sensitive info the AI blur can detect.

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const baseStyle = `
  font-family: -apple-system, 'Segoe UI', Roboto, sans-serif;
`;

export interface DemoScreenshot {
  id: string;
  title: string;
  captureType: "full-page" | "visible" | "selected";
  category: string;
  width: number;
  height: number;
  dataUrl: string;
  tags: string[];
}

// 1. Customer support dashboard with user emails + phone
const supportDashboard = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <rect width="1280" height="800" fill="#f8fafc"/>
  <rect width="1280" height="56" fill="#0f172a"/>
  <text x="24" y="35" fill="#fff" font-size="18" font-weight="700" ${baseStyle}>ZenDesk Support</text>
  <circle cx="1240" cy="28" r="14" fill="#10b981"/>
  <text x="1190" y="33" fill="#cbd5e1" font-size="13" ${baseStyle}>Admin</text>
  <!-- sidebar -->
  <rect x="0" y="56" width="220" height="744" fill="#1e293b"/>
  <text x="24" y="100" fill="#94a3b8" font-size="12" font-weight="600" ${baseStyle}>TICKETS</text>
  <rect x="0" y="112" width="220" height="40" fill="#334155"/>
  <text x="24" y="136" fill="#fff" font-size="13" ${baseStyle}>● Open (24)</text>
  <text x="24" y="172" fill="#94a3b8" font-size="13" ${baseStyle}>Pending (8)</text>
  <text x="24" y="208" fill="#94a3b8" font-size="13" ${baseStyle}>Resolved (142)</text>
  <text x="24" y="260" fill="#94a3b8" font-size="12" font-weight="600" ${baseStyle}>CUSTOMERS</text>
  <text x="24" y="292" fill="#94a3b8" font-size="13" ${baseStyle}>All users</text>
  <text x="24" y="320" fill="#94a3b8" font-size="13" ${baseStyle}>Segments</text>
  <!-- main -->
  <rect x="240" y="72" width="1020" height="36" rx="6" fill="#fff" stroke="#e2e8f0"/>
  <text x="260" y="95" fill="#94a3b8" font-size="13" ${baseStyle}>Search tickets, customers...</text>
  <!-- table -->
  <rect x="240" y="120" width="1020" height="660" rx="8" fill="#fff" stroke="#e2e8f0"/>
  <rect x="240" y="120" width="1020" height="44" rx="8" fill="#f1f5f9"/>
  <text x="264" y="148" fill="#475569" font-size="12" font-weight="600" ${baseStyle}>CUSTOMER</text>
  <text x="540" y="148" fill="#475569" font-size="12" font-weight="600" ${baseStyle}>EMAIL</text>
  <text x="820" y="148" fill="#475569" font-size="12" font-weight="600" ${baseStyle}>PHONE</text>
  <text x="1020" y="148" fill="#475569" font-size="12" font-weight="600" ${baseStyle}>STATUS</text>
  ${[
    ["Sarah Johnson", "sarah.johnson@gmail.com", "+1 (415) 555-0142", "Open", "#ef4444"],
    ["Ahmed Khan", "ahmed.khan@gmail.com", "+92 321 1234567", "Open", "#ef4444"],
    ["Maria Garcia", "maria.g@outlook.com", "(555) 987-6543", "Pending", "#f59e0b"],
    ["David Chen", "david.chen@yahoo.com", "+1 (628) 220-3344", "Open", "#ef4444"],
    ["Fatima Ali", "fatima.ali@gmail.com", "0300-1234567", "Resolved", "#10b981"],
    ["Robert Smith", "r.smith@company.com", "+1 (212) 555-7890", "Open", "#ef4444"],
  ].map((r, i) => {
    const y = 188 + i * 56;
    return `
      <rect x="240" y="${y - 12}" width="1020" height="52" fill="${i % 2 ? "#f8fafc" : "#fff"}"/>
      <circle cx="288" cy="${y + 8}" r="14" fill="#cbd5e1"/>
      <text x="264" y="${y + 12}" fill="#1e293b" font-size="13" font-weight="600" ${baseStyle}>${r[0]}</text>
      <text x="540" y="${y + 12}" fill="#0ea5e9" font-size="13" ${baseStyle}>${r[1]}</text>
      <text x="820" y="${y + 12}" fill="#475569" font-size="13" ${baseStyle}>${r[2]}</text>
      <rect x="1020" y="${y - 4}" width="64" height="24" rx="12" fill="${r[4]}22"/>
      <text x="1036" y="${y + 12}" fill="${r[4]}" font-size="11" font-weight="600" ${baseStyle}>${r[3]}</text>
    `;
  }).join("")}
</svg>`;

// 2. Checkout / payment page with card number
const checkoutPage = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <rect width="1280" height="800" fill="#f1f5f9"/>
  <rect width="1280" height="64" fill="#fff" stroke="#e2e8f0"/>
  <text x="40" y="40" fill="#0f172a" font-size="22" font-weight="700" ${baseStyle}>ShopVerse</text>
  <text x="640" y="40" fill="#475569" font-size="14" ${baseStyle}>Secure Checkout</text>
  <text x="1200" y="40" fill="#10b981" font-size="13" font-weight="600" ${baseStyle} text-anchor="end">🔒 SSL Secured</text>
  <!-- left: form -->
  <rect x="48" y="96" width="640" height="680" rx="12" fill="#fff" stroke="#e2e8f0"/>
  <text x="72" y="132" fill="#0f172a" font-size="16" font-weight="700" ${baseStyle}>Payment Details</text>
  <text x="72" y="172" fill="#64748b" font-size="12" ${baseStyle}>Card Number</text>
  <rect x="72" y="180" width="592" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="88" y="206" fill="#0f172a" font-size="14" font-weight="600" ${baseStyle}>4111 1111 1111 1111</text>
  <rect x="620" y="190" width="28" height="20" rx="3" fill="#1e293b"/>
  <text x="634" y="204" fill="#fff" font-size="9" font-weight="700" text-anchor="middle" ${baseStyle}>VISA</text>
  <text x="72" y="252" fill="#64748b" font-size="12" ${baseStyle}>Cardholder Name</text>
  <rect x="72" y="260" width="592" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="88" y="286" fill="#0f172a" font-size="14" ${baseStyle}>Ahmed Raza Khan</text>
  <text x="72" y="332" fill="#64748b" font-size="12" ${baseStyle}>Expiry / CVV</text>
  <rect x="72" y="340" width="280" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="88" y="366" fill="#0f172a" font-size="14" ${baseStyle}>12 / 27</text>
  <rect x="384" y="340" width="280" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="400" y="366" fill="#0f172a" font-size="14" ${baseStyle}>•••</text>
  <text x="72" y="432" fill="#64748b" font-size="12" ${baseStyle}>Billing Email</text>
  <rect x="72" y="440" width="592" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="88" y="466" fill="#0f172a" font-size="14" ${baseStyle}>ahmed.raza@gmail.com</text>
  <text x="72" y="532" fill="#64748b" font-size="12" ${baseStyle}>Phone (for OTP)</text>
  <rect x="72" y="540" width="592" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="88" y="566" fill="#0f172a" font-size="14" ${baseStyle}>+92 321 7654321</text>
  <text x="72" y="612" fill="#64748b" font-size="12" ${baseStyle}>National ID (CNIC)</text>
  <rect x="72" y="620" width="592" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
  <text x="88" y="646" fill="#0f172a" font-size="14" ${baseStyle}>35201-1234567-1</text>
  <rect x="72" y="700" width="592" height="48" rx="8" fill="#10b981"/>
  <text x="368" y="730" fill="#fff" font-size="15" font-weight="700" text-anchor="middle" ${baseStyle}>Pay $129.00</text>
  <!-- right: summary -->
  <rect x="720" y="96" width="512" height="680" rx="12" fill="#fff" stroke="#e2e8f0"/>
  <text x="744" y="132" fill="#0f172a" font-size="16" font-weight="700" ${baseStyle}>Order Summary</text>
  ${[
    ["Wireless Headphones Pro", "$89.00"],
    ["USB-C Cable 2m", "$12.00"],
    ["Extended Warranty", "$28.00"],
  ].map((r, i) => {
    const y = 168 + i * 56;
    return `
      <rect x="744" y="${y - 14}" width="464" height="44" rx="6" fill="#f8fafc"/>
      <text x="760" y="${y + 12}" fill="#1e293b" font-size="13" ${baseStyle}>${r[0]}</text>
      <text x="1192" y="${y + 12}" fill="#0f172a" font-size="13" font-weight="600" text-anchor="end" ${baseStyle}>${r[1]}</text>
    `;
  }).join("")}
  <line x1="744" y1="360" x2="1208" y2="360" stroke="#e2e8f0"/>
  <text x="744" y="392" fill="#475569" font-size="13" ${baseStyle}>Subtotal</text>
  <text x="1208" y="392" fill="#0f172a" font-size="13" font-weight="600" text-anchor="end" ${baseStyle}>$129.00</text>
  <text x="744" y="420" fill="#475569" font-size="13" ${baseStyle}>Shipping</text>
  <text x="1208" y="420" fill="#10b981" font-size="13" font-weight="600" text-anchor="end" ${baseStyle}>FREE</text>
  <text x="744" y="448" fill="#475569" font-size="13" ${baseStyle}>Tax</text>
  <text x="1208" y="448" fill="#0f172a" font-size="13" font-weight="600" text-anchor="end" ${baseStyle}>$0.00</text>
  <rect x="744" y="480" width="464" height="60" rx="8" fill="#ecfdf5"/>
  <text x="760" y="516" fill="#065f46" font-size="15" font-weight="700" ${baseStyle}>Total</text>
  <text x="1192" y="516" fill="#065f46" font-size="18" font-weight="700" text-anchor="end" ${baseStyle}>$129.00</text>
</svg>`;

// 3. Bug report — code editor with stack trace
const codeEditor = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <rect width="1280" height="800" fill="#1e1e2e"/>
  <rect width="1280" height="40" fill="#181825"/>
  <circle cx="20" cy="20" r="6" fill="#f38ba8"/>
  <circle cx="40" cy="20" r="6" fill="#f9e2af"/>
  <circle cx="60" cy="20" r="6" fill="#a6e3a1"/>
  <text x="640" y="25" fill="#cdd6f4" font-size="12" text-anchor="middle" ${baseStyle}>api/users/route.ts — SnapMark Backend</text>
  <!-- file tabs -->
  <rect x="0" y="40" width="180" height="32" fill="#1e1e2e"/>
  <text x="16" y="60" fill="#cdd6f4" font-size="12" ${baseStyle}>📄 users.ts</text>
  <rect x="180" y="40" width="180" height="32" fill="#313244"/>
  <text x="196" y="60" fill="#f9e2af" font-size="12" ${baseStyle}>⚠ auth.ts</text>
  <!-- code -->
  <text x="20" y="100" fill="#6c7086" font-size="12" ${baseStyle}>1</text>
  <text x="48" y="100" fill="#cba6f7" font-size="12" ${baseStyle}>import</text>
  <text x="108" y="100" fill="#cdd6f4" font-size="12" ${baseStyle}>{ db, auth } </text>
  <text x="232" y="100" fill="#cba6f7" font-size="12" ${baseStyle}>from</text>
  <text x="276" y="100" fill="#a6e3a1" font-size="12" ${baseStyle}>'@/lib'</text>
  <text x="20" y="124" fill="#6c7086" font-size="12" ${baseStyle}>2</text>
  <text x="48" y="124" fill="#6c7086" font-size="12" ${baseStyle}></text>
  <text x="20" y="148" fill="#6c7086" font-size="12" ${baseStyle}>3</text>
  <text x="48" y="148" fill="#89b4fa" font-size="12" ${baseStyle}>export async function</text>
  <text x="244" y="148" fill="#f9e2af" font-size="12" ${baseStyle}>GET</text>
  <text x="280" y="148" fill="#cdd6f4" font-size="12" ${baseStyle}>(req: Request) {</text>
  <text x="20" y="172" fill="#6c7086" font-size="12" ${baseStyle}>4</text>
  <text x="72" y="172" fill="#cdd6f4" font-size="12" ${baseStyle}>const user = </text>
  <text x="200" y="172" fill="#89b4fa" font-size="12" ${baseStyle}>await</text>
  <text x="252" y="172" fill="#f9e2af" font-size="12" ${baseStyle}>auth</text>
  <text x="288" y="172" fill="#cdd6f4" font-size="12" ${baseStyle}>.</text>
  <text x="296" y="172" fill="#f9e2af" font-size="12" ${baseStyle}>verify</text>
  <text x="356" y="172" fill="#cdd6f4" font-size="12" ${baseStyle}>(req)</text>
  <text x="20" y="196" fill="#6c7086" font-size="12" ${baseStyle}>5</text>
  <text x="72" y="196" fill="#cdd6f4" font-size="12" ${baseStyle}>const data = </text>
  <text x="200" y="196" fill="#89b4fa" font-size="12" ${baseStyle}>await</text>
  <text x="252" y="196" fill="#f9e2af" font-size="12" ${baseStyle}>db.user.findMany</text>
  <text x="20" y="220" fill="#6c7086" font-size="12" ${baseStyle}>6</text>
  <text x="72" y="220" fill="#cdd6f4" font-size="12" ${baseStyle}>return Response.json(data)</text>
  <text x="20" y="244" fill="#6c7086" font-size="12" ${baseStyle}>7</text>
  <text x="48" y="244" fill="#cdd6f4" font-size="12" ${baseStyle}>}</text>
  <!-- terminal / error -->
  <rect x="0" y="500" width="1280" height="300" fill="#11111b"/>
  <text x="20" y="524" fill="#f38ba8" font-size="12" font-weight="700" ${baseStyle}>⚠ ERROR  (server)</text>
  <text x="20" y="552" fill="#cdd6f4" font-size="12" ${baseStyle}>⨯ Error: Unauthorized — token expired for user</text>
  <text x="40" y="576" fill="#f9e2af" font-size="12" ${baseStyle}>email:</text>
  <text x="92" y="576" fill="#a6e3a1" font-size="12" ${baseStyle}>'billing@snapmark.io'</text>
  <text x="20" y="600" fill="#6c7086" font-size="12" ${baseStyle}>  at verify (auth.ts:42:18)</text>
  <text x="20" y="624" fill="#6c7086" font-size="12" ${baseStyle}>  at GET (users.ts:4:20)</text>
  <text x="20" y="648" fill="#6c7086" font-size="12" ${baseStyle}>  at serverWorker (node:internal)</text>
  <text x="20" y="688" fill="#94e2d5" font-size="12" font-weight="600" ${baseStyle}>Reporter: dev.team@snapmark.io</text>
  <text x="20" y="712" fill="#94e2d5" font-size="12" font-weight="600" ${baseStyle}>Slack: +1 (415) 555-0199</text>
</svg>`;

// 4. Analytics dashboard
const analyticsDashboard = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <rect width="1280" height="800" fill="#fafafa"/>
  <rect width="1280" height="60" fill="#fff" stroke="#e5e7eb"/>
  <text x="24" y="38" fill="#0f172a" font-size="18" font-weight="700" ${baseStyle}>📊 Growthlytics</text>
  <rect x="1080" y="14" width="176" height="32" rx="6" fill="#f1f5f9"/>
  <text x="1094" y="34" fill="#475569" font-size="12" ${baseStyle}>Last 30 days ▾</text>
  <!-- KPI cards -->
  ${[
    ["Total Revenue", "$48,250", "+12.4%", "#10b981"],
    ["Active Users", "12,840", "+8.1%", "#10b981"],
    ["Conversion", "3.42%", "-0.4%", "#ef4444"],
    ["Churn Rate", "2.1%", "+0.2%", "#f59e0b"],
  ].map((c, i) => {
    const x = 24 + i * 308;
    return `
      <rect x="${x}" y="84" width="296" height="100" rx="10" fill="#fff" stroke="#e5e7eb"/>
      <text x="${x + 20}" y="112" fill="#64748b" font-size="12" ${baseStyle}>${c[0]}</text>
      <text x="${x + 20}" y="148" fill="#0f172a" font-size="26" font-weight="700" ${baseStyle}>${c[1]}</text>
      <text x="${x + 200}" y="172" fill="${c[3]}" font-size="12" font-weight="600" ${baseStyle}>${c[2]}</text>
    `;
  }).join("")}
  <!-- chart -->
  <rect x="24" y="204" width="820" height="320" rx="10" fill="#fff" stroke="#e5e7eb"/>
  <text x="44" y="232" fill="#0f172a" font-size="14" font-weight="700" ${baseStyle}>Revenue Over Time</text>
  <polyline points="44,460 124,420 204,440 284,380 364,360 444,300 524,320 604,260 684,240 764,200 804,220" fill="none" stroke="#10b981" stroke-width="3"/>
  <polyline points="44,460 124,420 204,440 284,380 364,360 444,300 524,320 604,260 684,240 764,200 804,220 804,500 44,500" fill="#10b98122" stroke="none"/>
  <!-- right panel -->
  <rect x="860" y="204" width="396" height="320" rx="10" fill="#fff" stroke="#e5e7eb"/>
  <text x="880" y="232" fill="#0f172a" font-size="14" font-weight="700" ${baseStyle}>Top Customers</text>
  ${[
    ["Acme Corp", "$4,200", "billing@acme.com"],
    ["Globex Inc", "$3,150", "ops@globex.io"],
    ["Initech LLC", "$2,800", "finance@initech.com"],
    ["Umbrella Co", "$1,900", "support@umbrella.dev"],
  ].map((r, i) => {
    const y = 268 + i * 56;
    return `
      <rect x="880" y="${y - 16}" width="356" height="44" rx="6" fill="#f8fafc"/>
      <text x="896" y="${y + 8}" fill="#0f172a" font-size="13" font-weight="600" ${baseStyle}>${r[0]}</text>
      <text x="896" y="${y + 26}" fill="#0ea5e9" font-size="11" ${baseStyle}>${r[2]}</text>
      <text x="1220" y="${y + 8}" fill="#10b981" font-size="13" font-weight="700" text-anchor="end" ${baseStyle}>${r[1]}</text>
    `;
  }).join("")}
  <!-- contact -->
  <rect x="24" y="544" width="1232" height="232" rx="10" fill="#fff" stroke="#e5e7eb"/>
  <text x="44" y="572" fill="#0f172a" font-size="14" font-weight="700" ${baseStyle}>Account Manager</text>
  <circle cx="68" cy="612" r="20" fill="#10b981"/>
  <text x="68" y="618" fill="#fff" font-size="14" font-weight="700" text-anchor="middle" ${baseStyle}>JR</text>
  <text x="100" y="608" fill="#0f172a" font-size="14" font-weight="600" ${baseStyle}>Jamie Rodriguez</text>
  <text x="100" y="628" fill="#0ea5e9" font-size="13" ${baseStyle}>jamie.rodriguez@growthlytics.io</text>
  <text x="100" y="648" fill="#475569" font-size="13" ${baseStyle}>+1 (415) 555-0142</text>
</svg>`;

export const DEMO_SCREENSHOTS: DemoScreenshot[] = [
  {
    id: "demo-support",
    title: "Support Dashboard — Customer PII",
    captureType: "visible",
    category: "Support",
    width: 1280,
    height: 800,
    dataUrl: svgToDataUrl(supportDashboard),
    tags: ["support", "pii", "customers"],
  },
  {
    id: "demo-checkout",
    title: "Checkout Page — Payment Info",
    captureType: "full-page",
    category: "E-commerce",
    width: 1280,
    height: 800,
    dataUrl: svgToDataUrl(checkoutPage),
    tags: ["checkout", "payment", "card"],
  },
  {
    id: "demo-code",
    title: "Bug Report — Stack Trace",
    captureType: "selected",
    category: "Development",
    width: 1280,
    height: 800,
    dataUrl: svgToDataUrl(codeEditor),
    tags: ["dev", "bug", "stacktrace"],
  },
  {
    id: "demo-analytics",
    title: "Analytics — Revenue Dashboard",
    captureType: "visible",
    category: "Analytics",
    width: 1280,
    height: 800,
    dataUrl: svgToDataUrl(analyticsDashboard),
    tags: ["analytics", "revenue"],
  },
];
