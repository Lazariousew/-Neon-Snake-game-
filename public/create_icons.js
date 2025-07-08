const fs = require('fs');

// Создаем простые PNG иконки используя data URI
const create192Icon = () => {
  const canvas = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
    <rect width="192" height="192" fill="#0f172a" rx="24"/>
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)">
      <circle cx="96" cy="80" r="16" fill="#67e8f9"/>
      <circle cx="80" cy="80" r="14" fill="#06b6d4"/>
      <circle cx="64" cy="80" r="12" fill="#0891b2"/>
      <circle cx="48" cy="80" r="10" fill="#0e7490"/>
      <circle cx="32" cy="80" r="8" fill="#155e75"/>
    </g>
    <circle cx="120" cy="120" r="8" fill="#f87171" filter="url(#glow)"/>
    <g opacity="0.1" stroke="#67e8f9" stroke-width="1">
      <path d="M32 32v128M48 32v128M64 32v128M80 32v128M96 32v128M112 32v128M128 32v128M144 32v128M160 32v128"/>
      <path d="M32 32h128M32 48h128M32 64h128M32 80h128M32 96h128M32 112h128M32 128h128M32 144h128M32 160h128"/>
    </g>
  </svg>`;
  
  const base64 = Buffer.from(canvas).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};

const create512Icon = () => {
  const canvas = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <rect width="512" height="512" fill="#0f172a" rx="64"/>
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)">
      <circle cx="256" cy="200" r="40" fill="#67e8f9"/>
      <circle cx="216" cy="200" r="36" fill="#06b6d4"/>
      <circle cx="176" cy="200" r="32" fill="#0891b2"/>
      <circle cx="136" cy="200" r="28" fill="#0e7490"/>
      <circle cx="96" cy="200" r="24" fill="#155e75"/>
    </g>
    <circle cx="320" cy="320" r="20" fill="#f87171" filter="url(#glow)"/>
    <g opacity="0.1" stroke="#67e8f9" stroke-width="2">
      <path d="M80 80v352M120 80v352M160 80v352M200 80v352M240 80v352M280 80v352M320 80v352M360 80v352M400 80v352M440 80v352"/>
      <path d="M80 80h352M80 120h352M80 160h352M80 200h352M80 240h352M80 280h352M80 320h352M80 360h352M80 400h352M80 440h352"/>
    </g>
  </svg>`;
  
  const base64 = Buffer.from(canvas).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};

console.log('Creating icon files...');
fs.writeFileSync('pwa-192x192.png', create192Icon());
fs.writeFileSync('pwa-512x512.png', create512Icon());
console.log('Icons created!');
