#!/usr/bin/env node
// Generates the entire profile card (hero, tags, stats, stack analytics,
// activity pulse) as ONE combined SVG so there are no visible seams between
// sections. Fetches real data from the GitHub GraphQL API.

const NAME = 'Evelyn';
const ROLE = 'SOFTWARE DEVELOPER';
const TAGS = ['TypeScript', 'JavaScript', 'React', 'React Native', 'PHP', 'Laravel', 'HTML', 'CSS'];
const PALETTE = ['#7ee7ff', '#e8c8ff', '#ff9ecb'];

const QUERY = `
query ($login: String!) {
  user(login: $login) {
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false) {
      totalCount
      nodes {
        languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
          edges { size node { name color } }
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { contributionCount weekday } }
      }
    }
  }
}`;

async function fetchData(login, token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'readme-generator',
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join(', '));
  return json.data.user;
}

function computeStreaks(calendar) {
  const days = [];
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) days.push(day.contributionCount);
  }
  let idx = days.length - 1;
  if (days[idx] === 0) idx--;
  let currentStreak = 0;
  while (idx >= 0 && days[idx] > 0) {
    currentStreak++;
    idx--;
  }
  let longestStreak = 0;
  let run = 0;
  for (const count of days) {
    if (count > 0) {
      run++;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 0;
    }
  }
  return { currentStreak, longestStreak };
}

function aggregateLanguages(repos) {
  const map = {};
  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      if (!map[name]) map[name] = { name, color: edge.node.color, size: 0 };
      map[name].size += edge.size;
    }
  }
  const arr = Object.values(map).sort((a, b) => b.size - a.size).slice(0, 6);
  const total = arr.reduce((s, l) => s + l.size, 0) || 1;
  return arr.map((l) => ({ name: l.name, color: l.color, percentage: (l.size / total) * 100 }));
}

function mockData() {
  const weeks = [];
  let total = 0;
  for (let w = 0; w < 53; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const c = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 9);
      total += c;
      days.push({ contributionCount: c, weekday: d });
    }
    weeks.push({ contributionDays: days });
  }
  return {
    repositories: { totalCount: 14, nodes: [] },
    contributionsCollection: { contributionCalendar: { totalContributions: total, weeks } },
    languages: [
      { name: 'TypeScript', color: '#3178c6', percentage: 34 },
      { name: 'JavaScript', color: '#f1e05a', percentage: 26 },
      { name: 'PHP', color: '#4F5D95', percentage: 18 },
      { name: 'HTML', color: '#e34c26', percentage: 12 },
      { name: 'CSS', color: '#563d7c', percentage: 10 },
    ],
  };
}

function stars(count, cyMin, cyMax, prefix) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push({
      id: `${prefix}-${i}`,
      cx: Math.round(Math.random() * 820 + 20),
      cy: Math.round(Math.random() * (cyMax - cyMin) + cyMin),
      r: (Math.random() * 1.3 + 0.5).toFixed(1),
      dur: (Math.random() * 4 + 3).toFixed(1),
      delay: (Math.random() * 4).toFixed(1),
      color: ['#ffffff', '#7ee7ff', '#e8c8ff', '#ff9ecb'][i % 4],
    });
  }
  return list;
}

