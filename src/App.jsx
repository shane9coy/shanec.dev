import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════
   SHANE COY — shanc.dev
   Brand: Void Black, Golden Ray, Militar Night,
          Urban Steel, Soft Titanium, Creme White, Obsidian Green
   ═══════════════════════════════════════════════════ */

const brand = {
  bg:        '#ffffff',
  softForest: '#cfd4cf',
  softTitan: '#CFD0D4',
  void:      '#050505',
  gold:      '#DAB986',
  creme:     '#C3B79D',
  militar:   '#323F36',
  oGreen:    '#344532',
  steel:     '#363B3E',
};

const fontMain = "'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif";
const fontMono = "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace";
const fontDisplay = "'Sakire', 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/* ═══════════════════════════════════════════════════
   ASCII HERO CANVAS
   ═══════════════════════════════════════════════════ */
const AsciiHero = ({ isCompactNav = false }) => {
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
    const gradColors = [{ r: 154, g: 166, b: 150 }, { r: 95, g: 110, b: 92 }, { r: 50, g: 63, b: 54 }];
    const asciiStart = 0.04;
    const fadeStart = 0.74;
    const fadeLength = 0.18;
    const lerpColor = (t) => {
      const idx = t * (gradColors.length - 1), lo = Math.floor(idx), hi = Math.min(lo + 1, gradColors.length - 1), f = idx - lo;
      const a = gradColors[lo], b = gradColors[hi];
      return { r: Math.round(a.r + (b.r - a.r) * f), g: Math.round(a.g + (b.g - a.g) * f), b: Math.round(a.b + (b.b - a.b) * f) };
    };
    let w, h, heroH;
    const resize = () => { heroH = canvas.parentElement.clientHeight; w = canvas.parentElement.clientWidth; h = heroH * 1.36; const dpr = window.devicePixelRatio || 1; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; };
    resize(); window.addEventListener('resize', resize);
    const onMove = (e) => { mousePosRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    const render = () => {
      ctx.clearRect(0, 0, w, h); ctx.font = `${charSize}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const cols = Math.ceil(w / charSize), rows = Math.ceil(h / charSize), rect = canvas.getBoundingClientRect();
      for (let y = 0; y < rows; y++) { if (y < rows * asciiStart) continue; for (let x = 0; x < cols; x++) {
        const px = x * charSize, py = y * charSize, dx = px - mousePosRef.current.x, dy = py - (mousePosRef.current.y - rect.top);
        const dist = Math.sqrt(dx * dx + dy * dy), depth = y / rows, nY = (rows - y) / rows, nv = noise(x, y, timeRef.current * 0.5);
        const mh = 0.95 + Math.sin(x * 0.04 + timeRef.current * 0.08) * 0.045 + Math.cos(x * 0.11 + depth * 6) * 0.03;
        let ch = '', alpha = 0;
        const fadeT = Math.max(0, Math.min(1, (y - rows * fadeStart) / (rows * fadeLength))), fadeAlpha = 1 - fadeT;
        const textHole = Math.exp(-(
          Math.pow((px - w * 0.24) / (w * 0.24), 2) +
          Math.pow((py - heroH * 0.77) / (heroH * 0.2), 2)
        ) * 5.8);
        const lowerSpread = depth < 0.28 ? 1 : Math.max(0.1, Math.min(1, ((px / w) - 0.08) / 0.78));
        const fieldMask = Math.max(0, Math.min(1, (1 - textHole * 0.97) * lowerSpread));
        if (nY < mh + nv * 0.08) { const idx = Math.floor(Math.abs(nv) * chars.length); ch = chars[idx % chars.length]; alpha = Math.max(0, (0.84 - depth * 0.38) * fadeAlpha * fieldMask); }
        const gradT = Math.max(0, Math.min(1, (y - rows * asciiStart) / (rows * (1 - asciiStart)))), gc = lerpColor(gradT);
        if (dist < 170) { const ls = 1 - dist / 170; if (Math.random() > 0.5) ch = Math.random() > 0.5 ? '0' : '1';
          ctx.fillStyle = `rgba(${gc.r},${gc.g},${gc.b},${Math.max(alpha, ls * fadeAlpha * fieldMask * 0.72)})`; const sx = dist > 0 ? (dx / dist) * 12 * ls : 0, sy = dist > 0 ? (dy / dist) * 12 * ls : 0;
          ctx.fillText(ch, px + charSize / 2 - sx, py + charSize / 2 - sy);
        } else if (ch) { ctx.fillStyle = `rgba(${gc.r},${gc.g},${gc.b},${alpha})`; ctx.fillText(ch, px + charSize / 2, py + charSize / 2); }
      }}
      timeRef.current += 0.01; animRef.current = requestAnimationFrame(render);
    };
    animRef.current = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', minHeight: 760, width: '100%', overflow: 'visible', background: `linear-gradient(180deg, #2d382f 0%, rgba(50, 63, 54, 0.96) 18%, rgba(90, 104, 89, 0.74) 38%, rgba(198, 203, 196, 0.14) 64%, rgba(255, 255, 255, 0.08) 86%, rgba(255, 255, 255, 0) 100%)` }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '136%', position: 'absolute', top: 0, left: 0, opacity: 0.78, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12, 16, 13, 0.16) 0%, rgba(50, 63, 54, 0.08) 18%, rgba(50, 63, 54, 0) 42%, rgba(255, 255, 255, 0) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 24% 60%, rgba(50, 63, 54, 0.04) 0%, rgba(50, 63, 54, 0.02) 18%, rgba(50, 63, 54, 0.01) 32%, rgba(50, 63, 54, 0) 52%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 88%, rgba(214, 218, 210, 0.03) 95%, rgba(255, 255, 255, 0.08) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 'max(84px, 10vh)', left: 'clamp(24px, 4vw, 48px)', width: 'min(560px, calc(100vw - 72px))', pointerEvents: 'none', zIndex: 2 }}>
        <div style={{ fontFamily: fontMono, fontSize: 'clamp(1rem, 1.45vw, 1.18rem)', fontWeight: 500, letterSpacing: '0.02em', color: 'rgba(50, 63, 54, 0.9)', marginBottom: 10 }}>
          Hey, it&apos;s me...
        </div>
        <h1 style={{ fontFamily: fontDisplay, fontSize: 'clamp(3.8rem, 8.2vw, 6.75rem)', fontWeight: 400, letterSpacing: '0.015em', lineHeight: 0.92, color: brand.gold, marginBottom: 18, textShadow: '0 20px 60px rgba(50, 63, 54, 0.18)' }}>Shane Coy</h1>
        <p style={{ fontFamily: fontMono, fontSize: 'clamp(0.92rem, 1.1vw, 1rem)', color: 'rgba(54, 59, 62, 0.96)', maxWidth: 560, lineHeight: 1.8 }}>
          Building agentic infrastructure, AI Agents, software, online brands, and systems that compound value
        </p>
      </div>
      <nav style={{ position: 'absolute', top: isCompactNav ? 20 : 32, left: 'clamp(20px, 4vw, 48px)', right: 'clamp(20px, 4vw, 48px)', display: 'flex', justifyContent: 'space-between', alignItems: isCompactNav ? 'flex-start' : 'center', gap: isCompactNav ? 18 : 24, zIndex: 2 }}>
        <span style={{ fontFamily: fontMono, fontSize: isCompactNav ? '0.74rem' : '0.8rem', color: brand.creme, fontWeight: 600, flexShrink: 0, paddingTop: isCompactNav ? 2 : 0 }}>SHANEC.DEV</span>
        <div style={{ display: isCompactNav ? 'grid' : 'flex', gridTemplateColumns: isCompactNav ? 'repeat(2, max-content)' : undefined, columnGap: isCompactNav ? 14 : 32, rowGap: 8, justifyContent: 'flex-end', maxWidth: isCompactNav ? 210 : undefined, marginLeft: 'auto' }}>
          {[['Work With Me', 'consulting'], ['Projects', 'projects'], ['Case Studies', 'cases'], ['Applications', 'apps']].map(([label, id]) => (
            <span key={id} onClick={() => scrollTo(id)} style={{ fontFamily: fontMono, fontSize: isCompactNav ? '0.66rem' : '0.75rem', color: 'rgba(255, 255, 255, 0.74)', cursor: 'pointer', letterSpacing: '0.03em', lineHeight: 1.15, transition: 'color 0.3s' }}
              onMouseEnter={e => e.target.style.color = brand.gold} onMouseLeave={e => e.target.style.color = 'rgba(255, 255, 255, 0.74)'}>{label}</span>
          ))}
        </div>
      </nav>
      <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', fontFamily: fontMono, fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.72)', letterSpacing: '0.15em', textTransform: 'uppercase', animation: 'pulse 2s ease-in-out infinite', zIndex: 2 }}>↓ Scroll</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════ */
const Section = ({ id, children }) => (<section id={id} style={{ padding: '64px 48px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>{children}</section>);
const SectionLabel = ({ children }) => (<div style={{ fontFamily: fontMono, fontSize: '0.7rem', color: brand.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{children}</div>);
const SectionTitle = ({ children }) => (<h2 style={{ fontFamily: fontMain, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, color: brand.militar, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 48 }}>{children}</h2>);
const Divider = () => (<div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}><div style={{ height: 1, background: brand.softTitan }} /></div>);

/* ═══════════════════════════════════════════════════
   AVATAR — With costume selector and animation cycling
   ═══════════════════════════════════════════════════ */
const AvatarAutoplay = ({ compact = false }) => {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const currentRef = useRef(null);
  const clockRef = useRef(null);
  const cycleTimeoutRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMouseXRef = useRef(0);
  const targetRotationRef = useRef(0);
  const currentRotationRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [costumeIndex, setCostumeIndex] = useState(0);

  // Costume list - index 0 is "shane" (original avatar with animations)
  const costumes = [
    { name: 'Shane', path: '', isShane: true },
    { name: 'Steve', path: '/avatar/costumes/Steve.glb', isShane: false },
    { name: 'Palmer', path: '/avatar/costumes/lucky.glb', isShane: false },
    { name: 'Jensen', path: '/avatar/costumes/jensen.glb', isShane: false },
    { name: 'Elon', path: '/avatar/costumes/Elon.glb', isShane: false },
    { name: 'Altman', path: '/avatar/costumes/Altman.glb', isShane: false },
    { name: 'Gekko', path: '/avatar/costumes/Gekko.glb', isShane: false },
    { name: 'Anima', path: '/avatar/costumes/Anima.glb', isShane: false },
    { name: 'Hairy', path: '/avatar/costumes/hairy.glb', isShane: false },
    { name: 'Luke', path: '/avatar/costumes/Luke.glb', isShane: false },
    { name: 'Messi', path: '/avatar/costumes/Messi.glb', isShane: false },
    { name: 'Player 456', path: '/avatar/costumes/Player 456.glb', isShane: false },
    { name: 'Priest', path: '/avatar/costumes/Priest.glb', isShane: false },
    { name: 'Sir Lancelot', path: '/avatar/costumes/SirLancelot.glb', isShane: false },
    { name: 'Tech Bro', path: '/avatar/costumes/Tech bro.glb', isShane: false },
  ];

  const currentCostume = costumes[costumeIndex];

  // Shane's animation files
  const shaneAnimFiles = { initial: '/avatar/point.glb', standing: '/avatar/standing.glb', kick: '/avatar/kick.glb', chair: '/avatar/chair.glb', backflip: '/avatar/backflip.glb' };

  const switchAnim = useCallback((name) => {
    if (!mixerRef.current || !actionsRef.current[name]) return;
    const prev = actionsRef.current[currentRef.current];
    const next = actionsRef.current[name];
    if (prev) prev.fadeOut(0.5);
    next.reset().fadeIn(0.5).play();
    currentRef.current = name;
  }, []);

  // Handle costume change
  const changeCostume = useCallback((direction) => {
    // Clear existing timeout
    if (cycleTimeoutRef.current) {
      clearTimeout(cycleTimeoutRef.current);
    }

    setCostumeIndex(prev => {
      let newIndex;
      if (direction === 'next') {
        newIndex = (prev + 1) % costumes.length;
      } else {
        newIndex = (prev - 1 + costumes.length) % costumes.length;
      }
      return newIndex;
    });
  }, []);

  useEffect(() => {
    let disposed = false;
    const mount = mountRef.current;
    if (!mount) return;

    // Reset rotation when costume changes
    isDraggingRef.current = false;
    previousMouseXRef.current = 0;
    targetRotationRef.current = 0;
    currentRotationRef.current = 0;

    // Clear previous timeout when costume changes
    if (cycleTimeoutRef.current) {
      clearTimeout(cycleTimeoutRef.current);
    }

    const loadThree = async () => {
      const THREE = await import('three');
      const scene = new THREE.Scene();
      const w = mount.clientWidth, h = mount.clientHeight;
      const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
      camera.position.set(0, 0.9, 3.8); camera.lookAt(0, 0.9, 0);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
      
      // Clear previous canvas if exists
      if (mount.querySelector('canvas')) {
        mount.removeChild(mount.querySelector('canvas'));
      }
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
      const loader = new GLTFLoader(); 
      let baseModel = null;
      
      // Reset actions
      actionsRef.current = {};

      const loadAnim = (name, url) => new Promise((resolve) => {
        loader.load(url, (gltf) => {
          if (!baseModel) { 
            baseModel = gltf.scene; 
            baseModel.scale.set(1.0, 1.0, 1.0); 
            baseModel.position.set(0, 0, 0); 
            scene.add(baseModel); 
            mixerRef.current = new THREE.AnimationMixer(baseModel); 
          }
          if (gltf.animations?.length > 0) actionsRef.current[name] = mixerRef.current.clipAction(gltf.animations[0]);
          resolve();
        }, undefined, () => resolve());
      });

      // Load appropriate model based on costume
      const thisCostume = costumes[costumeIndex];
      const animFilesToLoad = thisCostume.isShane ? shaneAnimFiles : { costume: thisCostume.path };
      
      for (const [name, url] of Object.entries(animFilesToLoad)) { 
        if (disposed) return; 
        await loadAnim(name, url); 
      }
      
      setLoaded(true);

      // Start animation cycling for Shane
      if (thisCostume.isShane) {
        // Play initial animation (point.glb) once
        if (actionsRef.current.initial) { 
          const a = actionsRef.current.initial; 
          a.setLoop(THREE.LoopOnce); 
          a.clampWhenFinished = true; 
          a.play(); 
          currentRef.current = 'initial'; 
        }
        
        const cycle = ['standing', 'kick', 'chair', 'backflip']; 
        let ci = 0; 
        
        const startCycle = () => { 
          if (disposed) return; 
          switchAnim(cycle[ci]); 
          ci = (ci + 1) % cycle.length; 
          cycleTimeoutRef.current = setTimeout(startCycle, 8000); 
        };
        // After initial finishes, start the cycle
        setTimeout(() => { if (!disposed) startCycle(); }, 4000);
      } else {
        // For costumes, just play the first animation loop
        const firstAnim = Object.keys(actionsRef.current)[0];
        if (firstAnim && actionsRef.current[firstAnim]) {
          actionsRef.current[firstAnim].play();
          currentRef.current = firstAnim;
        }
      }

      const animate = () => { 
        if (disposed) return; 
        if (mixerRef.current) mixerRef.current.update(clockRef.current.getDelta()); 
        if (baseModel) {
          if (isDraggingRef.current) {
            // User is dragging - follow mouse
            currentRotationRef.current = targetRotationRef.current;
          } else {
            // Auto rotate until user interacts
            currentRotationRef.current += 0.0015;
            targetRotationRef.current = currentRotationRef.current;
          }
          baseModel.rotation.y = currentRotationRef.current;
        }
        renderer.render(scene, camera); 
        requestAnimationFrame(animate); 
      };
      animate();

      // Mouse handlers
      const onMouseDown = (e) => {
        isDraggingRef.current = true;
        previousMouseXRef.current = e.clientX;
        if (mount) mount.style.cursor = 'grabbing';
      };

      const onMouseMove = (e) => {
        if (!isDraggingRef.current) return;
        const deltaX = e.clientX - previousMouseXRef.current;
        targetRotationRef.current += deltaX * 0.01;
        previousMouseXRef.current = e.clientX;
      };

      const onMouseUp = () => {
        isDraggingRef.current = false;
        if (mount) mount.style.cursor = 'grab';
      };

      mount.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      if (mount) mount.style.cursor = 'grab';

      const onResize = () => { 
        const nw = mount.clientWidth, nh = mount.clientHeight; 
        camera.aspect = nw / nh; 
        camera.updateProjectionMatrix(); 
        renderer.setSize(nw, nh); 
      };
      window.addEventListener('resize', onResize);
      
      mount._cleanup = () => { 
        disposed = true; 
        if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current); 
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        if (mount) mount.removeEventListener('mousedown', onMouseDown);
        renderer.dispose(); 
        if (mount && mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); 
      };
    };

    loadThree();
    return () => { if (mount._cleanup) mount._cleanup(); };
  }, [costumeIndex]);

  return (
    <div style={{ width: '100%' }}>
      <div ref={mountRef} style={{ width: '100%', height: compact ? 'clamp(320px, 78vw, 420px)' : 600, borderRadius: 2, overflow: 'hidden', position: 'relative', background: `radial-gradient(ellipse at center bottom, ${brand.softTitan}22 0%, transparent 70%)` }}>
        {!loaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontMono, fontSize: '0.75rem', color: brand.creme, letterSpacing: '0.1em' }}>Loading...</div>}
      </div>
      
      {/* Costume Selector */}
      <div style={{ marginTop: compact ? 18 : 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 10 : 12 }}>
        <div style={{ fontFamily: fontMono, fontSize: compact ? '0.6rem' : '0.65rem', color: brand.creme, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center' }}>Choose your founder</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: compact ? 16 : 24, width: '100%' }}>
          <button 
            onClick={() => changeCostume('prev')}
            style={{ 
              width: compact ? 36 : 40, height: compact ? 36 : 40, 
              border: `1px solid ${brand.softTitan}`, 
              borderRadius: '50%',
              background: 'transparent',
              color: brand.steel,
              fontSize: compact ? '1rem' : '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.target.style.borderColor = brand.gold; e.target.style.color = brand.gold; }}
            onMouseLeave={e => { e.target.style.borderColor = brand.softTitan; e.target.style.color = brand.steel; }}
          >
            ←
          </button>
          <div style={{ 
            fontFamily: fontMain, 
            fontSize: compact ? '1rem' : '1.1rem', 
            fontWeight: 500, 
            color: brand.void,
            minWidth: compact ? 84 : 100,
            textAlign: 'center'
          }}>
            {currentCostume.name}
          </div>
          <button 
            onClick={() => changeCostume('next')}
            style={{ 
              width: compact ? 36 : 40, height: compact ? 36 : 40, 
              border: `1px solid ${brand.softTitan}`, 
              borderRadius: '50%',
              background: 'transparent',
              color: brand.steel,
              fontSize: compact ? '1rem' : '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => { e.target.style.borderColor = brand.gold; e.target.style.color = brand.gold; }}
            onMouseLeave={e => { e.target.style.borderColor = brand.softTitan; e.target.style.color = brand.steel; }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   PROJECT SHOWCASE — with collapsible details
   ═══════════════════════════════════════════════════ */
const ProjectShowcase = ({ title, url, tags, description, features }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: `1px solid ${brand.softTitan}`, padding: '36px 0' }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, cursor: 'pointer' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
            <h3 style={{ fontFamily: fontMain, fontSize: '1.3rem', fontWeight: 500, color: brand.void, margin: 0 }}>{title}</h3>
            <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, textDecoration: 'none', borderBottom: `1px solid ${brand.gold}`, paddingBottom: 2 }}>{url} ↗</a>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {tags.map(t => <span key={t} style={{ fontFamily: fontMono, fontSize: '0.63rem', color: brand.militar, border: `1px solid ${brand.softTitan}`, borderRadius: 2, padding: '2px 8px' }}>{t}</span>)}
          </div>
          <p style={{ color: brand.steel, fontSize: '0.9rem', lineHeight: 1.7, margin: 0, maxWidth: 780 }}>{description}</p>
        </div>
        <span style={{ fontFamily: fontMono, fontSize: '1.2rem', color: brand.gold, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', display: 'inline-block', marginTop: 2 }}>+</span>
      </div>
      <div style={{ maxHeight: open ? 640 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.19,1,0.22,1)' }}>
        <div style={{ paddingTop: 28 }}>
          <div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Highlights</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {features.map((f, i) => <div key={i} style={{ color: brand.steel, fontSize: '0.88rem', padding: '6px 0 6px 20px', position: 'relative', lineHeight: 1.6 }}><span style={{ position: 'absolute', left: 0, color: brand.gold }}>→</span>{f}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   CASE STUDY
   ═══════════════════════════════════════════════════ */
const CaseStudy = ({ company, industry, challenge, solution, results, tech, columnRatio, url }) => {
  const [open, setOpen] = useState(false);
  const renderDetailContent = (content) => {
    if (content == null) return null;
    if (React.isValidElement(content)) return content;
    return <div style={{ color: brand.steel, fontSize: '0.9rem', lineHeight: 1.7 }}>{content}</div>;
  };

  return (
    <div style={{ borderTop: `1px solid ${brand.softTitan}`, padding: '36px 0' }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <div>
          <h3 style={{ fontFamily: fontMain, fontSize: '1.3rem', fontWeight: 500, color: brand.void, marginBottom: 4 }}>{company}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: fontMono, fontSize: '0.72rem', color: brand.creme, letterSpacing: '0.05em' }}>{industry}</span>
            {url && <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, textDecoration: 'none', borderBottom: `1px solid ${brand.gold}`, paddingBottom: 2 }}>{url} ↗</a>}
          </div>
        </div>
        <span style={{ fontFamily: fontMono, fontSize: '1.2rem', color: brand.gold, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', display: 'inline-block' }}>+</span>
      </div>
      <div style={{ maxHeight: open ? 2000 : 0, overflow: 'hidden', transition: 'max-height 0.6s cubic-bezier(0.19,1,0.22,1)' }}>
        <div style={{ paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Challenge</div>
            {renderDetailContent(challenge)}
          </div>
          <div>
            <div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Solution</div>
            {renderDetailContent(solution)}
          </div>
          {results.length > 0 && (
            <div>
              <div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Results</div>
              <ul style={{ listStyle: 'none', padding: 0 }}>{results.map((r, i) => <li key={i} style={{ color: brand.void, fontSize: '0.88rem', padding: '3px 0 3px 16px', position: 'relative', fontWeight: 500 }}><span style={{ position: 'absolute', left: 0, color: brand.gold, fontWeight: 400 }}>•</span>{r}</li>)}</ul>
            </div>
          )}
          {tech.length > 0 && (
            <div>
              <div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Stack</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{tech.map(t => <span key={t} style={{ fontFamily: fontMono, fontSize: '0.63rem', color: brand.militar, border: `1px solid ${brand.softTitan}`, borderRadius: 2, padding: '2px 8px' }}>{t}</span>)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   APP CARD — with video preview area and collapsible details
   ═══════════════════════════════════════════════════ */
const AppCard = ({ name, type, description, url, videoSrc }) => {
  const [h, setH] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ border: `1px solid ${h ? brand.gold : brand.softTitan}`, borderRadius: 2, overflow: 'hidden', flex: 1, minWidth: 300, transition: 'border-color 0.4s' }}>
      <div style={{ width: '100%', height: 220, background: brand.void, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {videoSrc ? <video src={videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ fontFamily: fontMono, fontSize: '0.72rem', color: brand.steel, letterSpacing: '0.1em' }}>Video preview</div>}
      </div>
      <div style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ fontFamily: fontMono, fontSize: '0.65rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 0 }}>{type}</div>
          <span onClick={() => setOpen(!open)} style={{ fontFamily: fontMono, fontSize: '1.2rem', color: brand.gold, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', display: 'inline-block', cursor: 'pointer' }}>+</span>
        </div>
        <h3 onClick={() => setOpen(!open)} style={{ fontFamily: fontMain, fontSize: '1.15rem', fontWeight: 500, color: brand.void, marginBottom: 10, cursor: 'pointer' }}>{name}</h3>
        <p style={{ color: brand.steel, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 16 }}>{description}</p>
        <div style={{ maxHeight: open ? 300 : 0, overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.19,1,0.22,1)' }}>
          <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Link</div>
              {url && <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: fontMono, fontSize: '0.7rem', color: brand.gold, textDecoration: 'none', borderBottom: `1px solid ${brand.gold}`, paddingBottom: 2 }}>{url} ↗</a>}
            </div>
            <div>
              <div style={{ fontFamily: fontMono, fontSize: '0.68rem', color: brand.gold, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Preview</div>
              <div style={{ width: '100%', height: 80, background: brand.void, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                {videoSrc ? <video src={videoSrc} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ fontFamily: fontMono, fontSize: '0.65rem', color: brand.steel, letterSpacing: '0.1em' }}>No video</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   CAL.COM EMBED
   ═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   CAL.COM EMBED
   ═══════════════════════════════════════════════════ */
const CalEmbed = () => {
  return (
    <iframe 
      src="https://cal.com/shane-coy-mlofry/20min?embed=true&theme=light"
      style={{ width: '80%', height: '80%', minHeight: '400px', border: 'none', display: 'block', margin: '0 auto' }}
      title="Book a discovery call"
    />
  );
};

/* ═══════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════ */
const App = () => {
  const [showStack, setShowStack] = useState(false);
  const [workPanelMinHeight, setWorkPanelMinHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() => typeof window === 'undefined' ? 1200 : window.innerWidth);
  const servicesMeasureRef = useRef(null);
  const stackMeasureRef = useRef(null);
  const isMobileLayout = viewportWidth <= 960;
  const isCompactNav = viewportWidth <= 720;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@font-face { font-family: 'Sakire'; src: url('/fonts/Sakire.ttf') format('truetype'); font-display: swap; } * { box-sizing: border-box; margin: 0; padding: 0; } html { scroll-behavior: smooth; } body { overflow-x: hidden; } @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } } ::selection { background: ${brand.gold}; color: ${brand.void}; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener('resize', updateViewportWidth);
    return () => window.removeEventListener('resize', updateViewportWidth);
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

  const renderWorkItems = (items) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {items.map(([title, desc]) => (
        <div key={title} style={{ borderLeft: `2px solid ${brand.gold}`, paddingLeft: 20 }}>
          <div style={{ fontFamily: fontMain, fontSize: '0.95rem', fontWeight: 600, color: brand.void, marginBottom: 4 }}>{title}</div>
          <div style={{ color: brand.steel, fontSize: '0.85rem', lineHeight: 1.5 }}>{desc}</div>
        </div>
      ))}
    </div>
  );

  const workToggleButtons = (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: isMobileLayout ? 'center' : 'flex-start', marginBottom: 28 }}>
      <button onClick={() => setShowStack(false)} style={{ fontFamily: fontMono, fontSize: '0.72rem', letterSpacing: '0.05em', padding: '8px 20px', border: `1px solid ${!showStack ? brand.gold : brand.softTitan}`, borderRadius: 2, background: !showStack ? `${brand.gold}15` : 'transparent', color: !showStack ? brand.gold : brand.steel, cursor: 'pointer', transition: 'all 0.3s' }}>What I Offer</button>
      <button onClick={() => setShowStack(true)} style={{ fontFamily: fontMono, fontSize: '0.72rem', letterSpacing: '0.05em', padding: '8px 20px', border: `1px solid ${showStack ? brand.gold : brand.softTitan}`, borderRadius: 2, background: showStack ? `${brand.gold}15` : 'transparent', color: showStack ? brand.gold : brand.steel, cursor: 'pointer', transition: 'all 0.3s' }}>See My Stack</button>
    </div>
  );

  const workItemsPanel = (
    <div style={{ position: 'relative', minHeight: isMobileLayout ? undefined : workPanelMinHeight || undefined }}>
      {renderWorkItems(showStack ? stack : services)}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: '100%', visibility: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
        <div ref={servicesMeasureRef}>{renderWorkItems(services)}</div>
        <div ref={stackMeasureRef}>{renderWorkItems(stack)}</div>
      </div>
    </div>
  );

  const consultingAvatar = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignSelf: 'start', position: 'relative', zIndex: 1, marginTop: isMobileLayout ? 28 : 40, transform: isMobileLayout ? 'none' : 'translateY(90px)', width: '100%', maxWidth: isMobileLayout ? 460 : undefined, marginLeft: isMobileLayout ? 'auto' : undefined, marginRight: isMobileLayout ? 'auto' : undefined, marginBottom: isMobileLayout ? 20 : 0 }}>
      <div style={{ position: 'absolute', top: isMobileLayout ? 76 : 108, right: -10, bottom: -10, left: 0, background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.22) 12%, rgba(255, 255, 255, 0.74) 28%, rgba(255, 255, 255, 0.94) 42%, rgba(255, 255, 255, 1) 58%, rgba(255, 255, 255, 1) 100%)', filter: 'blur(14px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AvatarAutoplay compact={isMobileLayout} />
      </div>
    </div>
  );

  useEffect(() => {
    const measurePanelHeight = () => {
      const servicesHeight = servicesMeasureRef.current?.offsetHeight || 0;
      const stackHeight = stackMeasureRef.current?.offsetHeight || 0;
      const nextHeight = Math.max(servicesHeight, stackHeight);
      if (nextHeight) {
        setWorkPanelMinHeight(prev => prev === nextHeight ? prev : nextHeight);
      }
    };

    measurePanelHeight();
    window.addEventListener('resize', measurePanelHeight);

    if (typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', measurePanelHeight);
    }

    const observer = new ResizeObserver(measurePanelHeight);
    if (servicesMeasureRef.current) observer.observe(servicesMeasureRef.current);
    if (stackMeasureRef.current) observer.observe(stackMeasureRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measurePanelHeight);
    };
  }, []);

  return (
    <div style={{ backgroundColor: brand.bg, color: brand.void, fontFamily: fontMain }}>

      <AsciiHero isCompactNav={isCompactNav} />

      {/* ═══ WORK WITH ME ═══ */}
      <div style={{ position: 'relative', marginTop: -1 }}>
        <div style={{ position: 'absolute', top: -18, left: 0, right: 0, height: 118, background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 34%, rgba(255, 255, 255, 0.02) 68%, rgba(255, 255, 255, 0) 100%)', pointerEvents: 'none', zIndex: 0 }} />
        <Section id="consulting">
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: isMobileLayout ? '1fr' : '1fr 1fr', gap: isMobileLayout ? 32 : 64, alignItems: 'start' }}>
          <div>
            {isMobileLayout && consultingAvatar}
            <SectionLabel>Work With Me</SectionLabel>
            <SectionTitle>Started building startups at 20. Haven't stopped.</SectionTitle>
            <p style={{ color: brand.steel, fontSize: '0.95rem', lineHeight: 1.8, marginBottom: isMobileLayout ? 36 : 44 }}>
              Co-founded a social media analytics startup at 20, secured $300K in seed funding, built the data pipelines, and exited. Spent a decade in sales leadership closing multi-million dollar deals. Now I build production AI systems that eliminate manual work — and help engineering teams ship 3-5x faster with agent-first workflows. Consulting engagements have saved clients $25K+ annually and 25+ hours of monthly labor.
            </p>
            {workToggleButtons}
            {workItemsPanel}
          </div>
          {!isMobileLayout && consultingAvatar}
          </div>
        </Section>
      </div>

      {/* ═══ BOOK A CALL ═══ */}
      <Section id="book">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <SectionLabel>Regain time & money</SectionLabel>
          <h2 style={{ fontFamily: fontMain, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: brand.void, letterSpacing: '-0.02em' }}>
            Book that discovery call -<br /> Let's see what we can build or automate.
          </h2>
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <CalEmbed />
        </div>
      </Section>

      <Divider />

      {/* ═══ PROJECTS ═══ */}
      <Section id="projects">
        <SectionLabel>Engineering Projects</SectionLabel>
        <SectionTitle>Production Applications - Built and shipped.</SectionTitle>
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
        <SectionTitle>Client Case Studies</SectionTitle>
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
      {/*
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
      */}

      {/* ═══ FULL-STACK BUILDS (Case Study Style) ═══ */}
      <Section id="apps">
        <SectionLabel>Applications</SectionLabel>
        <SectionTitle>Full-stack builds.</SectionTitle>
        <CaseStudy company="Hiku Wire" industry="Full-Stack E-Commerce Application"
          challenge="Custom full-stack e-commerce application with integrated image and video content management, SQL backend database, and user authentication. Currently in active development."
          solution={
            <div style={{ width: '100%', height: 160, background: brand.void, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <div style={{ fontFamily: fontMono, fontSize: '0.72rem', color: brand.steel, letterSpacing: '0.1em' }}>Video placeholder</div>
            </div>
          }
          results={[]}
          tech={[]}
          columnRatio="1fr 2fr" />
        <CaseStudy company="Horizon Peptides" industry="Brand & Web Full Stack Design"
          challenge="Brand identity and website design for an online peptide retail store. Complete brand system with product-focused landing pages and signup flow."
          solution={
            <div style={{ width: '100%', height: 160, background: brand.void, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <div style={{ fontFamily: fontMono, fontSize: '0.72rem', color: brand.steel, letterSpacing: '0.1em' }}>Video placeholder</div>
            </div>
          }
          results={[]}
          tech={[]}
          columnRatio="1fr 2fr" />
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
