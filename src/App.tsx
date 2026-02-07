import React, { useState, useEffect } from "react";
import { Heart, Frown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

// 👇 YOUR PHOTOS (I added the missing '/' to some to ensure they load)
const IMAGES = [
  "IMG_9480.JPG", 
  "IMG_9426.jpeg",
  "IMG_2493.jpg",
  "IMG_7062.jpeg",
  "IMG_0955.JPG",
  "IMG_5405.JPG",
  "IMG_5224.jpeg",
  "MASK.JPG",
  "IMG_4831.jpeg",
  "IMG_0937.JPG",
  "IMG_2226.jpeg",
  "IMG_0867.jpeg",
  "IMG_0587.jpeg",
  "IMG_2494.jpg",
  "IMG_2334.JPG",
  "IMG_0526.jpeg",
  "IMG_0039.jpeg",
  "pic.PNG",
  "love.JPG",
];

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stage, setStage] = useState<"ask" | "maybe" | "yes">("ask");
  const [showSecret, setShowSecret] = useState(false);
  const [noBtnPosition, setNoBtnPosition] = useState({ top: "auto", left: "auto" });
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Slideshow Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // "No" Button Runaway Logic
  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 150);
    const y = Math.random() * (window.innerHeight - 100);
    setNoBtnPosition({ top: `${y}px`, left: `${x}px` });
  };

  const handleYes = () => {
    setStage("yes");
    fireConfetti();
  };

  const fireConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stage === "yes") return;
    const id = Date.now();
    setFloatingHearts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setFloatingHearts((prev) => prev.filter((h) => h.id !== id)), 4000);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center font-sans text-gray-800" onClick={handleScreenClick}>
      
      {/* BACKGROUND SLIDESHOW LAYER */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, backgroundColor: 'black' }}>
        {IMAGES.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              filter: 'brightness(0.6)'
            }}
          />
        ))}
      </div>

      {/* FLOATING HEARTS LAYER */}
      {floatingHearts.map((heart) => (
        <div key={heart.id} className="fixed pointer-events-none text-3xl animate-float z-50" style={{ left: heart.x, top: heart.y }}>
          ❤️
        </div>
      ))}

      {/* MAIN CARD CONTENT */}
      <div className="relative z-10 p-4">
        {stage !== "yes" ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg p-10 text-center rounded-[30px] border-2 border-pink-200 shadow-2xl"
            style={{ backgroundColor: '#ffe4e6' }} 
          >
            <div className="mb-8">
              <h1 className="font-handwriting text-6xl text-pink-600 mb-2 drop-shadow-sm">Hello My Love :) !</h1>
              <div className="flex justify-center gap-2 text-2xl">
                <span className="animate-pulse">💕</span>
                <span className="animate-pulse delay-75">💖</span>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-4 font-medium">
              I really wanted to do something special for you this Valentine's Day, so I made this little website just for you! Putting my degree to use lmao
            </p>
            <p className="font-handwriting text-4xl text-pink-500 mb-8 font-bold">
              Will you be my Valentine? 🌹 Try click all the buttons ;)
            </p>

            <div className="flex flex-col items-center gap-6 relative min-h-[120px]">
              {/* YES BUTTON */}
              <button
                onClick={handleYes}
                className="group relative flex items-center gap-2 hover:scale-105 transition-transform"
                style={{ 
                  backgroundColor: 'black', 
                  color: 'white',
                  padding: '16px 40px', 
                  borderRadius: '50px',
                  fontWeight: 'bold', 
                  fontSize: '20px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>Yes, Always! 💖</span>
                <Heart className="w-6 h-6 group-hover:fill-white transition-colors" />
              </button>

              <div className="flex gap-4 w-full justify-center items-center">
                {/* MAYBE BUTTON */}
                <button
                  onClick={() => setStage("maybe")}
                  className="hover:scale-105 transition-transform"
                  style={{ 
                    backgroundColor: 'black', 
                    color: 'white',
                    padding: '12px 24px', 
                    borderRadius: '50px',
                    fontWeight: '600',
                    fontSize: '18px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Maybe... 🤔
                </button>

                {/* NO BUTTON */}
                <motion.button
                  onMouseEnter={moveNoButton}
                  onClick={moveNoButton}
                  className="whitespace-nowrap"
                  style={{
                    // Movement Logic
                    position: noBtnPosition.top === "auto" ? "relative" : "fixed",
                    top: noBtnPosition.top,
                    left: noBtnPosition.left,
                    zIndex: 50,
                    // Black Style Logic
                    backgroundColor: 'black', 
                    color: 'white',
                    padding: '12px 24px', 
                    borderRadius: '50px',
                    fontWeight: '600',
                    fontSize: '18px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  animate={{ x: [0, -5, 5, -5, 5, 0] }}
                >
                  No 💔
                </motion.button>
              </div>
            </div>

            {stage === "maybe" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-300 text-yellow-800"
              >
                <p className="font-bold text-lg flex items-center justify-center gap-2">
                  Seriously? <Frown />
                </p>
                <p className="text-sm mt-1">Think about it again...fool</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl p-12 text-center rounded-[40px] border-4 border-pink-200 shadow-2xl"
            style={{ backgroundColor: '#ffe4e6' }}
          >
            <h1 className="font-handwriting text-7xl text-pink-600 mb-6">Yaaaaaayyy!💕</h1>
            <p className="text-3xl text-pink-500 mb-6">You said YES!</p>
            <div className="text-8xl my-6 animate-bounce">💑</div>
            <p className="font-handwriting text-3xl text-pink-500 mt-8 mb-8">
              I love you always
            </p>

            {/* SECRET BUTTON */}
            {!showSecret ? (
              <button 
                onClick={() => setShowSecret(true)}
                className="hover:scale-105 flex items-center gap-2 mx-auto animate-pulse"
                style={{ 
                  marginTop: '16px',
                  backgroundColor: 'black', 
                  color: 'white',
                  padding: '10px 20px', 
                  borderRadius: '50px',
                  fontWeight: 'bold', 
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Sparkles className="w-4 h-4" /> Click for more
              </button>
            ) : (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-6 bg-red-100 rounded-xl border-2 border-red-300"
              >
                <p className="text-xl font-bold text-red-800 font-handwriting">
                   we're fucking tonight for sure💋
                </p>
              </motion.div>
            )}
            
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default App;