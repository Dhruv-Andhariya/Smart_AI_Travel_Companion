export const logoStroke = [
  "M9 28 L31 16 L22 34 L39 22 L26 50 L15 39 L9 28 Z",
  "M22 34 L44 28",
  "M31 16 L44 28",
  "M15 39 L9 28",
  "M27 18 C31 16, 37 16, 41 19",
];

export const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="18" fill="#0B1120"/>
  <path d="M11 33L33 20L25 39L43 28L29 51L18 40L11 33Z" stroke="#8B5CF6" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="45" cy="22" r="3.5" fill="#06B6D4"/>
  <circle cx="48" cy="31" r="2.4" fill="#8B5CF6"/>
</svg>`;

export const ogImageSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" rx="36" fill="#0B1120"/>
  <circle cx="240" cy="160" r="140" fill="url(#g1)" fill-opacity="0.35"/>
  <circle cx="960" cy="120" r="190" fill="url(#g2)" fill-opacity="0.28"/>
  <path d="M280 320L520 180L430 400L610 280L470 500L350 380L280 320Z" stroke="#8B5CF6" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="650" cy="230" r="18" fill="#06B6D4"/>
  <circle cx="700" cy="268" r="12" fill="#8B5CF6"/>
  <circle cx="745" cy="214" r="9" fill="#A78BFA"/>
  <path d="M650 230L700 268L745 214" stroke="#06B6D4" stroke-width="6" stroke-linecap="round"/>
  <text x="650" y="390" fill="#F8FBFF" font-size="86" font-family="Inter, sans-serif" font-weight="700">Trip AI</text>
  <text x="650" y="458" fill="#C7D2FE" font-size="30" font-family="Inter, sans-serif">Plan smarter trips with AI-generated itineraries</text>
  <defs>
    <linearGradient id="g1" x1="100" y1="60" x2="380" y2="260" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8B5CF6"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
    <linearGradient id="g2" x1="820" y1="10" x2="1110" y2="280" gradientUnits="userSpaceOnUse">
      <stop stop-color="#06B6D4"/>
      <stop offset="1" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
</svg>`;

export const logoDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;