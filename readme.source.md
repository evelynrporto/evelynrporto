```aura width=860 height=250
(function() {
  var fullName = (github && github.user && (github.user.name || github.user.login)) || 'Software Developer';
  var name = fullName.split(' ')[0];
  var login = (github && github.user && github.user.login) || 'your-username';

  var starColors = ['#ffffff', '#7ee7ff', '#e8c8ff', '#ff9ecb'];
  var stars = [];
  for (var i = 0; i < 16; i++) {
    stars.push({
      id: 'star-' + i,
      cx: Math.round(Math.random() * 820 + 20),
      cy: Math.round(Math.random() * 230 + 10),
      r: (Math.random() * 1.3 + 0.5).toFixed(1),
      dur: (Math.random() * 4 + 3).toFixed(1),
      delay: (Math.random() * 4).toFixed(1),
      color: starColors[i % starColors.length],
    });
  }
  var starCSS = stars.map(function(s) {
    return '#' + s.id + ' { animation: twinkle ' + s.dur + 's ease-in-out infinite; animation-delay: ' + s.delay + 's; }';
  }).join(' ');

  return (
    <div style={{
      width: '100%', height: '100%', background: '#08080c',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter', position: 'relative', overflow: 'hidden', borderRadius: 16,
      border: '1px solid rgba(110,80,220,0.18)',
    }}>

      <style>
        {`
          @keyframes float-slow {
            0%, 100% { transform: translateX(0px); opacity: 0.8; }
            50% { transform: translateX(30px); opacity: 1.05; }
          }
          @keyframes float-medium {
            0%, 100% { transform: translateX(0px); opacity: 0.7; }
            50% { transform: translateX(-25px); opacity: 1.0; }
          }
          @keyframes float-fast {
            0%, 100% { transform: translateX(0px); opacity: 0.9; }
            50% { transform: translateX(20px); opacity: 0.65; }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.15; }
            50% { opacity: 0.95; }
          }
          @keyframes scan-move {
            0% { transform: translateX(0px); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(1180px); opacity: 0; }
          }
          #glow-1 { animation: float-slow 8s ease-in-out infinite; }
          #glow-2 { animation: float-medium 12s ease-in-out infinite; }
          #glow-3 { animation: float-fast 9s ease-in-out infinite; }
          #glow-4 { animation: float-slow 11s ease-in-out infinite reverse; }
          #scan-hero { animation: scan-move 6s linear infinite; }
          ${starCSS}
        `}
      </style>

      <svg width="860" height="250" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(110,20,210,0.65)" />
            <stop offset="45%" stopColor="rgba(90,15,180,0.28)" />
            <stop offset="70%" stopColor="rgba(90,15,180,0)" />
          </radialGradient>
          <radialGradient id="g2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,150,255,0.42)" />
            <stop offset="45%" stopColor="rgba(0,110,220,0.18)" />
            <stop offset="70%" stopColor="rgba(0,110,220,0)" />
          </radialGradient>
          <radialGradient id="g3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,200,180,0.32)" />
            <stop offset="70%" stopColor="rgba(0,200,180,0)" />
          </radialGradient>
          <radialGradient id="g4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(160,30,255,0.4)" />
            <stop offset="70%" stopColor="rgba(160,30,255,0)" />
          </radialGradient>
          <linearGradient id="scg-hero" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(120,200,255,0)" />
            <stop offset="45%" stopColor="rgba(150,180,255,0.18)" />
            <stop offset="50%" stopColor="rgba(190,150,255,0.55)" />
            <stop offset="55%" stopColor="rgba(150,180,255,0.18)" />
            <stop offset="100%" stopColor="rgba(120,200,255,0)" />
          </linearGradient>
        </defs>
        <ellipse id="glow-1" cx="200" cy="70" rx="260" ry="150" fill="url(#g1)" />
        <ellipse id="glow-2" cx="660" cy="80" rx="240" ry="150" fill="url(#g2)" />
        <ellipse id="glow-3" cx="720" cy="170" rx="180" ry="120" fill="url(#g3)" />
        <ellipse id="glow-4" cx="140" cy="180" rx="180" ry="120" fill="url(#g4)" />
        {stars.map(function(s) {
          return <circle key={s.id} id={s.id} cx={s.cx} cy={s.cy} r={s.r} fill={s.color} />;
        })}
        <rect id="scan-hero" x="-260" y="118" width="260" height="2.5" fill="url(#scg-hero)" />
      </svg>

      <div style={{ display: 'flex', position: 'absolute', top: 20, left: 20, width: 22, height: 22, borderLeft: '2px solid rgba(255,120,170,0.55)', borderTop: '2px solid rgba(255,120,170,0.55)' }} />
      <div style={{ display: 'flex', position: 'absolute', bottom: 20, right: 20, width: 22, height: 22, borderRight: '2px solid rgba(255,120,170,0.55)', borderBottom: '2px solid rgba(255,120,170,0.55)' }} />

      <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, color: '#ffffff', letterSpacing: '4px', lineHeight: 1, zIndex: 10 }}>
        {name.toUpperCase()}
      </div>

      <div style={{ display: 'flex', fontSize: 14, fontWeight: 700, color: 'rgba(150,210,255,0.85)', letterSpacing: '5px', marginTop: 18, zIndex: 10 }}>
        SOFTWARE DEVELOPER
      </div>

      <div style={{ display: 'flex', fontSize: 12, fontWeight: 500, color: 'rgba(170,160,210,0.5)', letterSpacing: '1px', marginTop: 22, zIndex: 10 }}>
        {'github.com/' + login}
      </div>
    </div>
  );
})()
```

