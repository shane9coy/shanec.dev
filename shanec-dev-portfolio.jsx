import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════
   SHANE COY — shanc.dev
   Brand: Void Black, Golden Ray, Militar Night,
          Urban Steel, Soft Titanium, Creme White
   ═══════════════════════════════════════════════════ */

const brand = {
  bg:        '#ffffff',
  softTitan: '#CFD0D4',
  void:      '#050505',
  gold:      '#DAB986',
  creme:     '#C3B79D',
  militar:   '#323F36',
  steel:     '#363B3E',
};

const fontMain = "'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif";
const fontMono = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/* ═══════════════════════════════════════════════════
   ASCII HERO CANVAS
   ═══════════════════════════════════════════════════ */
const AsciiHero = () => {
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const charSize = 13;
    const chars = " .'`^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
    const noise = (x, y, t) => Math.sin(x * 0.05 + t) * Math.cos(y * 0.05 + t) + Math.sin(x * 0.01 - t) * Math.cos(y * 0.12) * 0.5;
    const gradColors = [{ r: 218, g: 185, b: 134 }, { r: 106, g: 122, b: 104 }, { r: 50, g: 63, b: 54 }];
    const asciiStart = 0.08;
    const fadeStart = 0.56;
    const fadeLength = 0.28;
    const lerpColor = (t) => {
      const idx = t * (gradColors.length - 1), lo = Math.floor(idx), hi = Math.min(lo + 1, gradColors.length - 1), f = idx - lo;
      const a = gradColors[lo], b = gradColors[hi];
      return { r: Math.round(a.r + (b.r - a.r) * f), g: Math.round(a.g + (b.g - a.g) * f), b: Math.round(a.b + (b.b - a.b) * f) };
    };
    let w, h;
    const resize = () => { w = canvas.parentElement.clientWidth; h = canvas.parentElement.clientHeight; const dpr = window.devicePixelRatio || 1; canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr); canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; };
    resize(); window.addEventListener('resize', resize);
    const onMove = (e) => { mousePosRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    const render = () => {
      ctx.clearRect(0, 0, w, h); ctx.font = `${charSize}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const cols = Math.ceil(w / charSize), rows = Math.ceil(h / charSize), rect = canvas.getBoundingClientRect();
      for (let y = 0; y < rows; y++) { if (y < rows * asciiStart) continue; for (let x = 0; x < cols; x++) {
        const px = x * charSize, py = y * charSize, dx = px - mousePosRef.current.x, dy = py - (mousePosRef.current.y - rect.top);
        const dist = Math.sqrt(dx * dx + dy * dy), nY = (rows - y) / rows, nv = noise(x, y, timeRef.current * 0.5);
        const mh = 0.88 + Math.sin(x * 0.045 + timeRef.current * 0.08) * 0.035 + Math.cos(x * 0.12) * 0.02;
        let ch = '', alpha = 0;
        const fadeT = Math.max(0, Math.min(1, (y - rows * fadeStart) / (rows * fadeLength))), fadeAlpha = 1 - fadeT;
        if (nY < mh + nv * 0.1) { const idx = Math.floor(Math.abs(nv) * chars.length); ch = chars[idx % chars.length]; alpha = Math.max(0, (1 - nY * 1.15) * fadeAlpha); }
        const gradT = Math.max(0, Math.min(1, (y - rows * asciiStart) / (rows * (1 - asciiStart)))), gc = lerpColor(gradT);
        if (dist < 170) { const ls = 1 - dist / 170; if (Math.random() > 0.5) ch = Math.random() > 0.5 ? '0' : '1';
          ctx.fillStyle = `rgba(${gc.r},${gc.g},${gc.b},${Math.max(alpha, ls * fadeAlpha)})`; const sx = dist > 0 ? (dx / dist) * 12 * ls : 0, sy = dist > 0 ? (dy / dist) * 12 * ls : 0;
          ctx.fillText(ch, px + charSize / 2 - sx, py + charSize / 2 - sy);
        } else if (ch) { ctx.fillStyle = `rgba(${gc.r},${gc.g},${gc.b},${alpha})`; ctx.fillText(ch, px + charSize / 2, py + charSize / 2); }
      }}
      timeRef.current += 0.01; animRef.current = requestAnimationFrame(render);
    };
    animRef.current = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <div style={{ position: 'relative', height: '92vh', minHeight: 720, width: '100%', overflow: 'hidden', background: `linear-gradient(180deg, ${brand.militar} 0%, rgba(50, 63, 54, 0.94) 18%, rgba(50, 63, 54, 0.65) 36%, rgba(50, 63, 54, 0.16) 62%, rgba(255, 255, 255, 0) 82%), ${brand.bg}` }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '145%', position: 'absolute', top: 0, left: 0, opacity: 0.95 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(50, 63, 54, 0.9) 0%, rgba(50, 63, 54, 0.78) 20%, rgba(50, 63, 54, 0.32) 46%, rgba(255, 255, 255, 0) 74%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 23% 63%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 18%, rgba(255, 255, 255, 0.58) 36%, rgba(255, 255, 255, 0) 62%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 58%, rgba(255, 255, 255, 0.72) 80%, rgba(255, 255, 255, 1) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '34%', left: 'clamp(24px, 4vw, 48px)', right: 'clamp(24px, 4vw, 48px)', maxWidth: 960, pointerEvents: 'none', zIndex: 2 }}>
        <h1 style={{ fontFamily: fontMain, fontSize: 'clamp(4.8rem, 11vw, 9.75rem)', fontWeight: 300, letterSpacing: '-0.06em', lineHeight: 0.96, color: brand.gold, marginBottom: 24, textShadow: '0 20px 60px rgba(50, 63, 54, 0.18)' }}>Shane Coy</h1>
        <p style={{ fontFamily: fontMono, fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)', color: brand.steel, maxWidth: 620, lineHeight: 1.8 }}>
          Agentic AI engineer &amp; consultant. Production-grade autonomous systems that eliminate manual work and drive measurable business outcomes.
        </p>
      </div>
      <nav style={{ position: 'absolute', top: 32, left: 'clamp(24px, 4vw, 48px)', right: 'clamp(24px, 4vw, 48px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <span style={{ fontFamily: fontMono, fontSize: '0.8rem', color: brand.creme, fontWeight: 600 }}>SHANC.DEV</span>
        <div style={{ display: 'flex', gap: 32 }}>
          {[['Work With Me', 'consulting'], ['Projects', 'projects'], ['Case Studies', 'cases'], ['Applications', 'apps']].map(([label, id]) => (
            <span key={id} onClick={() => scrollTo(id)} style={{ fontFamily: fontMono, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.74)', cursor: 'pointer', letterSpacing: '0.03em', transition: 'color 0.3s' }}
              onMouseEnter={e => e.target.style.color = brand.gold} onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.74)'}>{label}</span>
          ))}
        </div>
      </nav>
      <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', fontFamily: fontMono, fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.72)', letterSpacing: '0.15em', textTransform: 'uppercase', animation: 'pulse 2s ease-in-out infinite', zIndex: 2 }}>↓ Scroll</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════ */
const Section = ({ id, children }) => (<section id={id} style={{ padding: '100px 48px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>{children}</section>);
const SectionLabel = ({ children }) => (<div style={{ fontFamily: fontMono, fontSize: '0.7rem', color: brand.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{children}</div>);
const SectionTitle = ({ children }) => (<h2 style={{ fontFamily: fontMain, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, color: brand.void, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 48 }}>{children}</h2>);
const Divider = () => (<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}><div style={{ height: 1, background: brand.softTitan }} /></div>);

/* ═══════════════════════════════════════════════════
   AVATAR — Auto-cycles: initial (once) → standing → point → kick → chair → backflip (10s gaps)
   ═══════════════════════════════════════════════════ */
const AvatarAutoplay = () => {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const currentRef = useRef(null);
  const clockRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const animFiles = { initial: '/avatar/initial.glb', standing: '/avatar/standing.glb', point: '/avatar/point.glb', kick: '/avatar/kick.glb', chair: '/avatar/chair.glb', backflip: '/avatar/backflip.glb' };

  const switchAnim = useCallback((name) => {
    if (!mixerRef.current || !actionsRef.current[name]) return;
    const prev = actionsRef.current[currentRef.current];
    const next = actionsRef.current[name];
    if (prev) prev.fadeOut(0.5);
    next.reset().fadeIn(0.5).play();
    currentRef.current = name;
  }, []);

  useEffect(() => {
    let disposed = false;
    const mount = mountRef.current;
    if (!mount) return;
    const loadThree = async () => {
      const THREE = await import('three');
      const scene = new THREE.Scene();
      const w = mount.clientWidth, h = mount.clientHeight;
      const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
      camera.position.set(0, 1.1, 3.2); camera.lookAt(0, 0.9, 0);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
      mount.appendChild(renderer.domElement);
      scene.add(new THREE.DirectionalLight(0xDAB986, 2.5).translateX(3).translateY(4).translateZ(3));
      scene.add(new THREE.DirectionalLight(0xCFD0D4, 1.0).translateX(-2).translateY(2).translateZ(-1));
      scene.add(new THREE.DirectionalLight(0xffffff, 0.8).translateY(3).translateZ(-3));
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.6, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.08 }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.001; scene.add(shadow);
      clockRef.current = new THREE.Clock();
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js').catch(() => ({ GLTFLoader: null }));
      if (!GLTFLoader) return;
      const loader = new GLTFLoader(); let baseModel = null;
      const loadAnim = (name, url) => new Promise((resolve) => {
        loader.load(url, (gltf) => {
          if (!baseModel) { baseModel = gltf.scene; baseModel.scale.set(2.6, 2.6, 2.6); baseModel.position.set(0, 0, 0); scene.add(baseModel); mixerRef.current = new THREE.AnimationMixer(baseModel); }
          if (gltf.animations?.length > 0) actionsRef.current[name] = mixerRef.current.clipAction(gltf.animations[0]);
          resolve();
        }, undefined, () => resolve());
      });
      for (const [name, url] of Object.entries(animFiles)) { if (disposed) return; await loadAnim(name, url); }
      setLoaded(true);
      if (actionsRef.current.initial) { const a = actionsRef.current.initial; a.setLoop(THREE.LoopOnce); a.clampWhenFinished = true; a.play(); currentRef.current = 'initial'; }
      const cycle = ['standing', 'point', 'kick', 'chair', 'backflip']; let ci = 0; let ct;
      const startCycle = () => { if (disposed) return; switchAnim(cycle[ci]); ci = (ci + 1) % cycle.length; ct = setTimeout(startCycle, 10000); };
      setTimeout(() => { if (!disposed) startCycle(); }, 3500);
      const animate = () => { if (disposed) return; if (mixerRef.current) mixerRef.current.update(clockRef.current.getDelta()); if (baseModel) baseModel.rotation.y += 0.002; renderer.render(scene, camera); requestAnimationFrame(animate); };
      animate();
      const onResize = () => { const nw = mount.clientWidth, nh = mount.clientHeight; camera.aspect = nw / nh; camera.updateProjectionMatrix(); renderer.setSize(nw, nh); };
      window.addEventListener('resize', onResize);
      mount._cleanup = () => { disposed = true; clearTimeout(ct); window.removeEventListener('resize', onResize); renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); };
    };
    loadThree();
    return () => { if (mount._cleanup) mount._cleanup(); };
  }, [switchAnim]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: 480, borderRadius: 2, overflow: 'hidden', position: 'relative', background: `radial-gradient(ellipse at center bottom, ${brand.softTitan}22 0%, transparent 70%)` }}>
      {!loaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontMono, fontSize: '0.75rem', color: brand.creme, letterSpacing: '0.1em' }}>Loading...</div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PROJECT SHOWCASE
   ═══════════════════════════════════════════════════ */
const ProjectShowcase = ({ title, url, tags, description, features }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ border: `1px solid ${h ? brand.gold : brand.softTitan}`, borderRadius: 2, padding: 48, marginBottom: 28, transition: 'border-color 0.4s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <h3 style={{ fontFamily: fontMain, fontSize: '1.8rem', fontWeight: 500, color: brand.void }}>{title}</h3>
        <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: fontMono, fontSize: '0.75rem', color: brand.gold, textDecoration: 'none', borderBottom: `1px solid ${brand.gold}`, paddingBottom: 2 }}>{url} ↗</a>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {tags.map(t => <span key={t} style={{ fontFamily: fontMono, fontSize: '0.65rem', color: brand.steel, border: `1px solid ${brand.softTitan}`, borderRadius: 2, padding: '3px 10px' }}>{t}</span>)}
      </div>
      <p style={{ color: brand.steel, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 24, maxWidth: 720 }}>{description}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {features.map((f, i) => <div key={i} style={{ color: brand.steel, fontSize: '0.88rem', padding: '6px 0 6px 20px', position: 'relative', lineHeight: 1.6 }}><span style={{ position: 'absolute', left: 0, color: brand.gold }}>→</span>{f}</div>)}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   CASE STUDY
   ═══════════════════════════════════════════════════ */
const CaseStudy = ({ company, industry, challenge, solution, results, tech }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: `1px solid ${brand.softTitan}`, padding: '36px 0' }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <div>
          <h3 style={{ fontFamily: fontMain, fontSize: '1.3rem', fontWeight: 500, color: brand.void, marginBottom: 4 }}>{company}</h3>
          <span style={{ fontFamily: fontMono, fontSize: '0.72rem', color: brand.creme, letterSpacing: '0.05em' }}>{industry}</span>
        </div>
        <span style={{ fontFamily: fontMono, fontSize: '1.2rem', color: brand.gold, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', display: 'inline-block' }}>+</span>
      </div>
      <div style={{ maxHeight: open ? 700 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.19,1,0.22,1)' }}>
        <div style={{ paddingTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div><div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Challenge</div><p style={{ color: brand.steel, fontSize: '0.9rem', lineHeight: 1.7 }}>{challenge}</p></div>
          <div><div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Solution</div><p style={{ color: brand.steel, fontSize: '0.9rem', lineHeight: 1.7 }}>{solution}</p></div>
          <div><div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Results</div>
            <ul style={{ listStyle: 'none', padding: 0 }}>{results.map((r, i) => <li key={i} style={{ color: brand.void, fontSize: '0.88rem', padding: '3px 0 3px 16px', position: 'relative', fontWeight: 500 }}><span style={{ position: 'absolute', left: 0, color: brand.gold, fontWeight: 400 }}>•</span>{r}</li>)}</ul></div>
          <div><div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Stack</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{tech.map(t => <span key={t} style={{ fontFamily: fontMono, fontSize: '0.63rem', color: brand.militant, border: `1px solid ${brand.softTitan}`, borderRadius: 2, padding: '2px 8px' }}>{t}</span>)}</div></div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   APP CARD — with video preview area
   ═══════════════════════════════════════════════════ */
const AppCard = ({ name, type, description, url, videoSrc }) => {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ border: `1px solid ${h ? brand.gold : brand.softTitan}`, borderRadius: 2, overflow: 'hidden', flex: 1, minWidth: 300, transition: 'border-color 0.4s' }}>
      <div style={{ width: '100%', height: 220, background: brand.void, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {videoSrc ? <video src={videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ fontFamily: fontMono, fontSize: '0.72rem', color: brand.steel, letterSpacing: '0.1em' }}>Video preview</div>}
      </div>
      <div style={{ padding: 28 }}>
        <div style={{ fontFamily: fontMono, fontSize: '0.65rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{type}</div>
        <h3 style={{ fontFamily: fontMain, fontSize: '1.15rem', fontWeight: 500, color: brand.void, marginBottom: 10 }}>{name}</h3>
        <p style={{ color: brand.steel, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>{description}</p>
        {url && <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: fontMono, fontSize: '0.7rem', color: brand.gold, textDecoration: 'none', borderBottom: `1px solid ${brand.gold}`, paddingBottom: 2 }}>{url} ↗</a>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════ */
const App = () => {
  const [showStack, setShowStack] = useState(false);

  useEffect(() => {
    const link = document.createElement('link'); link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap'; link.rel = 'stylesheet'; document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = `* { box-sizing: border-box; margin: 0; padding: 0; } html { scroll-behavior: smooth; } body { overflow-x: hidden; } @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } } ::selection { background: ${brand.gold}; color: ${brand.void}; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);

  const services = [
    ['RAG & Custom Agents', 'Custom AI agents built on your data. RAG pipelines with vector databases, embeddings, and retrieval architectures tailored to your business.'],
    ['Database Modernization', 'Consolidate disconnected tools into a single intelligent database with integrated AI agents — automated reconciliation, real-time sync, and on-demand reporting.'],
    ['Personal AI Assistant', 'Your own AI assistant connected to your tools — Gmail, Calendar, Slack, Trello, Drive. Multi-platform messaging. Voice-enabled.'],
    ['Websites & Branding', 'Full-stack web applications, landing pages, and brand identity systems. Design to deployment.'],
    ['Engineering Transformation', '60-90 day roadmap to AI-native velocity. Assessment, foundation, build, autonomy.'],
    ['Technical Leadership', 'Fractional lead dev / CTO. I own engineering so you can focus on growth.'],
  ];

  const stack = [
    ['AI / Agentic', 'Multi-agent orchestration, LLM integration (Claude, GPT-4, Gemini, Grok), RAG, vector databases, embeddings, voice agents (STT/TTS/VAD), prompt engineering, autonomous agents, tool use, function calling'],
    ['Languages & Frameworks', 'Python, TypeScript, JavaScript, React, Next.js, FastAPI, Node.js, Pydantic, TensorFlow, PyTorch, Scikit-learn'],
    ['Infrastructure & Data', 'PostgreSQL, Supabase, Firebase, SQLite, ETL pipelines, REST APIs, WebSocket streaming, Docker, CI/CD, Cloudflare (Workers, Pages, R2), QuickBooks API, Hostaway API, OCR pipelines'],
    ['Frontend & Integrations', 'Tailwind CSS, Radix UI, Playwright, responsive design, Git, npm publishing, Telegram/WhatsApp/Discord/Slack/Signal integrations'],
  ];

  return (
    <div style={{ backgroundColor: brand.bg, color: brand.void, fontFamily: fontMain }}>

      <AsciiHero />

      {/* ═══ WORK WITH ME ═══ */}
      <Section id="consulting">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div>
            <SectionLabel>Work With Me</SectionLabel>
            <SectionTitle>Started building startups at 20. Haven't stopped.</SectionTitle>
            <p style={{ color: brand.steel, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: 32 }}>
              Co-founded a social media analytics startup at 20, secured $300K in seed funding, built the data pipelines, and exited. Spent a decade in sales leadership closing multi-million dollar deals. Now I build production AI systems that eliminate manual work — and help engineering teams ship 3-5x faster with agent-first workflows. Consulting engagements have saved clients $25K+ annually and 25+ hours of monthly labor.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
              <button onClick={() => setShowStack(false)} style={{ fontFamily: fontMono, fontSize: '0.72rem', letterSpacing: '0.05em', padding: '8px 20px', border: `1px solid ${!showStack ? brand.gold : brand.softTitan}`, borderRadius: 2, background: !showStack ? `${brand.gold}15` : 'transparent', color: !showStack ? brand.gold : brand.steel, cursor: 'pointer', transition: 'all 0.3s' }}>What I Offer</button>
              <button onClick={() => setShowStack(true)} style={{ fontFamily: fontMono, fontSize: '0.72rem', letterSpacing: '0.05em', padding: '8px 20px', border: `1px solid ${showStack ? brand.gold : brand.softTitan}`, borderRadius: 2, background: showStack ? `${brand.gold}15` : 'transparent', color: showStack ? brand.gold : brand.steel, cursor: 'pointer', transition: 'all 0.3s' }}>See My Stack</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(showStack ? stack : services).map(([title, desc]) => (
                <div key={title} style={{ borderLeft: `2px solid ${brand.gold}`, paddingLeft: 20 }}>
                  <div style={{ fontFamily: fontMain, fontSize: '0.95rem', fontWeight: 600, color: brand.void, marginBottom: 4 }}>{title}</div>
                  <div style={{ color: brand.steel, fontSize: '0.85rem', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 400 }}>
            <AvatarAutoplay />
          </div>
        </div>
      </Section>

      {/* ═══ CALENDAR - BOOK A CALL ═══ */}
      <Section id="book">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SectionLabel>Discovery Call</SectionLabel>
          <h2 style={{ fontFamily: fontMain, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: brand.void, letterSpacing: '-0.02em' }}>Quick discovery call. Let's see what we can do together.</h2>
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto', border: `1px solid ${brand.softTitan}`, borderRadius: 2, overflow: 'hidden' }}>
          <iframe src="https://cal.com/shanecoy/discovery?embed=true&theme=light" style={{ width: '100%', height: '100%', border: 'none' }} title="Book a discovery call" />
        </div>
      </Section>

      <Divider />

      {/* ═══ PROJECTS ═══ */}
      <Section id="projects">
        <SectionLabel>Engineering Projects</SectionLabel>
        <SectionTitle>Production systems I've built and ship.</SectionTitle>
        <ProjectShowcase title="Katana Agent" url="katana-agent.com" tags={['npm', 'open-source', 'agent framework', 'Python', 'Node.js']}
          description="Open-source personal AI agent framework distributed via npm — comparable to OpenAI Agents SDK and Mastra. Modular self-writing skill system enabling agents to autonomously create and install new capabilities."
          features={[
            'Self-writing skill system — agents create and install new capabilities autonomously',
            'Multi-platform messaging: Telegram, WhatsApp, Discord, Slack, Signal with persistent two-way communication',
            'Full Google Suite orchestration: Gmail, Calendar, Drive, Sheets + Trello + Playwright + RSS feeds',
            'MAGI-3 voice engine with STT/TTS/VAD — real-time self-hosted voice at sub-500ms latency',
            'ClawHub-compatible skill marketplace for community-contributed agent extensions',
            'Unified agent runtime connecting all integrations into a single orchestration layer',
          ]} />
        <ProjectShowcase title="Quant Pulse" url="quant-pulse.com" tags={['SaaS', 'financial AI', 'multi-agent', 'SEC pipeline', 'Claude API']}
          description="Full-stack financial intelligence SaaS with multi-agent AI analysis of SEC filings and real-time market data. Claude API orchestrating specialized agents for data extraction, financial analysis, and automated report generation."
          features={[
            'Multi-agent system orchestrating SEC filing extraction, analysis, and report generation — 95% reduction in manual analysis time',
            'Recursive retrieval architecture for nested SEC filings (10-K, 8-K, Form 4, S-1/S-3, 144) — 92% accuracy across 100K+ records',
            'Real-time data pipeline integrating SEC EDGAR, Alpaca, and yfinance APIs with WebSocket streaming at sub-500ms latency',
            'Hybrid SQLite/PostgreSQL caching with advisory locking and auto-deduplication — 85% fewer API calls, 60% infra cost savings',
          ]} />
      </Section>

      <Divider />

      {/* ═══ CASE STUDIES ═══ */}
      <Section id="cases">
        <SectionLabel>AI Consulting</SectionLabel>
        <SectionTitle>Client engagements.</SectionTitle>
        <CaseStudy company="AirButler Property Management" industry="Property Management / Hospitality"
          challenge="Property management company that had outgrown its tooling stack. Five disconnected software subscriptions. Manual bookkeeping eating 20+ hours a month. Owner reporting done via phone calls and email. No centralized data. No automation."
          solution="Delivered a 3-pillar automation system in 4 weeks. Centralized all business data into a single Supabase database — syncing Hostaway reservations, automated QuickBooks reconciliation, Google Sheets records, receipts via OCR pipeline, and contractor records in real time. Built automated accounting reconciliation engine with nightly API sync, discrepancy detection, auto-resolution of minor variances, and escalation workflows. Engineered customer portal with owner dashboards, booking history, invoice access, and live AI chat agent. Deployed Auto-Accountant AI agent for on-demand financial reports, charge explanations, market benchmarks, and contractor payment management."
          results={['Finance, reconciliation, and owner support: 20+ hrs/month → under 2 hrs', 'Saved $25,000/year replacing 5 software subscriptions with one custom system', 'Owner portal replaced manual email reports and phone calls entirely', 'Auto-Accountant AI agent handles on-demand financial queries', 'Nightly reconciliation with discrepancy detection and auto-resolution']}
          tech={['Python', 'Supabase', 'QuickBooks API', 'Hostaway API', 'OCR Pipeline', 'Google Sheets', 'AI Chat Agent']} />
        <CaseStudy company="VoxLine AI" industry="AI Voice Agents / Business Communication"
          challenge="AI voice agent platform with a 6-person engineering team falling behind on product launch. Low AI tool adoption. Slow feature shipping velocity. Single monolithic sales agent with no learning loop. Call quality inconsistent. No data pipeline for improvement. Founder splitting time between engineering oversight and customer growth."
          solution="Redesigned single monolithic sales agent into a specialized multi-agent system — agents trained on dual RAG vector databases to assist customers at different intake points across the sales pipeline. Designed 60-90 day engineering transformation roadmap with hard KPI gates: feature cycle time targeted at ~50% reduction by day 60, AI tool usage scaled to 90%+ across team, every engineer shipping production agent skills within 2 weeks. Architected self-improving call pipeline — 3-agent system analyzing transcripts, scoring performance 1-5, and generating weekly prompt optimizations via tournament selection with human approval gate and git-based version control."
          results={['Monolithic agent → specialized multi-agent system with dual RAG databases', '60-90 day roadmap with measurable KPI gates at every phase', 'Feature cycle time targeted at 50% reduction by day 60', 'Self-improving pipeline: every call makes the system smarter', 'Human-in-the-loop approval via Slack with git versioning and rollback']}
          tech={['Python', 'Supabase', 'RAG', 'Vector Databases', 'Tournament Selection', 'Slack HITL', 'Git Versioning', 'Pydantic']} />
      </Section>

      <Divider />

      {/* ═══ APPLICATIONS ═══ */}
      <Section id="apps">
        <SectionLabel>Applications</SectionLabel>
        <SectionTitle>Full-stack builds.</SectionTitle>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <AppCard name="Hiku Wire" type="Full-Stack E-Commerce Application"
            description="Custom full-stack e-commerce application with integrated image and video content management, SQL backend database, and user authentication. Currently in active development."
            url="hikuwire.com" videoSrc={null} />
          <AppCard name="Horizon Peptides" type="Brand & Website Design"
            description="Brand identity and website design for an online peptide retail store. Complete brand system with product-focused landing pages and signup flow."
            url="horizonpeptides.com" videoSrc={null} />
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 48px 64px', borderTop: `1px solid ${brand.softTitan}`, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ fontFamily: fontMain, fontSize: '1.1rem', fontWeight: 600, color: brand.void, marginBottom: 8 }}>Shane Coy</div>
          <p style={{ color: brand.steel, fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 360 }}>Agentic AI engineer and consultant. Production-grade autonomous systems that eliminate manual work and drive measurable business outcomes.</p>
        </div>
        <div>
          <div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Links</div>
          {[['GitHub', 'https://github.com/shane9coy'], ['Email', 'mailto:shane9coy@gmail.com'], ['Katana Agent', 'https://katana-agent.com'], ['Quant Pulse', 'https://quant-pulse.com']].map(([label, href]) => (
            <a key={label} href={href} style={{ display: 'block', color: brand.steel, fontSize: '0.88rem', textDecoration: 'none', padding: '4px 0', transition: 'color 0.3s' }}
              onMouseEnter={e => e.target.style.color = brand.gold} onMouseLeave={e => e.target.style.color = brand.steel}>{label}</a>
          ))}
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: fontMono, fontSize: '0.72rem', color: brand.softTitan }}>© 2026</div>
          <div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.creme, lineHeight: 1.6 }}>Columbus, OH<br />614.357.0434</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