function generateSVG(data) {
  const W = 860;
  const font = `'Inter', -apple-system, 'Segoe UI', sans-serif`;

  const heroH = 250;
  const tagsH = 90;
  const statsH = 130;
  const stackH = 180;
  const pulseH = 190;
  const totalH = heroH + tagsH + statsH + stackH + pulseH;

  let y = 0;
  const allStars = [];
  const parts = [];

  parts.push(`<rect x="0.75" y="0.75" width="${W - 1.5}" height="${totalH - 1.5}" rx="16" fill="#08080c" stroke="rgba(110,80,220,0.18)" stroke-width="1.5" />`);

  // ---------- Hero ----------
  (() => {
    const cy = y + heroH / 2;
    parts.push(`
      <ellipse cx="200" cy="${y + 70}" rx="260" ry="150" fill="url(#g1)" />
      <ellipse cx="660" cy="${y + 80}" rx="240" ry="150" fill="url(#g2)" />
      <ellipse cx="720" cy="${y + 170}" rx="180" ry="120" fill="url(#g3)" />
      <ellipse cx="140" cy="${y + 180}" rx="180" ry="120" fill="url(#g4)" />
      <rect id="scan-hero" x="-260" y="${cy - 8}" width="260" height="2.5" fill="url(#scg)" />
      <text x="${W / 2}" y="${cy - 28}" text-anchor="middle" font-family="${font}" font-size="40" font-weight="800" fill="#ffffff" letter-spacing="4">${NAME.toUpperCase()}</text>
      <text x="${W / 2}" y="${cy + 10}" text-anchor="middle" font-family="${font}" font-size="14" font-weight="700" fill="rgba(150,210,255,0.85)" letter-spacing="5">${ROLE}</text>
      <text x="${W / 2}" y="${cy + 42}" text-anchor="middle" font-family="${font}" font-size="12" font-weight="500" fill="rgba(170,160,210,0.5)" letter-spacing="1">github.com/evelynrporto</text>
    `);
    allStars.push(...stars(16, y + 10, y + heroH - 10, 'hs'));
  })();
  y += heroH;

  // ---------- Tags ----------
  (() => {
    const widths = TAGS.map((t) => t.length * 7.2 + 30);
    const gap = 10;
    const totalW = widths.reduce((a, b) => a + b, 0) + gap * (TAGS.length - 1);
    let x = (W - totalW) / 2;
    const cy = y + tagsH / 2;
    parts.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`);
    TAGS.forEach((tag, i) => {
      const w = widths[i];
      const color = PALETTE[i % PALETTE.length];
      parts.push(`
        <rect x="${x}" y="${cy - 15}" width="${w}" height="30" rx="15" fill="rgba(15,12,28,0.85)" stroke="${color}55" stroke-width="1" />
        <text x="${x + w / 2}" y="${cy + 4.5}" text-anchor="middle" font-family="${font}" font-size="12" font-weight="700" fill="${color}">${tag}</text>
      `);
      x += w + gap;
    });
  })();
  y += tagsH;

  // ---------- Stats ----------
  (() => {
    const items = [
      { value: data.stats.totalContributions, label: 'CONTRIBUTIONS', color: '#5ec8f0' },
      { value: data.stats.currentStreak, label: 'CURRENT STREAK', color: '#ff9ecb' },
      { value: data.stats.longestStreak, label: 'LONGEST STREAK', color: '#e8c8ff' },
      { value: data.stats.totalRepos, label: 'REPOS', color: '#7ee7ff' },
    ];
    const colW = W / items.length;
    parts.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`);
    parts.push(`<rect id="scan-stats" x="-260" y="${y + statsH / 2 - 1}" width="260" height="2.5" fill="url(#scg)" />`);
    items.forEach((item, i) => {
      const cx = colW * i + colW / 2;
      parts.push(`
        <text x="${cx}" y="${y + 58}" text-anchor="middle" font-family="${font}" font-size="30" font-weight="800" fill="${item.color}">${item.value}</text>
        <text x="${cx}" y="${y + 78}" text-anchor="middle" font-family="${font}" font-size="11" font-weight="600" fill="rgba(200,195,225,0.45)" letter-spacing="1.5">${item.label}</text>
      `);
      if (i < items.length - 1) {
        const dx = colW * (i + 1);
        parts.push(`<line x1="${dx}" y1="${y + 30}" x2="${dx}" y2="${y + statsH - 30}" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="3 3" />`);
      }
    });
    allStars.push(...stars(6, y + 10, y + statsH - 10, 'ss'));
  })();
  y += statsH;

  // ---------- Stack Analytics ----------
  (() => {
    const langs = data.languages;
    const padX = 32;
    const barY = y + 42;
    const barW = W - padX * 2;
    parts.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`);
    parts.push(`<text x="${padX}" y="${y + 26}" font-family="${font}" font-size="11" font-weight="700" fill="rgba(155,140,210,0.6)" letter-spacing="3">STACK ANALYTICS</text>`);
    let bar = `<rect x="${padX}" y="${barY}" width="${barW}" height="10" rx="5" fill="rgba(255,255,255,0.06)" />`;
    let bx = padX;
    langs.forEach((l) => {
      const w = Math.max((barW * l.percentage) / 100, 3);
      bar += `<rect x="${bx}" y="${barY}" width="${w}" height="10" fill="${l.color}" opacity="0.9" />`;
      bx += w;
    });
    parts.push(bar);
    let legend = '';
    const perRow = 3;
    langs.forEach((l, i) => {
      const row = Math.floor(i / perRow);
      const col = i % perRow;
      const lx = padX + col * 260;
      const ly = barY + 30 + row * 28;
      legend += `
        <circle cx="${lx + 5}" cy="${ly + 5}" r="4.5" fill="${l.color}" />
        <text x="${lx + 15}" y="${ly + 9}" font-family="${font}" font-size="12" font-weight="600" fill="rgba(225,220,255,0.85)">${l.name}</text>
        <text x="${lx + 15 + l.name.length * 6.5 + 8}" y="${ly + 9}" font-family="${font}" font-size="11" fill="rgba(170,160,210,0.5)">${Math.round(l.percentage)}%</text>
      `;
    });
    parts.push(legend);
  })();
  y += stackH;

  // ---------- Activity Pulse ----------
  (() => {
    const calendar = data.calendar;
    const padX = 32;
    const gridTop = y + 44;
    const gridBottom = y + pulseH - 22;
    const weeks = calendar.weeks;
    const gridW = W - padX * 2;
    const step = gridW / weeks.length;
    const cellSize = Math.max(step - 3, 4);
    const rowStep = (gridBottom - gridTop) / 7;
    const rowSize = Math.max(rowStep - 3, 4);
    const levelColor = (count) => {
      if (count === 0) return 'rgba(255,255,255,0.05)';
      if (count <= 2) return 'rgba(94,200,240,0.35)';
      if (count <= 5) return 'rgba(94,200,240,0.65)';
      if (count <= 9) return 'rgba(177,140,255,0.85)';
      return '#ffffff';
    };
    parts.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1" />`);
    parts.push(`<text x="${padX}" y="${y + 28}" font-family="${font}" font-size="11" font-weight="700" fill="rgba(155,140,210,0.6)" letter-spacing="3">ACTIVITY PULSE</text>`);
    parts.push(`<text x="${W - padX}" y="${y + 28}" text-anchor="end" font-family="${font}" font-size="11" font-weight="700" fill="rgba(150,210,255,0.75)">${calendar.totalContributions} contributions</text>`);
    let cells = '';
    weeks.forEach((week, w) => {
      week.contributionDays.forEach((day) => {
        const x = padX + w * step;
        const cy2 = gridTop + day.weekday * rowStep;
        cells += `<rect x="${x.toFixed(1)}" y="${cy2.toFixed(1)}" width="${cellSize.toFixed(1)}" height="${rowSize.toFixed(1)}" rx="2.5" fill="${levelColor(day.contributionCount)}" />`;
      });
    });
    parts.push(cells);
  })();
  y += pulseH;

  const starEls = allStars.map((s) => `<circle id="${s.id}" cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${s.color}" />`).join('');
  const starCSS = allStars.map((s) => `#${s.id} { animation: twinkle ${s.dur}s ease-in-out infinite; animation-delay: ${s.delay}s; }`).join(' ');

  const corners = [
    { id: 'corner-tl', d: `M 42,20 L 20,20 L 20,42`, color: '#ff9ecb' },
    { id: 'corner-tr', d: `M ${W - 42},20 L ${W - 20},20 L ${W - 20},42`, color: '#7ee7ff' },
    { id: 'corner-bl', d: `M 42,${heroH - 20} L 20,${heroH - 20} L 20,${heroH - 42}`, color: '#7ee7ff' },
    { id: 'corner-br', d: `M ${W - 42},${heroH - 20} L ${W - 20},${heroH - 20} L ${W - 20},${heroH - 42}`, color: '#ff9ecb' },
  ];
  const cornerLen = 44; // two 22px arms
  const cornerEls = corners.map((c) => `<path id="${c.id}" d="${c.d}" fill="none" stroke="${c.color}" stroke-width="2" stroke-linecap="round" stroke-dasharray="${cornerLen} ${cornerLen}" />`).join('');
  const cornerCSS = corners.map((c) => {
    const dur = (3.4 + Math.random() * 2.2).toFixed(2);
    const delay = (Math.random() * dur).toFixed(2);
    return `#${c.id} { animation: corner-wipe ${dur}s ease-in-out infinite; animation-delay: ${delay}s; }`;
  }).join(' ');

  return `<!-- Generated by scripts/generate-profile.js -->
<svg width="${W}" height="${totalH}" viewBox="0 0 ${W} ${totalH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(110,20,210,0.65)" /><stop offset="45%" stop-color="rgba(90,15,180,0.28)" /><stop offset="70%" stop-color="rgba(90,15,180,0)" /></radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(0,150,255,0.42)" /><stop offset="45%" stop-color="rgba(0,110,220,0.18)" /><stop offset="70%" stop-color="rgba(0,110,220,0)" /></radialGradient>
    <radialGradient id="g3" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(0,200,180,0.32)" /><stop offset="70%" stop-color="rgba(0,200,180,0)" /></radialGradient>
    <radialGradient id="g4" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(160,30,255,0.4)" /><stop offset="70%" stop-color="rgba(160,30,255,0)" /></radialGradient>
    <linearGradient id="scg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(120,200,255,0)" /><stop offset="45%" stop-color="rgba(150,180,255,0.15)" /><stop offset="50%" stop-color="rgba(190,150,255,0.5)" /><stop offset="55%" stop-color="rgba(150,180,255,0.15)" /><stop offset="100%" stop-color="rgba(120,200,255,0)" />
    </linearGradient>
    <clipPath id="card-clip"><rect x="0.75" y="0.75" width="${W - 1.5}" height="${totalH - 1.5}" rx="16" /></clipPath>
  </defs>
  <style>
    @keyframes twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.95; } }
    @keyframes scan-move { 0% { transform: translateX(0px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateX(1180px); opacity: 0; } }
    @keyframes corner-wipe { 0% { stroke-dashoffset: 0; } 65% { stroke-dashoffset: 0; } 88% { stroke-dashoffset: 44; } 100% { stroke-dashoffset: 88; } }
    #scan-hero { animation: scan-move 6s linear infinite; }
    #scan-stats { animation: scan-move 7s linear infinite; animation-delay: 2s; }
    ${starCSS}
    ${cornerCSS}
  </style>
  <g clip-path="url(#card-clip)">
    ${parts.join('\n')}
    ${starEls}
  </g>
  ${cornerEls}
</svg>`;
}