```aura width=160 height=32 link="https://instagram.com/evelyn_porto" inline align=center
<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 5, border: '1.6px solid #ff9ecb' }}>
      <div style={{ display: 'flex', width: 6, height: 6, borderRadius: 3, border: '1.4px solid #ff9ecb' }} />
    </div>
    <div style={{ display: 'flex', fontSize: 12.5, fontWeight: 700, color: '#ff9ecb', letterSpacing: '0.3px' }}>Instagram</div>
  </div>
</div>
```
```aura width=150 height=32 link="https://www.linkedin.com/in/evelyn-porto-85925a219" inline
<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 4, background: '#7ee7ff' }}>
      <div style={{ display: 'flex', fontSize: 10, fontWeight: 800, color: '#08080c' }}>in</div>
    </div>
    <div style={{ display: 'flex', fontSize: 12.5, fontWeight: 700, color: '#7ee7ff', letterSpacing: '0.3px' }}>LinkedIn</div>
  </div>
</div>
```
```aura width=150 height=32 link="https://evelynporto.dev/" inline
(function() {
  var starIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2U4YzhmZiIgc3Ryb2tlPSIjZThjOGZmIiBzdHJva2Utd2lkdGg9IjEuMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMmwzLjA5IDYuMjZMMjIgOS4yN2wtNSA0Ljg3TDE4LjE4IDIyIDEyIDE4Ljc3IDUuODIgMjIgNyAxNC4xNCAyIDkuMjdsNi45MS0xLjAxTDEyIDJ6Ii8+PC9zdmc+';
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <img src={starIcon} width={16} height={16} style={{ display: 'flex' }} />
        <div style={{ display: 'flex', fontSize: 12.5, fontWeight: 700, color: '#e8c8ff', letterSpacing: '0.3px' }}>Portfolio</div>
      </div>
    </div>
  );
})()
```

```aura width=860 height=90
(function() {
  var tags = ['TypeScript', 'JavaScript', 'React', 'React Native', 'PHP', 'Laravel', 'HTML', 'CSS'];
  var palette = ['#7ee7ff', '#e8c8ff', '#ff9ecb'];

  return (
    <div style={{
      width: '100%', height: '100%', background: '#08080c',
      display: 'flex', alignItems: 'center', alignContent: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 10,
      fontFamily: 'Inter', borderRadius: 16, border: '1px solid rgba(110,80,220,0.18)',
      padding: '0 32px',
    }}>
      {tags.map(function(tag, i) {
        var color = palette[i % palette.length];
        return (
          <div key={tag} style={{
            display: 'flex', padding: '7px 16px', borderRadius: 20,
            background: 'rgba(15,12,28,0.85)', border: '1px solid ' + color + '4d',
            color: color, fontSize: 12, fontWeight: 700, letterSpacing: '0.5px',
          }}>{tag}</div>
        );
      })}
    </div>
  );
})()
```

<p align="center">
  <img src="./.github/assets/stats.svg" width="860" alt="Stats" />
</p>

```aura width=860 height=180
(function() {
  var fallback = [
    { name: 'TypeScript', percentage: 34, color: '#3178c6' },
    { name: 'JavaScript', percentage: 26, color: '#f1e05a' },
    { name: 'PHP', percentage: 18, color: '#4F5D95' },
    { name: 'HTML', percentage: 12, color: '#e34c26' },
    { name: 'CSS', percentage: 10, color: '#563d7c' },
  ];
  var langs = (github && github.languages && github.languages.length > 0) ? github.languages : fallback;

  return (
    <div style={{
      width: '100%', height: '100%', background: '#08080c',
      display: 'flex', flexDirection: 'column', fontFamily: 'Inter',
      padding: '22px 32px', gap: 16, borderRadius: 16,
      border: '1px solid rgba(110,80,220,0.18)', position: 'relative', overflow: 'hidden',
    }}>
      <svg width="860" height="180" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(90,20,190,0.35)" />
            <stop offset="70%" stopColor="rgba(90,20,190,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="700" cy="0" rx="260" ry="160" fill="url(#g1)" />
      </svg>

      <div style={{ display: 'flex', fontSize: 11, fontWeight: 700, color: 'rgba(155,140,210,0.6)', letterSpacing: '3px', zIndex: 10 }}>
        STACK ANALYTICS
      </div>

      <div style={{ display: 'flex', width: '100%', height: 10, borderRadius: 5, overflow: 'hidden', zIndex: 10 }}>
        {langs.map(function(l) {
          return (
            <div key={l.name} style={{ display: 'flex', width: l.percentage + '%', height: '100%', background: l.color }} />
          );
        })}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px', zIndex: 10 }}>
        {langs.map(function(l) {
          return (
            <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', width: 9, height: 9, borderRadius: 5, background: l.color }} />
              <div style={{ display: 'flex', fontSize: 12, fontWeight: 600, color: 'rgba(225,220,255,0.85)' }}>{l.name}</div>
              <div style={{ display: 'flex', fontSize: 11, color: 'rgba(170,160,210,0.5)' }}>{Math.round(l.percentage) + '%'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
})()
```

<p align="center">
  <img src="./.github/assets/activity-pulse.svg" width="860" alt="Activity Pulse" />
</p>

<br>
<p align="center"><sub>𝗉𝗈𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 <a href="https://github.com/collectioneur/readme-aura">𝗋𝖾𝖺𝖽𝗆𝖾-𝖺𝗎𝗋𝖺</a></sub></p>
