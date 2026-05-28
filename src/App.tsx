import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Volume2, VolumeX, RefreshCw, Star, ArrowRight, CheckCircle2, Award } from "lucide-react";

// Types for particles
interface Particle {
  id: number;
  x: number; // Percentual da largura em relação ao container
  y: number; // Força inicial ou offset
  type: "heart" | "star" | "kibble";
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
  const [isHappy, setIsHappy] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [isBowlShaking, setIsBowlShaking] = useState(false);
  const [sadThought, setSadThought] = useState("");
  const [happyThought, setHappyThought] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  
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

  const handleFeedClick = () => {
    if (isFeeding || isHappy) return;
    
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
      setKibbleLevel(10); // bowl refilled of love
      playMeowSound();
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
    <div id="main-panel" className="bg-pastel-grid min-h-screen flex flex-col justify-between items-center text-slate-800 p-4 font-sans antialiased selection:bg-pink-200">
      
      {/* HEADER SECTION */}
      <header className="w-full max-w-xl mx-auto flex justify-between items-center py-4 relative z-50">
        <div id="header-logo" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-400 flex items-center justify-center border-2 border-slate-900 shadow-sm animate-pulse">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-800 flex items-center gap-1">
            GATINHO <span className="text-rose-500">FAMINTO</span> 🐾
          </span>
        </div>
        
        {/* MUTE CONTROLLER */}
        <button
          id="sound-toggle"
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-slate-800 bg-white hover:bg-rose-50 active:scale-95 transition-all text-xs font-bold shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]"
          title={isMuted ? "Ativar som" : "Desativar som"}
        >
          {isMuted ? (
            <>
              <VolumeX size={14} className="text-red-500 animate-pulse" />
              <span className="text-red-500">MUDO</span>
            </>
          ) : (
            <>
              <Volume2 size={14} className="text-emerald-600 animate-bounce" />
              <span className="text-emerald-700">SOM</span>
            </>
          )}
        </button>
      </header>

      {/* CORE INTERACTION CARD */}
      <main className="w-full flex-grow flex items-center justify-center py-4 relative z-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={catId}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            id="cat-box-card"
            className="w-full max-w-sm bg-white border-4 border-slate-800 rounded-[32px] p-6 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] flex flex-col items-center relative overflow-hidden"
          >
            {/* Top badge for cat type */}
            <div id="badge-tipo" className="mb-4 bg-slate-100 border-2 border-slate-800 rounded-full py-0.5 px-3.5 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-sm">
              {currentCat.typeText || "Analisando..."}
            </div>

            {/* COMIC TALK BUBBLE */}
            <div id="talk-bubble" className="relative w-full min-h-[76px] flex items-center justify-center mb-6 px-4 py-3 bg-[#FCF8E3] border-3 border-slate-800 rounded-2xl shadow-sm text-center">
              {/* Dialogue Tail */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FCF8E3] border-r-3 border-b-3 border-slate-800 rotate-45 transform" />
              
              <p className="text-sm font-bold leading-relaxed text-slate-700 select-none">
                {isHappy ? (
                  <span className="text-slate-900 inline-flex flex-col gap-0.5 animate-bounce">
                    <span>{happyThought}</span>
                    <span className="text-rose-500 text-xs mt-0.5">Miau! Obrigado! Você salvou o dia de {currentCat.name}! 🐾❤️</span>
                  </span>
                ) : (
                  <span>
                    <strong className="text-rose-500 font-extrabold">{currentCat.name}</strong> está com muita fome e tristinho... que tal dar um pouco de ração?
                    <span className="block italic text-slate-500 text-xs mt-1.5">"{sadThought}"</span>
                  </span>
                )}
              </p>
            </div>

            {/* THE CSS CAT PORTRAIT CONTAINER */}
            <div id="canvas-gato" className="relative w-64 h-64 select-none mb-6 flex justify-center items-center">
              
              {/* SHADOW BASE */}
              <div className="w-44 h-3 bg-slate-800/10 rounded-full absolute bottom-4 left-1/2 -translate-x-1/2 blur-[1.5px] z-0 transition-opacity" />

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
              <div className="relative w-56 h-56 flex items-center justify-center">

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

                {/* CORPO (Body) */}
                <div 
                  className="w-44 h-36 border-4 border-slate-800 rounded-b-[70px] rounded-t-[40px] absolute bottom-2 left-6 z-10 transition-all duration-500 animate-breath origin-bottom overflow-hidden"
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

                {/* CABEÇA (Head) */}
                <div 
                  className="w-52 h-40 border-4 border-slate-800 rounded-[80px_80px_70px_70px] absolute top-6 left-2 z-20 transition-all duration-500 animate-breath-head"
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
                          <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-1 z-10" />
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
            </div>

            {/* FOOD BOWL (POTE DE RAÇÃO) */}
            <div id="pote-decor" className="relative w-full flex flex-col items-center">
              <div 
                id="feed-bowl-click"
                onClick={handleFeedClick}
                className={`group relative flex flex-col items-center cursor-pointer select-none transition-transform ${isHappy ? "cursor-default scale-100" : "hover:scale-105 active:scale-95"}`}
              >
                {/* Guide badge above the bowl */}
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border-2 border-slate-800 bg-white shadow-sm mb-2 transition-transform duration-300 ${isHappy ? "text-slate-500 scale-95 opacity-65" : "text-amber-600 animate-pulse group-hover:bg-amber-50"}`}>
                  {isHappy ? "Alimentado! ❤️" : "Clique para Alimentar! 🐾"}
                </span>

                {/* THE FOOD BOWL SHAPE - Pure CSS Vector */}
                <div 
                  className={`w-36 h-12 bg-rose-400 border-4 border-slate-800 rounded-b-2xl rounded-t-sm relative shadow-md transition-all ${isBowlShaking ? "bowl-shake bg-orange-300" : ""}`}
                >
                  {/* Bowl inner gloss */}
                  <div className="absolute top-1 left-2.5 w-28 h-2 bg-white/20 rounded-full" />
                  
                  {/* Bowl cute branding logo (paw print/heart badge) */}
                  <div className="absolute inset-x-0 bottom-1 flex justify-center items-center text-slate-800 opacity-70 z-10 select-none">
                    <Heart size={14} className="fill-slate-800" />
                  </div>

                  {/* FOOD KIBBLE PIECES Inside empty space */}
                  {kibbleLevel > 0 && (
                    <div className="absolute -top-3 left-1/2 -translateX-1/2 -translate-x-1/2 w-[112px] h-3.5 bg-amber-800 border-3 border-slate-800 rounded-full flex flex-wrap gap-0.5 px-1 py-0.5 overflow-hidden content-center justify-center">
                      {Array.from({ length: kibbleLevel }).map((_, idx) => (
                        <div 
                          key={idx} 
                          className="w-2 h-2 bg-amber-950 border border-amber-900 rounded-full shadow-inner shadow-black/30"
                          style={{
                            transform: `translateY(${Math.sin(idx * 1.5) * 1.5}px) rotate(${idx * 30}deg)`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COMEMORATION RESET ACTIONS */}
            <AnimatePresence>
              {isHappy && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="w-full text-center flex flex-col items-center gap-3 z-50 overflow-hidden"
                >
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