(async () => {
  const login = process.env.GITHUB_USER || 'evelynrporto';
  const token = process.env.GITHUB_TOKEN;

  let data;
  if (token) {
    try {
      const user = await fetchData(login, token);
      const calendar = user.contributionsCollection.contributionCalendar;
      const { currentStreak, longestStreak } = computeStreaks(calendar);
      data = {
        stats: {
          totalContributions: calendar.totalContributions,
          currentStreak,
          longestStreak,
          totalRepos: user.repositories.totalCount,
        },
        languages: aggregateLanguages(user.repositories.nodes),
        calendar,
      };
    } catch (e) {
      console.error(`generate-profile: ${e.message} — falling back to mock data`);
      const mock = mockData();
      const { currentStreak, longestStreak } = computeStreaks(mock.contributionsCollection.contributionCalendar);
      data = {
        stats: {
          totalContributions: mock.contributionsCollection.contributionCalendar.totalContributions,
          currentStreak,
          longestStreak,
          totalRepos: mock.repositories.totalCount,
        },
        languages: mock.languages,
        calendar: mock.contributionsCollection.contributionCalendar,
      };
    }
  } else {
    console.log('generate-profile: no GITHUB_TOKEN — using mock data for preview.');
    const mock = mockData();
    const { currentStreak, longestStreak } = computeStreaks(mock.contributionsCollection.contributionCalendar);
    data = {
      stats: {
        totalContributions: mock.contributionsCollection.contributionCalendar.totalContributions,
        currentStreak,
        longestStreak,
        totalRepos: mock.repositories.totalCount,
      },
      languages: mock.languages,
      calendar: mock.contributionsCollection.contributionCalendar,
    };
  }

  const svg = generateSVG(data);

  const fs = require('fs');
  const path = require('path');
  const outDir = path.resolve(process.cwd(), '.github/assets');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'profile.svg');
  fs.writeFileSync(outPath, svg, 'utf-8');
  console.log(`generate-profile: wrote ${outPath}`);
})();
