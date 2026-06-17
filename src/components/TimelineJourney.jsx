import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- DATA ---
const TIMELINE = [
  {
    day: 0,
    title: 'Found on the street',
    subtitle: 'Mochi is found injured, alone, terrified',
    img: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=900',
    bgColor: 0x0f0a06,
    fogColor: 0x1a1008,
    fogDensity: 0.04,
    particleColor: 0x8C7B6E,
    particleType: 'rain',
    ambientIntensity: 0.1,
    spotIntensity: 0.3,
    imgFilter: 'grayscale(80%) brightness(0.45)',
    health: 'Critical',
    mood: 'Terrified',
    cta: null
  },
  {
    day: 14,
    title: 'Emergency vet care',
    subtitle: 'Surgery funded by donors like you',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900',
    bgColor: 0x1a0e08,
    fogColor: 0x2a1810,
    fogDensity: 0.03,
    particleColor: 0xE8A87C,
    particleType: 'dust',
    ambientIntensity: 0.25,
    spotIntensity: 0.5,
    imgFilter: 'grayscale(45%) brightness(0.6)',
    health: 'Unstable',
    mood: 'In pain',
    cta: null
  },
  {
    day: 45,
    title: 'Shelter recovery',
    subtitle: 'Getting stronger — first tail wag spotted',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900',
    bgColor: 0x2a1a0a,
    fogColor: 0x3a2810,
    fogDensity: 0.02,
    particleColor: 0xF4845F,
    particleType: 'sparkle',
    ambientIntensity: 0.5,
    spotIntensity: 0.8,
    imgFilter: 'grayscale(15%) brightness(0.8) saturate(1.1)',
    health: 'Recovering',
    mood: 'Cautious',
    cta: null
  },
  {
    day: 90,
    title: 'Foster home',
    subtitle: 'Mochi is fostered — learning to trust again',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900',
    bgColor: 0x4a2e10,
    fogColor: 0x6a4020,
    fogDensity: 0.01,
    particleColor: 0xE8A87C,
    particleType: 'petals',
    ambientIntensity: 0.8,
    spotIntensity: 1.2,
    imgFilter: 'saturate(1.2) brightness(1.0)',
    health: 'Stable',
    mood: 'Warming up',
    cta: 'Foster'
  },
  {
    day: 180,
    title: 'Forever home!',
    subtitle: 'Adopted — thriving in the sun',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900',
    bgColor: 0x8a5a20,
    fogColor: 0xc08040,
    fogDensity: 0.005,
    particleColor: 0xFDF8F3,
    particleType: 'confetti',
    ambientIntensity: 1.4,
    spotIntensity: 2.0,
    imgFilter: 'saturate(1.4) brightness(1.1)',
    health: 'Thriving',
    mood: 'Joyful',
    cta: 'Adopt'
  }
];

// --- UTILS ---
const loadScript = (src) => new Promise((resolve, reject) => {
  if (document.querySelector(`script[src="${src}"]`)) return resolve();
  const script = document.createElement('script');
  script.src = src; script.crossOrigin = "anonymous";
  script.onload = resolve; script.onerror = reject;
  document.head.appendChild(script);
});

// Shaders for crossfading
const _VS = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const _FS = `uniform sampler2D uTexA; uniform sampler2D uTexB; uniform float uMix; varying vec2 vUv;
void main() { gl_FragColor = mix(texture2D(uTexA, vUv), texture2D(uTexB, vUv), uMix); }`;

