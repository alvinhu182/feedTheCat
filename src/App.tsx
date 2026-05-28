import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Volume2, VolumeX, RefreshCw, Star, ArrowRight, CheckCircle2, Award } from "lucide-react";

// Types for particles
interface Particle {
  id: number;
  x: number; // Percentual da largura em relação ao container
  y: number; // Força inicial ou offset
  type: "heart" | "star" | "kibble" | "blood" | "meat" | "bone" | "eyeball";
  size: number;
  delay: number;
}

// Cat Names representing typical super cute Brazilian names
const CAT_NAMES = [
  "Mingau", "Paçoca", "Pipoca", "Fubá", "Floquinho", 
  "Pudim", "Cookie", "Amora", "Pérola", "Mel", 
  "Kakau", "Nutella", "Mochi", "Sushi", "Toddy", 
  "Chico", "Nina", "Pretinho", "Neko", "Tigrinho"
];

// Color palettes and breed traits for our dynamic CSS cats
const CAT_PROFILES = [
  { 
    fur: "#FFB077", 
    furDark: "#E08B53", 
    earInner: "#FFAEC9", 
    typeText: "Tigrado Laranjinha 🍊",
    tabbyStripes: true 
  },
  { 
    fur: "#CBD5E1", 
    furDark: "#94A3B8", 
    earInner: "#FFAEC9", 
    typeText: "Gatinho de Neve ❄️",
    tabbyStripes: false
  },
  { 
    fur: "#ECE1D3", 
    furDark: "#5C4033", 
    earInner: "#FBCFE8", 
    typeText: "Siamês Imperial 🍫", 
    eyeColor: "#38bdf8", 
    hasMask: true 
  },
  { 
    fur: "#FDFBF7", 
    furDark: "#D97706", 
    earInner: "#FFAEC9", 
    typeText: "Tricolor Calico 🎨",
    hasCalicoSpots: true 
  },
  { 
    fur: "#334155", 
    furDark: "#1E293B", 
    earInner: "#FDA4AF", 
    typeText: "Frajola Tuxedo 🖤🤍", 
    eyeColor: "#10B981", 
    hasTuxedoV: true 
  },
  { 
    fur: "#FAFAF9", 
    furDark: "#D6D3D1", 
    earInner: "#FFAEC9", 
    typeText: "Persa Fofucho ☁️", 
    eyeColor: "#F59E0B", 
    isFluffy: true 
  },
  { 
    fur: "#A5B4FC", 
    furDark: "#6366F1", 
    earInner: "#E0E7FF", 
    typeText: "Scottish Fold Violeta 🔔", 
    foldedEars: true 
  },
  { 
    fur: "#212529", 
    furDark: "#111315", 
    earInner: "#FDA4AF", 
    typeText: "Pretinho da Sorte 🐈‍⬛", 
    eyeColor: "#FACC15" 
  }
];

// Sorteio de pensamentos triste e feliz
const SAD_THOUGHTS = [
  "Estou com tanta fome... Minha barriguinha faz 'shhh'... 🥺",
  "Será que alguém vai me dar um petisco fofinho hoje? 💧",
  "Mim dê ração por favor... Buáá! 😿",
  "Minhas orelhinhas estão caídas de fraqueza... 💔",
  "Estou com frio e fome... Alguém me ajuda? 🐾"
];

const HAPPY_THOUGHTS = [
  "Nhom nhum nhum! Que raçãozinha deliciosa! Hmmm... 🐾✨",
  "Purrr... Você é a melhor pessoa do mundo todinho! 💖",
  "Estou tão quentinho e feliz! Miau! Obrigado! 🥰🌈",
  "Que barriguinha cheia! Agora posso tirar um soninho! 💤",
  "Nhac! Salvou meu dia, miau! Amor eterno! ❤️😽"
];

