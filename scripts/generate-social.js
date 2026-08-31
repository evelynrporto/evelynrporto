#!/usr/bin/env node
// Generates the 3 social link badges as separate flat SVGs (no card/border),
// so each can be wrapped in its own clickable <a> in the markdown.

const font = `'Inter', -apple-system, 'Segoe UI', sans-serif`;

function instagramSVG(color, label) {
  const w = 150, h = 32;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="8" width="16" height="16" rx="5" fill="none" stroke="${color}" stroke-width="1.6" />
    <circle cx="8" cy="16" r="3" fill="none" stroke="${color}" stroke-width="1.4" />
    <text x="24" y="20.5" font-family="${font}" font-size="12.5" font-weight="700" fill="${color}" letter-spacing="0.3">${label}</text>
  </svg>`;
}

function linkedinSVG(color, label) {
  const w = 140, h = 32;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="8" width="16" height="16" rx="4" fill="${color}" />
    <text x="8" y="19.5" text-anchor="middle" font-family="${font}" font-size="10" font-weight="800" fill="#08080c">in</text>
    <text x="24" y="20.5" font-family="${font}" font-size="12.5" font-weight="700" fill="${color}" letter-spacing="0.3">${label}</text>
  </svg>`;
}

function portfolioSVG(color, label) {
  const w = 140, h = 32;
  const star = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z';
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0,8) scale(0.6667)">
      <path d="${star}" fill="${color}" stroke="${color}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="24" y="20.5" font-family="${font}" font-size="12.5" font-weight="700" fill="${color}" letter-spacing="0.3">${label}</text>
  </svg>`;
}

const fs = require('fs');
const path = require('path');
const outDir = path.resolve(process.cwd(), '.github/assets');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'social-instagram.svg'), instagramSVG('#ff9ecb', 'Instagram'), 'utf-8');
fs.writeFileSync(path.join(outDir, 'social-linkedin.svg'), linkedinSVG('#7ee7ff', 'LinkedIn'), 'utf-8');
fs.writeFileSync(path.join(outDir, 'social-portfolio.svg'), portfolioSVG('#e8c8ff', 'Portfolio'), 'utf-8');
console.log('generate-social: wrote 3 social badge SVGs');