export default function TimelineJourney({ animalName = 'Mochi', timeline = TIMELINE, onAdopt, onDonate }) {
  // States
  const [progress, setProgress] = useState(0); 
  const [targetProgress, setTargetProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false); 

  // Refs
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mpCanvasRef = useRef(null);
  
  // Three.js Refs
  const tRefs = useRef({ scene: null, camera: null, renderer: null, material: null, textures: [], particles: {}, bgPlane: null, sidePlaneL: null, sidePlaneR: null, ambient: null, spot: null, reqId: null });
  // Audio Refs
  const aRefs = useRef({ ctx: null, osc: null, filter: null, gain: null });
  // Interaction Refs
  const dragging = useRef(false);
  const hasConfettied = useRef(false);
  const rollingBuffer = useRef([]);

  // --- 1. INITIALIZE THREE.JS & PRELOAD ---
  useEffect(() => {
    let mounted = true;
    const initThree = async () => {
      try {
        // FIXED: Switched to a stable version of Three.js (r128) that properly exposes window.THREE
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        if (!mounted) return;
        
        const THREE = window.THREE;
        if (!THREE) throw new Error("Three.js failed to load globally.");

        const w = containerRef.current.clientWidth;
        const h = 420;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        tRefs.current.renderer = renderer;

        // Scene & Camera
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(timeline[0].bgColor);
        scene.fog = new THREE.FogExp2(timeline[0].fogColor, timeline[0].fogDensity);
        
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        camera.position.set(0, 0.2, 5);
        tRefs.current.scene = scene;
        tRefs.current.camera = camera;

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, timeline[0].ambientIntensity);
        const spot = new THREE.SpotLight(0xfff0e0, timeline[0].spotIntensity);
        spot.position.set(0, 5, 5);
        scene.add(ambient, spot);
        tRefs.current.ambient = ambient; tRefs.current.spot = spot;

        // Load Textures
        const tl = new THREE.TextureLoader();
        tl.setCrossOrigin('anonymous');
        const loadedTex = [];
        for (let i = 0; i < timeline.length; i++) {
          loadedTex.push(await tl.loadAsync(timeline[i].img));
          setLoadPct(Math.round(((i + 1) / timeline.length) * 100));
        }
        tRefs.current.textures = loadedTex;

        // Planes
        const geo = new THREE.PlaneGeometry(8, 5.5);
        const mat = new THREE.ShaderMaterial({
          vertexShader: _VS, fragmentShader: _FS,
          uniforms: { uTexA: { value: loadedTex[0] }, uTexB: { value: loadedTex[0] }, uMix: { value: 0 } }
        });
        const bgPlane = new THREE.Mesh(geo, mat);
        scene.add(bgPlane);

        const sideGeo = new THREE.PlaneGeometry(6, 4);
        const sideMatL = new THREE.MeshBasicMaterial({ map: loadedTex[0], transparent: true, opacity: 0.3 });
        const sideMatR = new THREE.MeshBasicMaterial({ map: loadedTex[1], transparent: true, opacity: 0.3 });
        const sideL = new THREE.Mesh(sideGeo, sideMatL);
        const sideR = new THREE.Mesh(sideGeo, sideMatR);
        
        sideL.position.set(-6, -0.5, -2); sideL.rotation.y = Math.PI / 6;
        sideR.position.set(6, -0.5, -2);  sideR.rotation.y = -Math.PI / 6;
        scene.add(sideL, sideR);

        tRefs.current.material = mat;
        tRefs.current.bgPlane = bgPlane;
        tRefs.current.sidePlaneL = sideL;
        tRefs.current.sidePlaneR = sideR;

        // Particles
        const pCount = navigator.maxTouchPoints > 0 ? 300 : 600; // Mobile opt
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random() - 0.5) * 15;
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        
        const pMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0 });
        const points = new THREE.Points(pGeo, pMat);
        scene.add(points);
        tRefs.current.particles = { obj: points, positions: pPos };

        setIsLoaded(true);
        
        // Auto-play intro
        setTimeout(() => setTargetProgress(30), 500);
        
        startRenderLoop();
      } catch (err) {
        console.error("Error loading 3D Scene:", err);
      }
    };
    initThree();

    return () => {
      mounted = false;
      cancelAnimationFrame(tRefs.current.reqId);
      tRefs.current.renderer?.dispose();
    };
  }, []);

  // --- 2. RENDER LOOP ---
  const startRenderLoop = () => {
    const THREE = window.THREE;
    let clock = new THREE.Clock();

    const loop = () => {
      if (!tRefs.current.renderer) return;
      const t = tRefs.current;
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();

      // Lerp progress smoothly
      setProgress(prev => {
        const next = prev + (targetProgress - prev) * 10 * dt;
        
        // Map 0-100 to 5 stages (0, 25, 50, 75, 100)
        let exactStage = (next / 100) * 4;
        let idxA = Math.floor(exactStage);
        let idxB = Math.min(idxA + 1, 4);
        let mix = exactStage - idxA;
        
        // Update uniforms
        if (t.material && t.textures.length > 0) {
          t.material.uniforms.uTexA.value = t.textures[idxA];
          t.material.uniforms.uTexB.value = t.textures[idxB];
          t.material.uniforms.uMix.value = mix;
        }

        // Side planes
        if (t.sidePlaneL && t.sidePlaneR) {
          t.sidePlaneL.material.map = t.textures[Math.max(0, idxA - 1)];
          t.sidePlaneR.material.map = t.textures[Math.min(4, idxB + 1)];
        }

        // Lerp Scene properties
        const stA = timeline[idxA];
        const stB = timeline[idxB];
        t.scene.background.lerpColors(new THREE.Color(stA.bgColor), new THREE.Color(stB.bgColor), mix);
        t.scene.fog.color.lerpColors(new THREE.Color(stA.fogColor), new THREE.Color(stB.fogColor), mix);
        t.scene.fog.density = THREE.MathUtils.lerp(stA.fogDensity, stB.fogDensity, mix);
        t.ambient.intensity = THREE.MathUtils.lerp(stA.ambientIntensity, stB.ambientIntensity, mix);
        t.spot.intensity = THREE.MathUtils.lerp(stA.spotIntensity, stB.spotIntensity, mix);
        
        // Camera movement (Zoom + Tilt)
        t.camera.position.z = THREE.MathUtils.lerp(5, 3.5, next/100);
        t.camera.position.y = THREE.MathUtils.lerp(0.2, -0.1, next/100);
        
        // Parallax Card Tilt
        if (t.bgPlane) {
          t.bgPlane.rotation.y = THREE.MathUtils.lerp(t.bgPlane.rotation.y, (next - 50) * -0.002, 0.1);
        }

        // Particle logic
        updateParticles(t.particles, stA.particleType, stA.particleColor, time, dt);

        // UI State sync
        if (Math.round(idxA) !== currentStage) {
          setCurrentStage(Math.round(idxA));
          updateAudio(idxA);
        }

        return next;
      });

      t.renderer.render(t.scene, t.camera);
      t.reqId = requestAnimationFrame(loop);
    };
    loop();
  };

  const updateParticles = (parts, type, color, time, dt) => {
    if (!parts.obj) return;
    const THREE = window.THREE;
    parts.obj.material.color.setHex(color);
    parts.obj.material.opacity = THREE.MathUtils.lerp(parts.obj.material.opacity, type ? 0.6 : 0, 0.1);
    
    const pos = parts.obj.geometry.attributes.position.array;
    for(let i=0; i<pos.length; i+=3) {
      if (type === 'rain') {
        pos[i+1] -= 10 * dt;
        if (pos[i+1] < -5) pos[i+1] = 5;
      } else if (type === 'dust') {
        pos[i] += Math.sin(time + i) * 0.01;
        pos[i+1] += Math.cos(time + i) * 0.01;
      } else if (type === 'sparkle') {
        // twinkling handled by opacity
      } else if (type === 'petals' || type === 'confetti') {
        pos[i] += Math.sin(time*2 + i) * 0.02;
        pos[i+1] -= (type === 'confetti' ? 3 : 1) * dt;
        if (pos[i+1] < -5) { pos[i+1] = 5; pos[i] = (Math.random()-0.5)*15; }
      }
    }
    parts.obj.geometry.attributes.position.needsUpdate = true;
  };

  // --- 3. WEB AUDIO API ---
  const toggleAudio = () => {
    if (isMuted) {
      if (!aRefs.current.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        filter.type = 'lowpass';
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        aRefs.current = { ctx, osc, filter, gain };
      }
      aRefs.current.ctx.resume();
      updateAudio(currentStage);
      setIsMuted(false);
    } else {
      aRefs.current.ctx?.suspend();
      setIsMuted(true);
    }
  };

  const updateAudio = (stage) => {
    if (isMuted || !aRefs.current.ctx) return;
    const { osc, filter, gain } = aRefs.current;
    const now = aRefs.current.ctx.currentTime;
    
    // Smooth transitions
    filter.frequency.setTargetAtTime(stage < 2 ? 300 : (stage < 4 ? 600 : 1200), now, 1);
    osc.frequency.setTargetAtTime(stage < 2 ? 80 : (stage < 4 ? 150 : 300), now, 1);
    gain.gain.setTargetAtTime(stage === 0 ? 0.2 : 0.1, now, 1);
  };

  // --- 4. MEDIA PIPE HAND TRACKING ---
  const startHandTracking = async () => {
    try {
      setIsCameraLoading(true); setCameraError('');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');

      const { Hands, Camera } = window;
      const hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.7, minTrackingConfidence: 0.6 });

      hands.onResults((results) => {
        const ctx = mpCanvasRef.current?.getContext('2d');
        if (!ctx || !mpCanvasRef.current) return;
        ctx.clearRect(0, 0, mpCanvasRef.current.width, mpCanvasRef.current.height);

        if (results.multiHandLandmarks?.length > 0) {
          if (!hasSeenHand.current) { setShowToast(true); setTimeout(() => setShowToast(false), 3000); hasSeenHand.current = true; }
          const lm = results.multiHandLandmarks[0];
          
          // Draw skeleton
          const connections = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
          connections.forEach(([a,b]) => { ctx.beginPath(); ctx.moveTo(lm[a].x*320, lm[a].y*240); ctx.lineTo(lm[b].x*320, lm[b].y*240); ctx.strokeStyle='rgba(244,132,95,0.8)'; ctx.lineWidth=2; ctx.stroke(); });
          lm.forEach((pt, i) => { ctx.beginPath(); ctx.arc(pt.x*320, pt.y*240, i===8?8:4, 0, Math.PI*2); ctx.fillStyle=i===8?'#F4845F':'rgba(244,132,95,0.5)'; ctx.fill(); });

          // Map index finger (mirrored) to progress
          let mx = 1 - lm[8].x;
          rollingBuffer.current.push(mx);
          if (rollingBuffer.current.length > 8) rollingBuffer.current.shift();
          const avg = rollingBuffer.current.reduce((a,b)=>a+b,0)/rollingBuffer.current.length;
          
          setTargetProgress(Math.max(0, Math.min(100, avg * 100)));
        } else {
          rollingBuffer.current = [];
        }
      });

      const camera = new Camera(videoRef.current, { onFrame: async () => await hands.send({ image: videoRef.current }), width: 320, height: 240 });
      await camera.start();
      setIsTracking(true); setIsCameraLoading(false);
    } catch (err) {
      setCameraError('Camera access denied or unavailable.');
      setIsCameraLoading(false);
    }
  };

  const stopHandTracking = () => {
    setIsTracking(false);
  };

  // --- 5. EVENT HANDLERS ---
  const handleDrag = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    setTargetProgress(Math.max(0, Math.min(100, pct)));
  }, []);

  const st = timeline[currentStage];

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
        <div>
          <span style={{ display: 'inline-block', backgroundColor: 'var(--text)', color: 'var(--bg-page)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            {animalName}'s Journey — Day {st.day}
          </span>
          <h2 style={{ margin: 0, fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: '800', color: 'var(--text)', letterSpacing: '-1px', transition: 'opacity 0.3s' }}>
            {st.title}
          </h2>
        </div>
        <button onClick={toggleAudio} style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold' }}>
          {isMuted ? '🔇 Audio Off' : '🔊 Ambient On'}
        </button>
      </div>

      {/* 3D CANVAS STAGE */}
      <div 
        onMouseDown={() => dragging.current = true}
        onMouseUp={() => dragging.current = false}
        onMouseLeave={() => dragging.current = false}
        onMouseMove={(e) => dragging.current && handleDrag(e.clientX)}
        onTouchMove={(e) => handleDrag(e.touches[0].clientX)}
        style={{ 
          position: 'relative', width: '100%', height: '420px', borderRadius: '24px', overflow: 'hidden', 
          backgroundColor: '#0f0a06', cursor: 'ew-resize', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' 
        }}
      >
        {!isLoaded && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-card)', zIndex: 20 }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--rescue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '15px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Loading Mochi's story... {loadPct}%</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {showToast && (
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px 20px', borderRadius: '20px', zIndex: 10, fontSize: '0.9rem', fontWeight: 'bold', animation: 'fadeIn 0.3s' }}>
            ✨ Wave left and right to explore time
          </div>
        )}

        {/* Dynamic CSS filter overlay based on stage */}
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', outline: 'none', transition: 'filter 0.5s ease', filter: st.imgFilter }} />
        
        {/* WEBCAM PREVIEW (Small, Bottom Right) */}
        {isTracking && (
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '120px', height: '90px', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
            <video ref={videoRef} playsInline autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            <canvas ref={mpCanvasRef} width={320} height={240} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'scaleX(-1)' }} />
          </div>
        )}
      </div>

      {/* TIMELINE CONTROLS */}
      <div style={{ marginTop: '25px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Scrubber & Dots */}
        <div style={{ flex: '1 1 300px' }}>
          <input 
            type="range" min="0" max="100" value={targetProgress} 
            onChange={(e) => setTargetProgress(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--rescue)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 5px' }}>
            {timeline.map((item, idx) => (
              <div 
                key={idx} onClick={() => setTargetProgress((idx / 4) * 100)}
                style={{ 
                  width: currentStage === idx ? '14px' : '8px', height: currentStage === idx ? '14px' : '8px', 
                  backgroundColor: currentStage >= idx ? 'var(--rescue)' : 'var(--border)', 
                  borderRadius: '50%', cursor: 'pointer', transition: 'all 0.3s'
                }} 
              />
            ))}
          </div>
        </div>

        {/* Hand Tracking Toggle */}
        <button 
          onClick={isTracking ? stopHandTracking : startHandTracking} disabled={isCameraLoading}
          style={{ padding: '12px 20px', borderRadius: '12px', border: isTracking ? '1px solid var(--border)' : 'none', backgroundColor: isTracking ? 'transparent' : 'var(--bg-card)', color: 'var(--text)', fontWeight: 'bold', cursor: isCameraLoading ? 'wait' : 'pointer' }}
        >
          {isCameraLoading ? 'Loading AI...' : (isTracking ? 'Turn off Gestures' : '✋ Enable Magic Gestures')}
        </button>
      </div>

      {/* INFO STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '30px', backgroundColor: 'var(--bg-surface)', padding: '20px', borderRadius: '16px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Subtitle</div>
          <div style={{ fontSize: '1.05rem', color: 'var(--text)', fontWeight: '500' }}>{st.subtitle}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Health Status</div>
          <div style={{ fontSize: '1.05rem', color: st.day > 30 ? 'var(--sage)' : 'var(--rescue)', fontWeight: 'bold' }}>{st.health}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Current Mood</div>
          <div style={{ fontSize: '1.05rem', color: 'var(--text)', fontWeight: '500' }}>{st.mood}</div>
        </div>
      </div>

      {/* CTAS */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button 
          onClick={onAdopt}
          style={{ flex: '1 1 200px', padding: '18px', borderRadius: '30px', border: 'none', backgroundColor: currentStage === 4 ? 'var(--sage)' : 'var(--rescue)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', transition: 'background-color 0.3s' }}
        >
          {currentStage === 4 ? '🎉 Meet Another Animal' : `Adopt ${animalName}`}
        </button>
        {currentStage < 4 && (
          <button 
            onClick={onDonate}
            style={{ flex: '1 1 200px', padding: '18px', borderRadius: '30px', border: '2px solid var(--rose)', backgroundColor: 'transparent', color: 'var(--rose)', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
          >
            Fund her surgery
          </button>
        )}
      </div>

    </div>
  );
}