export default function App() {
  const [currentCat, setCurrentCat] = useState({
    name: "",
    fur: "",
    furDark: "",
    earInner: "",
    typeText: "",
    eyeColor: "",
    hasMask: false,
    hasTuxedoV: false,
    isFluffy: false,
    hasCalicoSpots: false,
    foldedEars: false,
    tabbyStripes: false
  });
  const [catId, setCatId] = useState(0);
  const [feedCount, setFeedCount] = useState<number>(() => {
    const saved = localStorage.getItem("gatinho_faminto_feed_count");
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [currentCatFeeds, setCurrentCatFeeds] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [bloodSplatters, setBloodSplatters] = useState<{ id: number; x: number; y: number; size: number; rotation: number }[]>([]);
  const [showRedFlash, setShowRedFlash] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [isBowlShaking, setIsBowlShaking] = useState(false);
  const [sadThought, setSadThought] = useState("");
  const [happyThought, setHappyThought] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    localStorage.setItem("gatinho_faminto_feed_count", feedCount.toString());
  }, [feedCount]);
  
  // Particles for interactive effect
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Count of feed kibble levels
  const [kibbleLevel, setKibbleLevel] = useState(6);

  // Initialize first cat
  useEffect(() => {
    generateNewCat();
  }, []);

  // Update thoughts when the cat changes
  const generateNewCat = () => {
    const randomName = CAT_NAMES[Math.floor(Math.random() * CAT_NAMES.length)];
    const randomProfile = CAT_PROFILES[Math.floor(Math.random() * CAT_PROFILES.length)];
    const randomSad = SAD_THOUGHTS[Math.floor(Math.random() * SAD_THOUGHTS.length)];
    const randomHappy = HAPPY_THOUGHTS[Math.floor(Math.random() * HAPPY_THOUGHTS.length)];
    
    setCurrentCat({
      name: randomName,
      fur: randomProfile.fur,
      furDark: randomProfile.furDark,
      earInner: randomProfile.earInner,
      typeText: randomProfile.typeText,
      eyeColor: randomProfile.eyeColor || "",
      hasMask: !!randomProfile.hasMask,
      hasTuxedoV: !!randomProfile.hasTuxedoV,
      isFluffy: !!randomProfile.isFluffy,
      hasCalicoSpots: !!randomProfile.hasCalicoSpots,
      foldedEars: !!randomProfile.foldedEars,
      tabbyStripes: !!randomProfile.tabbyStripes
    });
    setSadThought(randomSad);
    setHappyThought(randomHappy);
    setIsHappy(false);
    setIsFeeding(false);
    setCurrentCatFeeds(0);
    setIsExploded(false);
    setBloodSplatters([]);
    setShowRedFlash(false);
    setKibbleLevel(6);
    setParticles([]);
    setCatId(prev => prev + 1);
  };

  // Synthesized Cute Crunchy Chews
  const playChewSound = () => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Play 4 cute crunches
      for (let i = 0; i < 4; i++) {
        const time = ctx.currentTime + i * 0.18;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(260, time);
        osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);
        
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + 0.1);
      }
    } catch (e) {
      console.log("Audio API blocked or not supported:", e);
    }
  };

  // Synthesized high-pitched "Miau!" Sweep
  const playMeowSound = () => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // We will perform a chirpy double-sweep "mi-au!"
      const now = ctx.currentTime;
      
      // "Mi" note
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);
      
      // "Au!" sweep (starts slightly offset)
      const delay = 0.08;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(700, now + delay);
      osc2.frequency.exponentialRampToValueAtTime(1100, now + delay + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(750, now + delay + 0.25);
      
      gain2.gain.setValueAtTime(0.01, now + delay);
      gain2.gain.linearRampToValueAtTime(0.22, now + delay + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + delay);
      osc2.stop(now + delay + 0.25);
      
    } catch (e) {
      console.log("Audio context is blocked:", e);
    }
  };

  // Synthesized dramatic explosion sound
  const playExplosionSound = () => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Ensure the audio context is active
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      
      const now = ctx.currentTime;
      
      // Create a dynamics compressor to make it sound punchy, squeezed and intense!
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-24, now);
      compressor.knee.setValueAtTime(30, now);
      compressor.ratio.setValueAtTime(12, now);
      compressor.attack.setValueAtTime(0.003, now);
      compressor.release.setValueAtTime(0.25, now);
      compressor.connect(ctx.destination);

      // --- 1. MASSIVE LOW END BOOM ---
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(220, now);
      osc1.frequency.exponentialRampToValueAtTime(10, now + 1.2);
      
      gain1.gain.setValueAtTime(1.0, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      
      osc1.connect(gain1);
      gain1.connect(compressor);
      osc1.start(now);
      osc1.stop(now + 1.2);

      // --- 2. DEEP COMPLEMENTARY SUB BASS ---
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(80, now);
      subOsc.frequency.linearRampToValueAtTime(20, now + 0.8);
      
      subGain.gain.setValueAtTime(1.2, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      subOsc.connect(subGain);
      subGain.connect(compressor);
      subOsc.start(now);
      subOsc.stop(now + 0.8);

      // --- 3. EXPLOSIVE NOISE BURST (Flesh shattering & Gas expansion) ---
      const bufferSize = ctx.sampleRate * 1.5; // 1.5 seconds of noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(1500, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(40, now + 1.0);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(1.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(compressor);
      noise.start(now);
      noise.stop(now + 1.5);

      // --- 4. TRAGIC HIGH PITCHED SWEEPING "MIAAAUUUUUUU!" SCREECH (Blown up) ---
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter2 = ctx.createBiquadFilter();
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(550, now);
      // Fast pitch rise then sudden dive to imitate screech
      osc2.frequency.linearRampToValueAtTime(1400, now + 0.15);
      osc2.frequency.linearRampToValueAtTime(100, now + 0.55);
      
      filter2.type = "bandpass";
      filter2.frequency.setValueAtTime(1000, now);
      filter2.frequency.linearRampToValueAtTime(200, now + 0.55);
      
      gain2.gain.setValueAtTime(0.4, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      
      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(compressor);
      osc2.start(now);
      osc2.stop(now + 0.6);

      // --- 5. HIGH SIZZLING BLOOD SPATTER / NOISE HISS ---
      const splatterSize = ctx.sampleRate * 0.4;
      const splatterBuffer = ctx.createBuffer(1, splatterSize, ctx.sampleRate);
      const sData = splatterBuffer.getChannelData(0);
      for (let i = 0; i < splatterSize; i++) {
        sData[i] = (Math.random() * 2 - 1) * (1 - i / splatterSize);
      }
      const splatterNoise = ctx.createBufferSource();
      splatterNoise.buffer = splatterBuffer;
      
      const splatterFilter = ctx.createBiquadFilter();
      splatterFilter.type = "highpass";
      splatterFilter.frequency.setValueAtTime(5000, now);
      
      const splatterGain = ctx.createGain();
      splatterGain.gain.setValueAtTime(0.4, now);
      splatterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      splatterNoise.connect(splatterFilter);
      splatterFilter.connect(splatterGain);
      splatterGain.connect(compressor);
      splatterNoise.start(now);
      splatterNoise.stop(now + 0.35);

    } catch (e) {
      console.log("Audio exploded error:", e);
    }
  };

  const handleFeedClick = () => {
    if (isFeeding || isExploded) return;
    
    // The next total of feeds for this cat
    const nextFeeds = currentCatFeeds + 1;

    if (nextFeeds === 6) {
      // TRIGGER THE EXPLOSION! 💥🩸
      playExplosionSound();
      setShowRedFlash(true);
      setTimeout(() => setShowRedFlash(false), 900);
      
      setIsExploded(true);
      setIsFeeding(false);
      setIsHappy(false);
      setKibbleLevel(0);

      // Create extremely gory explosion particles with custom vector velocities
      const splatParticles: Particle[] = [];
      
      // 1. Eyeballs (exactly 2!) flying out
      for (let i = 0; i < 2; i++) {
        splatParticles.push({
          id: Date.now() + 500 + i,
          x: 42 + (Math.random() - 0.5) * 16,
          y: 40 + (Math.random() - 0.5) * 16,
          type: "eyeball",
          size: 22 + Math.random() * 4,
          delay: Math.random() * 60,
          tx: (Math.random() - 0.5) * 450,
          ty: -200 - Math.random() * 250
        } as any);
      }

      // 2. Bone fragments (18 pieces)
      for (let i = 0; i < 18; i++) {
        splatParticles.push({
          id: Date.now() + 600 + i,
          x: 45 + (Math.random() - 0.5) * 10,
          y: 40 + (Math.random() - 0.5) * 10,
          type: "bone",
          size: 5 + Math.random() * 9,
          delay: Math.random() * 90,
          tx: (Math.random() - 0.5) * 550,
          ty: (Math.random() - 0.5) * 400 - 150
        } as any);
      }

      // 3. Raw meat / viscera chunks (35 pieces)
      for (let i = 0; i < 35; i++) {
        splatParticles.push({
          id: Date.now() + 700 + i,
          x: 40 + (Math.random() - 0.5) * 20,
          y: 40 + (Math.random() - 0.5) * 20,
          type: "meat",
          size: 10 + Math.random() * 18,
          delay: Math.random() * 120,
          tx: (Math.random() - 0.5) * 600,
          ty: (Math.random() - 0.5) * 500 - 120
        } as any);
      }

      // 4. Liquid blood spray droplets (110 particles)
      for (let i = 0; i < 110; i++) {
        splatParticles.push({
          id: Date.now() + i,
          x: 35 + Math.random() * 30,
          y: 35 + Math.random() * 30,
          type: "blood",
          size: 6 + Math.random() * 28,
          delay: Math.random() * 160,
          tx: (Math.random() - 0.5) * 650,
          ty: (Math.random() - 0.5) * 550 - 100
        } as any);
      }
      
      setParticles(splatParticles);

      // Permanent heavy blood splatters all over the card background
      const splats = [];
      for (let i = 0; i < 36; i++) {
        splats.push({
          id: Date.now() + 100 + i,
          x: Math.random() * 96,
          y: Math.random() * 96,
          size: 15 + Math.random() * 65, // larger splats for more gore
          rotation: Math.random() * 360
        });
      }
      setBloodSplatters(splats);
      return;
    }

    // Normal feeding path (1 to 5 feeds)
    setIsFeeding(true);
    setIsBowlShaking(true);
    playChewSound();

    // Generate falling food kibbles into bowl
    const newKibbleParticles: Particle[] = [];
    for (let i = 0; i < 15; i++) {
      newKibbleParticles.push({
        id: Date.now() + i,
        x: 35 + Math.random() * 30, // center x positions
        y: 0,
        type: "kibble",
        size: 8 + Math.random() * 6,
        delay: i * 65
      });
    }

    // Generate rising joy hearts and stars around the cat!
    const newJoyParticles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      newJoyParticles.push({
        id: Date.now() + 100 + i,
        x: 10 + Math.random() * 80, // spread across cat box wide
        y: 20 + Math.random() * 30,
        type: Math.random() > 0.4 ? "heart" : "star",
        size: 16 + Math.random() * 12,
        delay: 500 + i * 50
      });
    }

    setParticles([...newKibbleParticles, ...newJoyParticles]);

    // Fast animation cycles
    setTimeout(() => {
      setIsHappy(true);
      setIsFeeding(false);
      setCurrentCatFeeds(nextFeeds);
      setKibbleLevel(10); // bowl refilled of love
      playMeowSound();
      setFeedCount(prev => prev + 1);

      // Progressive innocent thoughts - NO warnings! Total surprise!
      const progressThoughts = [
        "",
        "Nhom nhum nhum! Que raçãozinha deliciosa! Hmmm... 🐾✨",
        "Miau! Adoro quando você me alimenta, que gostoso! 🥰🍽️",
        "Olha como eu sei ronronar bem alto: purrrrrrrrrr! 😻🐈",
        "Miau! Que tal brincarmos de beijinho de nariz depois? 😽💕",
        "Nhac! Você é o melhor tutor que eu poderia ter! Estômago feliz! 💖✨"
      ];
      setHappyThought(progressThoughts[nextFeeds]);
    }, 1100);

    setTimeout(() => {
      setIsBowlShaking(false);
    }, 550);
  };

  const getLeftEarTransform = () => {
    if (currentCat.foldedEars) {
      return isHappy 
        ? "rotate(-85deg) translateY(16px) translateX(6px)" 
        : "rotate(-102deg) translateY(17px) translateX(10px)";
    }
    return isHappy 
      ? "rotate(-12deg)" 
      : "rotate(-32deg) translateY(4px) translateX(2px)";
  };

  const getRightEarTransform = () => {
    if (currentCat.foldedEars) {
      return isHappy 
        ? "rotate(85deg) translateY(16px) translateX(-6px)" 
        : "rotate(102deg) translateY(17px) translateX(-10px)";
    }
    return isHappy 
      ? "rotate(12deg)" 
      : "rotate(32deg) translateY(4px) translateX(-2px)";
  };

  return (
    <div id="main-panel" className="bg-pastel-grid min-h-screen flex flex-col justify-between items-center text-slate-800 p-3 sm:p-6 font-sans antialiased selection:bg-pink-200">
      
      {/* RED FLASH SCREEN EFFECT */}
      <AnimatePresence>
        {showRedFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] pointer-events-none"
            style={{ backgroundColor: "#F43F5E" }}
          />
        )}
      </AnimatePresence>
      
      {/* HEADER SECTION */}
      <header className="w-full max-w-xl mx-auto flex justify-between items-center py-2 sm:py-4 relative z-50">
        <div id="header-logo" className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-400 flex items-center justify-center border-2 border-slate-900 shadow-sm animate-pulse">
            <Heart size={13} className="text-white fill-white" />
          </div>
          <span className="font-bold text-sm sm:text-lg tracking-wider text-slate-800 flex items-center gap-1">
            GATINHO <span className="text-rose-500">FAMINTO</span> 🐾
          </span>
        </div>
        
        {/* RIGHT CONTROLLERS / COUNTERS */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* COUNTER BADGE */}
          <motion.div
            key={feedCount}
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 8, 0] }}
            transition={{ type: "tween", duration: 0.45, ease: "easeInOut" }}
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border-2 border-slate-800 bg-amber-100 text-amber-900 text-[10px] sm:text-xs font-black shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] select-none"
            title={`${feedCount} gatinho(s) alimentado(s) com amor`}
          >
            <Award size={12} className="text-amber-600 fill-amber-300 sm:size-3.5" />
            <span>{feedCount} {feedCount === 1 ? "ALIMENTADO" : "ALIMENTADOS"}</span>
          </motion.div>

          {/* MUTE CONTROLLER */}
          <button
            id="sound-toggle"
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border-2 border-slate-800 bg-white hover:bg-rose-50 active:scale-95 transition-all text-[10px] sm:text-xs font-black shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] cursor-pointer"
            title={isMuted ? "Ativar som" : "Desativar som"}
          >
            {isMuted ? (
              <>
                <VolumeX size={12} className="text-red-500 animate-pulse sm:size-3.5" />
                <span className="text-red-500 hidden sm:inline">MUDO</span>
              </>
            ) : (
              <>
                <Volume2 size={12} className="text-emerald-600 animate-bounce sm:size-3.5" />
                <span className="text-emerald-700 hidden sm:inline">SOM</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* CORE INTERACTION CARD */}
      <main className="w-full flex-grow flex items-center justify-center py-2 sm:py-4 relative z-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={catId}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            id="cat-box-card"
            className={`w-full max-w-[325px] min-[360px]:max-w-[350px] sm:max-w-sm border-3 sm:border-4 rounded-[24px] sm:rounded-[32px] p-3.5 min-[360px]:p-4 sm:p-6 flex flex-col items-center relative overflow-hidden transition-all duration-500 ${isExploded ? "bg-[#250505] border-red-800 shadow-[5px_5px_0px_0px_rgba(127,29,29,1)] sm:shadow-[8px_8px_0px_0px_rgba(127,29,29,1)]" : "bg-white border-slate-800 shadow-[5px_5px_0px_0px_rgba(30,41,59,1)] sm:shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]"}`}
          >
            {/* Top badge for cat type */}
            <div 
              id="badge-tipo" 
              className={`mb-3 sm:mb-4 border-2 rounded-full py-0.5 px-3 text-[10px] sm:text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-300 ${isExploded ? "bg-red-950 text-red-300 border-red-800" : "bg-slate-100 border-slate-800 text-slate-700"}`}
            >
              {currentCat.typeText || "Analisando..."}
            </div>

            {/* COMIC TALK BUBBLE */}
            <div 
              id="talk-bubble" 
              className={`relative w-full min-h-[64px] sm:min-h-[76px] flex items-center justify-center mb-4 sm:mb-6 px-3.5 py-2 sm:px-4 sm:py-3 border-[2.5px] sm:border-3 border-slate-800 rounded-xl sm:rounded-2xl shadow-sm text-center transition-all ${isExploded ? "bg-rose-955 text-red-105 border-red-650" : "bg-[#FCF8E3] text-slate-850"}`}
              style={isExploded ? { backgroundColor: "#450A0A", borderColor: "#EF4444" } : undefined}
            >
              {/* Dialogue Tail */}
              <div 
                className={`absolute -bottom-2.5 sm:-bottom-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 border-r-2.5 border-b-2.5 sm:border-r-3 sm:border-b-3 border-slate-800 rotate-45 transform ${isExploded ? "bg-red-950 border-red-500" : "bg-[#FCF8E3]"}`}
                style={isExploded ? { backgroundColor: "#450A0A", borderColor: "#EF4444" } : undefined}
              />
              
              <div className="text-xs sm:text-sm font-bold leading-relaxed select-none font-sans">
                {isExploded ? (
                  <span className="text-red-400 inline-flex flex-col gap-0.5 animate-pulse">
                    <span className="text-red-300 uppercase font-black tracking-widest text-[9px] sm:text-[10px]">⚠️ TRAGÉDIA EXTREMA ⚠️</span>
                    <span className="text-white text-[11px] sm:text-xs">BUUUUM! Você deu comida demais para {currentCat.name} e ele EXPLODIU! 🙀💥🩸</span>
                  </span>
                ) : isHappy ? (
                  <span className="text-slate-950 inline-flex flex-col gap-0.5 animate-bounce font-sans">
                    <span>{happyThought}</span>
                    <span className="text-rose-600 text-[11px] sm:text-xs mt-0.5 font-medium font-sans">
                      Miau! {currentCat.name} adorou! Gatinho feliz! 🥰✨
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-700">
                    <strong className="text-rose-500 font-extrabold">{currentCat.name}</strong> está com fome e triste... ração nela?
                    <span className="block italic text-slate-500 text-[11px] sm:text-xs mt-1">"{sadThought}"</span>
                  </span>
                )}
              </div>
            </div>

            {/* THE CSS CAT PORTRAIT CONTAINER */}
            <div id="canvas-gato" className="relative w-52 h-52 min-[360px]:w-56 min-[360px]:h-56 sm:w-64 sm:h-64 select-none mb-4 sm:mb-6 flex justify-center items-center">
              
              {/* SHADOW BASE */}
              {!isExploded && (
                <div className="w-44 h-3 bg-slate-800/10 rounded-full absolute bottom-4 left-1/2 -translate-x-1/2 blur-[1.5px] z-0 transition-opacity" />
              )}

              {/* Permanent blood splatters on explosion */}
              {isExploded && bloodSplatters.map(splat => (
                <div
                  key={splat.id}
                  className="absolute pointer-events-none opacity-85 select-none bg-red-800"
                  style={{
                    left: `${splat.x}%`,
                    top: `${splat.y}%`,
                    width: `${splat.size}px`,
                    height: `${splat.size}px`,
                    transform: `rotate(${splat.rotation}deg) scaleY(0.7)`,
                    boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.5)",
                    borderRadius: "45% 55% 65% 35% / 40% 50% 60% 50%",
                    zIndex: 4,
                    backgroundColor: "#991B1B"
                  }}
                />
              ))}

              {/* ANIME PARTICLE OVERLAYS WITHIN TARGET */}
              {particles.map((p) => {
                if (p.type === "kibble") {
                  return (
                    <div
                      key={p.id}
                      className="absolute z-30 pointer-events-none rounded-full bg-amber-950 border border-amber-900 shadow"
                      style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: `${p.x}%`,
                        top: `0px`,
                        opacity: 1,
                        animation: "float-kibble 1.1s cubic-bezier(0.25, 1, 0.5, 1) forwards",
                        animationDelay: `${p.delay}ms`,
                        ["--kibble-offset-x" as any]: `${(Math.random() - 0.5) * 45}px`
                      } as React.CSSProperties}
                    />
                  );
                } else if ((p.type as string) === "blood" || p.type === "meat" || p.type === "bone" || p.type === "eyeball") {
                  const anyP = p as any;
                  if (p.type === "blood") {
                    return (
                      <div
                        key={p.id}
                        className="absolute z-50 pointer-events-none select-none rounded-full"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          width: `${p.size}px`,
                          height: `${p.size}px`,
                          backgroundColor: anyP.color || "#DC2626",
                          boxShadow: "0 2px 4px rgba(185,28,28,0.4)",
                          opacity: 0,
                          animation: "explode-blood 1.6s cubic-bezier(0.1, 0.8, 0.12, 1) forwards",
                          animationDelay: `${p.delay}ms`,
                          ["--tx" as any]: `${anyP.tx || 0}px`,
                          ["--ty" as any]: `${anyP.ty || 0}px`
                        } as React.CSSProperties}
                      />
                    );
                  } else if (p.type === "meat") {
                    return (
                      <div
                        key={p.id}
                        className="absolute z-50 pointer-events-none select-none bg-[#7F1D1D] border border-red-900"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          width: `${p.size}px`,
                          height: `${p.size * 0.7}px`,
                          borderRadius: "20% 80% 40% 70% / 50% 30% 70% 60%",
                          boxShadow: "0 3px 6px rgba(0,0,0,0.5)",
                          opacity: 0,
                          animation: "explode-meat 1.8s cubic-bezier(0.08, 0.75, 0.15, 1) forwards",
                          animationDelay: `${p.delay}ms`,
                          ["--tx" as any]: `${anyP.tx || 0}px`,
                          ["--ty" as any]: `${anyP.ty || 0}px`
                        } as React.CSSProperties}
                      />
                    );
                  } else if (p.type === "bone") {
                    return (
                      <div
                        key={p.id}
                        className="absolute z-50 pointer-events-none select-none bg-stone-100 border-l-2 border-stone-300"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          width: `${p.size}px`,
                          height: `${p.size * 2.8}px`,
                          borderRadius: "2px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          opacity: 0,
                          animation: "explode-bone 1.5s cubic-bezier(0.1, 0.8, 0.1, 1) forwards",
                          animationDelay: `${p.delay}ms`,
                          ["--tx" as any]: `${anyP.tx || 0}px`,
                          ["--ty" as any]: `${anyP.ty || 0}px`
                        } as React.CSSProperties}
                      />
                    );
                  } else {
                    return (
                      <div
                        key={p.id}
                        className="absolute z-50 pointer-events-none select-none bg-stone-50 rounded-full border-2 border-slate-950 flex items-center justify-center overflow-hidden"
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          width: `${p.size}px`,
                          height: `${p.size}px`,
                          boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
                          opacity: 0,
                          animation: "explode-eyeball 2.2s cubic-bezier(0.12, 0.85, 0.15, 1) forwards",
                          animationDelay: `${p.delay}ms`,
                          ["--tx" as any]: `${anyP.tx || 0}px`,
                          ["--ty" as any]: `${anyP.ty || 0}px`
                        } as React.CSSProperties}
                      >
                        {/* Cartoon Iris and Pupil */}
                        <div className="w-1/2 h-1/2 rounded-full bg-cyan-500 border border-slate-900 flex items-center justify-center">
                          <div className="w-1/2 h-1/2 rounded-full bg-slate-950" />
                        </div>
                        <div className="absolute top-0 w-full h-[1px] bg-red-600 rotate-12 opacity-80" />
                        <div className="absolute bottom-1 w-1/2 h-[1px] bg-red-600 -rotate-45 opacity-80" />
                      </div>
                    );
                  }
                } else {
                  return (
                    <div
                      key={p.id}
                      className="absolute z-50 pointer-events-none select-none"
                      style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        opacity: 0,
                        animation: "float-heart 1.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                        animationDelay: `${p.delay}ms`
                      }}
                    >
                      {p.type === "heart" ? (
                        <Heart size={p.size} className="text-rose-400 fill-rose-400 drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)]" />
                      ) : (
                        <Star size={p.size} className="text-amber-400 fill-amber-300 drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)] animate-spin-slow" />
                      )}
                    </div>
                  );
                }
              })}

              {/* VECTOR CAT ASSEMBLY */}
              <div className="scale-[0.8] min-[360px]:scale-[0.88] sm:scale-100 transition-transform origin-center">
                <div className="relative w-56 h-56 flex items-center justify-center">
                {isExploded ? (
                  <div className="flex flex-col items-center justify-center h-full w-full relative">
                    {/* Red explosion blood puddle on the floor */}
                    <div className="absolute bottom-1 w-44 h-8 bg-red-800 border-2 border-slate-900 rounded-[50%] blur-[0.5px] z-10 flex items-center justify-center shadow-inner">
                      <span className="text-white text-[9px] font-extrabold font-mono tracking-widest animate-pulse">SANGUE E TRIPAS 🩸</span>
                    </div>

                    {/* A cute little cartoon gravestone */}
                    <div 
                      className="w-24 h-32 bg-slate-400 border-3 border-slate-800 rounded-t-[40px] shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] flex flex-col items-center justify-center p-2 text-slate-850 z-20 relative -bottom-1"
                    >
                      <span className="font-extrabold text-xs tracking-wider text-slate-900 font-mono">R.I.P.</span>
                      <span className="font-black text-[11px] text-rose-800 border-b border-dashed border-slate-550 pb-0.5 mt-0.5 uppercase max-w-full truncate">{currentCat.name}</span>
                      <span className="text-[9px] font-black text-slate-600 mt-1.5 text-center leading-tight">Explodiu de tanto comer 🥺</span>
                      <span className="text-[8px] font-mono text-slate-500 mt-1">🪦 2026</span>
                    </div>

                    {/* Sweet floating Cat Ghost! */}
                    <motion.div
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [-3, 3, -3]
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-0 flex flex-col items-center z-30 select-none pb-8"
                    >
                      {/* Angelic Halo */}
                      <div className="w-8 h-2 border-2 border-amber-300 rounded-full bg-amber-50/60 animate-pulse -mb-0.5" />
                      
                      {/* Transparent Ghost Body */}
                      <div className="w-16 h-18 bg-white/75 border-3 border-slate-750 rounded-t-[30px] rounded-b-[15px] shadow-sm relative flex flex-col items-center p-1">
                        {/* Ghost ears */}
                        <div className="w-3.5 h-3.5 bg-white/80 border-t-3 border-l-3 border-slate-755 absolute -top-2.5 left-1.5 rounded-tl-md rotate-[26deg]" />
                        <div className="w-3.5 h-3.5 bg-white/80 border-t-3 border-r-3 border-slate-755 absolute -top-2.5 right-1.5 rounded-tr-md rotate-[-26deg]" />
                        
                        {/* Ghost closed peaceful eyes */}
                        <div className="flex gap-2.5 mt-3 text-slate-550 font-black text-[10px] select-none">
                          <span>u_u</span>
                        </div>
                        {/* Ghost cute mouth */}
                        <div className="text-[8px] font-black text-slate-550 mt-0.5">miau d+... 👼</div>
                      </div>
                    </motion.div>
                    
                    {/* Smoke puffs from explosion */}
                    <div className="absolute top-1/2 left-3 text-lg animate-bounce duration-1000 opacity-60">💨</div>
                    <div className="absolute bottom-10 right-4 text-lg animate-bounce opacity-40" style={{ animationDelay: "0.5s" }}>💨</div>
                  </div>
                ) : (
                  <>
                    {/* CAUDA (Tail) */}
                    <div 
                      className={`absolute bottom-4 right-10 w-6 h-28 border-4 border-slate-800 rounded-full origin-bottom transition-all duration-500 ${isHappy ? "animate-tail-happy" : "animate-tail-sad"}`}
                      style={{
                        backgroundColor: currentCat.hasMask ? currentCat.furDark : currentCat.fur,
                        transform: isHappy ? "rotate(15deg)" : "rotate(-10deg)"
                      }}
                    >
                      {/* Tail Stripes/Patches depending on Breed */}
                      {currentCat.tabbyStripes && (
                        <>
                          <div className="w-full h-4 absolute top-6" style={{ backgroundColor: currentCat.furDark }} />
                          <div className="w-full h-4 absolute top-14" style={{ backgroundColor: currentCat.furDark }} />
                          <div className="w-full h-4 absolute top-22" style={{ backgroundColor: currentCat.furDark }} />
                        </>
                      )}
                      {currentCat.hasCalicoSpots && (
                        <>
                          <div className="w-full h-4 absolute top-8" style={{ backgroundColor: "#D97706" }} />
                          <div className="w-full h-4 absolute top-18" style={{ backgroundColor: "#475569" }} />
                        </>
                      )}
                    </div>

                    {/* CORPO Wrapper to scale with bloating! */}
                    <div 
                      className="absolute bottom-2 left-6 z-10 origin-bottom transition-all duration-300"
                      style={{ transform: `scale(${1 + currentCatFeeds * 0.13}, ${1 + currentCatFeeds * 0.08})` }}
                    >
                      {/* CORPO (Body) */}
                      <div 
                        className="w-44 h-36 border-4 border-slate-800 rounded-b-[70px] rounded-t-[40px] transition-all duration-500 animate-breath origin-bottom overflow-hidden relative"
                        style={{ backgroundColor: currentCat.fur }}
                      >
                        {/* Tuxedo V white bib on chest */}
                        {currentCat.hasTuxedoV && (
                          <div className="w-24 h-32 bg-white border-4 border-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-[50%_50%_10px_10px]" />
                        )}

                        {/* Calico Spots on Body */}
                        {currentCat.hasCalicoSpots && (
                          <>
                            <div className="w-16 h-16 rounded-full absolute -top-2 left-1 z-5" style={{ backgroundColor: "#D97706" }} />
                            <div className="w-12 h-12 rounded-full absolute bottom-4 -right-1 z-5" style={{ backgroundColor: "#475569" }} />
                            <div className="w-10 h-10 rounded-full absolute top-14 right-2 z-5" style={{ backgroundColor: "#D97706" }} />
                          </>
                        )}

                        {/* Left Paw */}
                        <div 
                          className="w-10 h-10 border-4 border-slate-800 rounded-full absolute -bottom-2.5 left-6 z-20 transition-transform duration-300 pointer-events-none"
                          style={{ 
                            backgroundColor: currentCat.hasTuxedoV ? "#FFFFFF" : (currentCat.hasMask ? currentCat.furDark : currentCat.fur),
                            transform: isFeeding ? "translateY(-6px) scale(1.05)" : "none"
                          }}
                        />
                        {/* Right Paw */}
                        <div 
                          className="w-10 h-10 border-4 border-slate-800 rounded-full absolute -bottom-2.5 right-6 z-20 transition-transform duration-300 pointer-events-none"
                          style={{ 
                            backgroundColor: currentCat.hasTuxedoV ? "#FFFFFF" : (currentCat.hasMask ? currentCat.furDark : currentCat.fur),
                            transform: isFeeding ? "translateY(-10px) scale(1.05)" : "none"
                          }}
                        />
                      </div>
                    </div>

                    {/* CABEÇA Wrapper to scale with bloating! */}
                    <div 
                      className="absolute top-6 left-2 z-20 origin-center transition-all duration-300"
                      style={{ transform: `scale(${1 + currentCatFeeds * 0.06})` }}
                    >
                      {/* CABEÇA (Head) */}
                      <div 
                        className="w-52 h-40 border-4 border-slate-800 rounded-[80px_80px_70px_70px] transition-all duration-500 animate-breath-head relative"
                        style={{ backgroundColor: currentCat.fur }}
                      >
                        {/* Persian Fluffy Cheeks */}
                        {currentCat.isFluffy && (
                          <>
                            <div className="w-11 h-11 border-4 border-slate-800 rounded-full absolute top-20 -left-5 z-10" style={{ backgroundColor: currentCat.fur }} />
                            <div className="w-11 h-11 border-4 border-slate-800 rounded-full absolute top-20 -right-5 z-10" style={{ backgroundColor: currentCat.fur }} />
                            {/* Neck Fluff Collar */}
                            <div className="w-16 h-8 border-4 border-slate-800 rounded-full absolute bottom-[-18px] left-1/2 -translate-x-1/2 z-10 bg-white" />
                          </>
                        )}

                        {/* ORELHA ESQUERDA (Left Ear) */}
                        <div 
                          className="w-14 h-16 border-4 border-slate-800 rounded-tl-[40px] rounded-br-[10px] rounded-tr-[10px] absolute -top-9 left-4 z-10 origin-bottom-right transition-all duration-500"
                          style={{
                            backgroundColor: currentCat.hasMask ? currentCat.furDark : currentCat.fur,
                            transform: getLeftEarTransform()
                          }}
                        >
                          {/* Inner ear */}
                          <div 
                            className="w-8 h-10 rounded-tl-[25px] rounded-br-[5px] rounded-tr-[5px] absolute top-2 left-2"
                            style={{ backgroundColor: currentCat.earInner }}
                          />
                        </div>

                        {/* ORELHA DIREITA (Right Ear) */}
                        <div 
                          className="w-14 h-16 border-4 border-slate-800 rounded-tr-[40px] rounded-bl-[10px] rounded-tl-[10px] absolute -top-9 right-4 z-10 origin-bottom-left transition-all duration-500"
                          style={{
                            backgroundColor: currentCat.hasMask ? currentCat.furDark : currentCat.fur,
                            transform: getRightEarTransform()
                          }}
                        >
                          {/* Inner ear */}
                          <div 
                            className="w-8 h-10 rounded-tr-[25px] rounded-bl-[5px] rounded-tl-[5px] absolute top-2 right-2"
                            style={{ backgroundColor: currentCat.earInner }}
                          />
                        </div>

                        {/* Calico Spots on Face */}
                        {currentCat.hasCalicoSpots && (
                          <>
                            <div className="w-16 h-16 rounded-full absolute -top-1 -left-2 opacity-95 z-5" style={{ backgroundColor: "#D97706" }} />
                            <div className="w-14 h-14 rounded-full absolute -top-2 -right-3 opacity-95 z-5" style={{ backgroundColor: "#475569" }} />
                            <div className="w-12 h-12 rounded-full absolute bottom-2 -right-2 opacity-95 z-5" style={{ backgroundColor: "#D97706" }} />
                          </>
                        )}

                        {/* Siamese dark face mask */}
                        {currentCat.hasMask && (
                          <div 
                            className="w-32 h-24 border-4 border-slate-800 rounded-full absolute top-12 left-1/2 -translate-x-1/2 z-25 opacity-95 shadow-inner"
                            style={{ backgroundColor: currentCat.furDark }}
                          />
                        )}

                        {/* Tuxedo white muzzle inverted-V */}
                        {currentCat.hasTuxedoV && (
                          <div className="w-24 h-16 bg-white border-3 border-slate-800 border-t-0 rounded-b-[42px] absolute bottom-0 left-1/2 -translate-x-1/2 z-25 flex items-end justify-center" />
                        )}

                        {/* FOREHEAD STRIPES */}
                        <div className="flex gap-1.5 absolute top-2.5 left-1/2 -translate-x-1/2 z-10">
                          {currentCat.tabbyStripes ? (
                            <div className="flex items-end gap-1">
                              <div className="w-1.5 h-4.5 rounded-full rotate-12" style={{ backgroundColor: currentCat.furDark }} />
                              <div className="w-1.5 h-6.5 rounded-sm -rotate-12 -translate-y-0.5" style={{ backgroundColor: currentCat.furDark }} />
                              <div className="w-1.5 h-6.5 rounded-sm rotate-12 -translate-y-0.5" style={{ backgroundColor: currentCat.furDark }} />
                              <div className="w-1.5 h-4.5 rounded-full -rotate-12" style={{ backgroundColor: currentCat.furDark }} />
                            </div>
                          ) : (
                            !currentCat.hasMask && !currentCat.hasTuxedoV && !currentCat.hasCalicoSpots && (
                              <>
                                <div className="w-1.5 h-4.5 rounded-full" style={{ backgroundColor: currentCat.furDark }} />
                                <div className="w-2 h-5.5 rounded-full" style={{ backgroundColor: currentCat.furDark }} />
                                <div className="w-1.5 h-4.5 rounded-full" style={{ backgroundColor: currentCat.furDark }} />
                              </>
                            )
                          )}
                        </div>

                        {/* CHEEK STRIPES */}
                        {/* Left cheek pattern */}
                        <div className="w-3.5 h-1.5 rounded-full absolute top-22 left-1.5" style={{ backgroundColor: currentCat.furDark }} />
                        <div className="w-2.5 h-1.5 rounded-full absolute top-26 left-1" style={{ backgroundColor: currentCat.furDark }} />
                        {/* Right cheek pattern */}
                        <div className="w-3.5 h-1.5 rounded-full absolute top-22 right-1.5" style={{ backgroundColor: currentCat.furDark }} />
                        <div className="w-2.5 h-1.5 rounded-full absolute top-26 right-1" style={{ backgroundColor: currentCat.furDark }} />

                        {/* WHISKERS (Bigodes) */}
                        {/* Left whiskers */}
                        <div className="absolute top-22 -left-6 z-10 flex flex-col gap-2">
                          <div className="w-7 h-0.5 bg-slate-800 rounded-full rotate-6 origin-right" />
                          <div className="w-8 h-0.5 bg-slate-800 rounded-full origin-right" />
                          <div className="w-7 h-0.5 bg-slate-800 rounded-full -rotate-6 origin-right" />
                        </div>
                        {/* Right whiskers */}
                        <div className="absolute top-22 -right-6 z-10 flex flex-col gap-2">
                          <div className="w-7 h-0.5 bg-slate-800 rounded-full -rotate-6 origin-left" />
                          <div className="w-8 h-0.5 bg-slate-800 rounded-full origin-left" />
                          <div className="w-7 h-0.5 bg-slate-800 rounded-full rotate-6 origin-left" />
                        </div>

                        {/* EYES */}
                        <div className="flex justify-between items-center px-10 absolute top-18 left-0 w-full z-30 animate-pulse-slow">
                          {/* Left Eye */}
                          <div className="relative w-8 h-8 flex items-center justify-center">
                            {isHappy ? (
                              // Happy curved happy eye "^"
                              <div className="w-8 h-5 border-b-4 border-slate-800 rounded-full relative bottom-0.5" />
                            ) : (
                              // Sad crying eye with custom color if applicable
                              <div 
                                className="w-7 h-7 rounded-full relative flex justify-start items-start shadow-sm border border-slate-900 overflow-hidden"
                                style={{ backgroundColor: currentCat.eyeColor || "#1e293b" }}
                              >
                                {/* Inner pupil/glow if light colored eyes */}
                                {currentCat.eyeColor && (
                                  <div className="w-4 h-4 bg-slate-900 rounded-full absolute top-1.5 left-1.5" />
                                )}
                                {/* Shine spots */}
                                <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1 z-10" />
                                <div className="w-1 h-1 bg-white rounded-full absolute bottom-1.5 left-1.5 z-10" />
                                {/* Weeping animated tear */}
                                <div className="w-3.5 h-3.5 bg-sky-300 rounded-full rounded-tr-none rotate-45 absolute -bottom-2 -left-1 animate-tear-fall" />
                              </div>
                            )}
                            {/* Eyebrow */}
                            <div 
                              className="w-5 h-1.5 bg-slate-800 rounded-full absolute -top-4.5 left-1 transition-all duration-500"
                              style={{ transform: isHappy ? "translateY(2px)" : "rotate(-15deg)" }}
                            />
                          </div>

                          {/* Right Eye */}
                          <div className="relative w-8 h-8 flex items-center justify-center">
                            {isHappy ? (
                              // Happy curved happy eye "^"
                              <div className="w-8 h-5 border-b-4 border-slate-800 rounded-full relative bottom-0.5" />
                            ) : (
                              // Sad crying eye with custom color
                              <div 
                                className="w-7 h-7 rounded-full relative flex justify-start items-start shadow-sm border border-slate-900 overflow-hidden"
                                style={{ backgroundColor: currentCat.eyeColor || "#1e293b" }}
                              >
                                {/* Inner pupil/glow if light colored eyes */}
                                {currentCat.eyeColor && (
                                  <div className="w-4 h-4 bg-slate-900 rounded-full absolute top-1.5 left-1.5" />
                                )}
                                {/* Shine spots */}
                                <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1 z-10" />
                                <div className="w-1 h-1 bg-white rounded-full absolute bottom-1.5 right-1.5 z-10" />
                                {/* Weeping animated tear */}
                                <div className="w-3.5 h-3.5 bg-sky-300 rounded-full rounded-tl-none -rotate-45 absolute -bottom-2 -right-1 animate-tear-fall" style={{ animationDelay: "0.6s" }} />
                              </div>
                            )}
                            {/* Eyebrow */}
                            <div 
                              className="w-5 h-1.5 bg-slate-800 rounded-full absolute -top-4.5 right-1 transition-all duration-500"
                              style={{ transform: isHappy ? "translateY(2px)" : "rotate(15deg)" }}
                            />
                          </div>
                        </div>

                        {/* ROSY BLUSH CHEEKS (Visible on happiness) */}
                        <div 
                          className="w-6 h-3 bg-pink-400/40 blur-[0.5px] rounded-full absolute top-24 left-8 transition-opacity duration-500 z-30"
                          style={{ opacity: isHappy ? 0.95 : 0.05 }}
                        />
                        <div 
                          className="w-6 h-3 bg-pink-400/40 blur-[0.5px] rounded-full absolute top-24 right-8 transition-opacity duration-500 z-30"
                          style={{ opacity: isHappy ? 0.95 : 0.05 }}
                        />

                        {/* NOSE AND MOUTH */}
                        <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                          {/* Pink heart nose */}
                          <div className="w-3.5 h-2 bg-pink-400 rounded-b-full shadow-sm" />
                          
                          {/* Dynamic Mouth */}
                          <div className="relative w-12 h-6 flex justify-center -top-0.5">
                            {isHappy ? (
                              isFeeding ? (
                                // Chewing circle animation
                                <div className="w-3.5 h-3.5 bg-red-400 border-3 border-slate-800 rounded-full animate-chewing" />
                              ) : (
                                // Wide tongue smile!
                                <div className="w-7 h-5 bg-rose-500 border-3 border-slate-800 rounded-b-2xl overflow-hidden flex justify-center items-end">
                                  <div className="w-4.5 h-2.5 bg-pink-300 rounded-t-full translate-y-0.5 shadow-inner" />
                                </div>
                              )
                            ) : (
                              // Sad puppy downward curve
                              <div className="relative top-0.5">
                                <div className="w-5 h-3.5 border-t-3 border-slate-800 rounded-t-full" />
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  </>
                )}
                </div>
              </div>
            </div>

            {/* FOOD BOWL (POTE DE RAÇÃO) & CAT SWITCHER */}
            <div id="pote-decor" className="relative w-full flex items-end justify-center gap-2 sm:gap-3 mt-1 pb-1">
              {/* Invisible spacer/placeholder on the left on screens to perfectly balance the button on the right */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 hidden sm:block pointer-events-none" />

              <div 
                id="feed-bowl-click"
                onClick={handleFeedClick}
                className={`group relative flex flex-col items-center select-none transition-transform ${isExploded ? "cursor-not-allowed opacity-40 scale-90" : isFeeding ? "cursor-wait scale-95" : "cursor-pointer hover:scale-105 active:scale-95"}`}
              >
                {/* Guide badge above the bowl */}
                <span className={`text-[8px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full border-2 border-slate-800 bg-white shadow-sm mb-1.5 sm:mb-2 transition-transform duration-300 ${isHappy ? "text-slate-500 scale-95 opacity-65" : "text-amber-600 animate-pulse group-hover:bg-amber-50"}`}>
                  {isExploded ? "Gatinho Explodiu... 🥀" : isHappy ? "Alimentado! ❤️" : "Clique para Alimentar! 🐾"}
                </span>

                {/* THE FOOD BOWL SHAPE - Pure CSS Vector */}
                <div 
                  className={`w-28 h-10 sm:w-36 sm:h-12 bg-rose-400 border-3 sm:border-4 border-slate-800 rounded-b-xl sm:rounded-b-2xl rounded-t-sm relative shadow-md transition-all ${isBowlShaking ? "bowl-shake bg-orange-300" : ""}`}
                >
                  {/* Bowl inner gloss */}
                  <div className="absolute top-0.5 left-1.5 w-24 sm:w-28 h-1.5 sm:h-2 bg-white/20 rounded-full" />
                  
                  {/* Bowl cute branding logo (paw print/heart badge) */}
                  <div className="absolute inset-x-0 bottom-0.5 sm:bottom-1 flex justify-center items-center text-slate-800 opacity-70 z-10 select-none">
                    <Heart size={10} className="fill-slate-800 sm:size-3.5" />
                  </div>

                  {/* FOOD KIBBLE PIECES Inside empty space */}
                  {kibbleLevel > 0 && (
                    <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translateX-1/2 -translate-x-1/2 w-[86px] sm:w-[112px] h-3 sm:h-3.5 bg-amber-800 border-2 sm:border-3 border-slate-800 rounded-full flex flex-wrap gap-[2px] sm:gap-0.5 px-1 py-0.5 overflow-hidden content-center justify-center">
                      {Array.from({ length: kibbleLevel }).map((_, idx) => (
                        <div 
                          key={idx} 
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-950 border border-amber-900 rounded-full shadow-inner shadow-black/30"
                          style={{
                            transform: `translateY(${Math.sin(idx * 1.5) * 1}px) rotate(${idx * 30}deg)`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CAT SWITCH BUTTON NEXT TO IT */}
              <button
                id="btn-switch-cat"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isFeeding) {
                    generateNewCat();
                  }
                }}
                disabled={isFeeding}
                className={`flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-3 sm:border-4 border-slate-800 bg-sky-100 hover:bg-sky-200 text-slate-800 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] sm:shadow-[3px_3px_0px_0px_rgba(30,41,59,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_0px_rgba(30,41,59,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer ${isFeeding ? "opacity-35 cursor-not-allowed" : ""}`}
                title="Trocar de gatinho"
                style={{ marginBottom: "2px" }}
              >
                <RefreshCw size={13} className={`text-slate-800 font-extrabold sm:size-4 ${isFeeding ? "" : "hover:rotate-180 transition-transform duration-500"}`} />
                <span className="text-[6.5px] sm:text-[7.5px] font-black uppercase tracking-wider mt-0.5">OUTRO</span>
              </button>
            </div>

            {/* COMEMORATION RESET ACTIONS */}
            <AnimatePresence>
              {(isHappy || isExploded) && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="w-full text-center flex flex-col items-center gap-3 z-50 overflow-hidden"
                >
                  {isExploded ? (
                    <>
                      <p className="text-xs font-bold text-red-500 bg-red-950/20 border border-red-300 py-1.5 px-3.5 rounded-full flex items-center gap-1.5 animate-pulse">
                        💀 RIP {currentCat.name} - 1 like = 1 oração
                      </p>
                      
                      <button
                        id="btn-clean-mess"
                        onClick={generateNewCat}
                        className="w-full flex items-center justify-center gap-2 bg-red-650 hover:bg-red-550 text-white font-black px-6 py-3 border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_rgba(30,41,59,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                      >
                        <RefreshCw size={15} className="animate-spin text-white" />
                        <span>LIMPAR A BAGUNÇA E ADOTAR OUTRO 🧹🐾</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-200 py-1 px-3 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-rose-500 fill-white" />
                        Você salvou o dia do gatinho!
                      </p>
                      
                      <button
                        id="btn-feed-another"
                        onClick={generateNewCat}
                        className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-800 font-extrabold px-6 py-3 border-4 border-slate-800 rounded-2xl shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_rgba(30,41,59,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                      >
                        <RefreshCw size={15} className="animate-spin-slow text-slate-900" />
                        <span>ALIMENTAR OUTRO GATINHO 🐾</span>
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER TIPS PANEL */}
      <footer className="w-full max-w-xl mx-auto text-center mt-4">
        <div id="tip-card" className="inline-flex items-center gap-1.5 bg-sky-50 border-2 border-slate-800 py-2 px-4 rounded-full text-xs font-bold text-sky-700 shadow-[3px_3px_0px_0px_rgba(30,41,59,1)]">
          <Award size={13} className="text-sky-600 fill-white" />
          <span>Dica Kawaii: Toda vez que você reinicia, um gatinho diferente aparece!</span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-4">
          Feito com ❤️ no estilo Japonês Kawaii
        </p>
      </footer>

    </div>
  );
}
