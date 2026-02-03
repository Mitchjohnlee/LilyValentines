import { useState, useEffect, useRef } from "react";
import lovesvg from "./assets/All You Need Is Love SVG Cut File.svg";
import lovesvg2 from "./assets/Love In The Air SVG Cut File.svg";

export default function Page() {
  const [yesPressed, setYesPressed] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesButtonPosition, setYesButtonPosition] = useState({ x: 0, y: 0 });
  const [showGreeting, setShowGreeting] = useState(true);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const noButtonRef = useRef(null);
  const yesButtonRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Initialize button positions
    if (!isInitialized.current) {
      setNoButtonPosition({
        x: window.innerWidth / 2 + 100,
        y: window.innerHeight / 2 + 50,
      });
      setYesButtonPosition({
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 + 50,
      });
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    // Show "Hi Ashley" for 5 seconds, then fade to "Will You be my Valentine?"
    const timer = setTimeout(() => {
      // Fade out greeting
      setTitleOpacity(0);
      setTimeout(() => {
        setShowGreeting(false);
        // Fade in question
        setTimeout(() => {
          setTitleOpacity(1);
        }, 50);
      }, 500); // Wait for fade out to complete
    }, 5000); // Show greeting for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (yesPressed) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let mouseVelocityX = 0;
    let mouseVelocityY = 0;

    const handleMouseMove = (e) => {
      // Track mouse velocity for predictive movement
      mouseVelocityX = e.clientX - lastMouseX;
      mouseVelocityY = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const moveButtonAway = (buttonRef, setPosition, currentPosition) => {
      if (!buttonRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      // Get button center position
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;
      
      // Predict where mouse might be going (add velocity prediction)
      const predictedMouseX = mouseX + mouseVelocityX * 2;
      const predictedMouseY = mouseY + mouseVelocityY * 2;
      
      // Calculate distance from predicted mouse to button center
      const dx = buttonCenterX - predictedMouseX;
      const dy = buttonCenterY - predictedMouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Increased detection radius and much faster movement
      const detectionRadius = 200;
      if (distance < detectionRadius) {
        // Calculate angle from mouse to button
        const angle = Math.atan2(dy, dx);
        // Much more aggressive movement - moves much further and faster
        const moveDistance = (detectionRadius - distance) * 2.5 + 30;
        
        // Calculate new position (move in the direction away from cursor)
        let newX = buttonCenterX + Math.cos(angle) * moveDistance;
        let newY = buttonCenterY + Math.sin(angle) * moveDistance;
        
        // Keep button within viewport bounds
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;
        const padding = 10;
        newX = Math.max(padding + buttonWidth / 2, Math.min(newX, window.innerWidth - buttonWidth / 2 - padding));
        newY = Math.max(padding + buttonHeight / 2, Math.min(newY, window.innerHeight - buttonHeight / 2 - padding));
        
        setPosition({ x: newX, y: newY });
      }
    };

    const moveButtonTowards = (buttonRef, setPosition) => {
      if (!buttonRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      // Get button center position
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;
      
      // Calculate direction from button to cursor
      const dx = mouseX - buttonCenterX;
      const dy = mouseY - buttonCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If cursor is far enough away, move button towards it
      if (distance > 5) {
        // Calculate angle from button to cursor
        const angle = Math.atan2(dy, dx);
        // Move towards cursor with smooth following speed
        const moveSpeed = Math.min(distance * 0.15, 20); // Smooth following, max speed
        
        // Calculate new position (move towards cursor)
        let newX = buttonCenterX + Math.cos(angle) * moveSpeed;
        let newY = buttonCenterY + Math.sin(angle) * moveSpeed;
        
        // Keep button within viewport bounds
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;
        const padding = 10;
        newX = Math.max(padding + buttonWidth / 2, Math.min(newX, window.innerWidth - buttonWidth / 2 - padding));
        newY = Math.max(padding + buttonHeight / 2, Math.min(newY, window.innerHeight - buttonHeight / 2 - padding));
        
        setPosition({ x: newX, y: newY });
      }
    };

    // Use requestAnimationFrame for smooth, fast updates
    let animationFrameId;
    const animate = () => {
      moveButtonAway(noButtonRef, setNoButtonPosition, noButtonPosition);
      moveButtonTowards(yesButtonRef, setYesButtonPosition);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [yesPressed]);

  return (
    <div className="overflow-hidden flex flex-col items-center justify-center pt-4 h-screen -mt-16 selection:bg-rose-600 selection:text-white text-zinc-900">
      {yesPressed ? (
        <>
          <img src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif" />
          <div className="text-4xl md:text-6xl font-bold my-4">
            Ok Yayyyyy!!!
          </div>
        </>
      ) : (
        <>
          <img
            src={lovesvg}
            className="fixed animate-pulse top-10 md:left-24 left-6 md:w-40 w-28"
          />
          <img
            src={lovesvg2}
            className="fixed bottom-16 -z-10 animate-pulse md:right-24 right-10 md:w-40 w-32"
          />
          <img
            className="h-[230px] rounded-lg shadow-lg"
            src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.webp"
          />
          <h1 
            className="text-4xl md:text-6xl my-4 text-center transition-opacity duration-500"
            style={{ opacity: titleOpacity }}
          >
            {showGreeting ? "Hi Ashley" : "Will you be my Valentine?"}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 items-center">
            <button
              ref={yesButtonRef}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => setYesPressed(true)}
              style={{
                position: "fixed",
                left: `${yesButtonPosition.x}px`,
                top: `${yesButtonPosition.y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
                transition: "none",
                pointerEvents: "auto",
              }}
            >
              Yes
            </button>
            <button
              ref={noButtonRef}
              className="bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-bold py-2 px-4"
              style={{
                position: "fixed",
                left: `${noButtonPosition.x}px`,
                top: `${noButtonPosition.y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
                transition: "none",
                pointerEvents: "auto",
              }}
            >
              No
            </button>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}

const Footer = () => {
  return (
    <a
      className="fixed bottom-2 right-2 backdrop-blur-md opacity-80 hover:opacity-95 border p-1 rounded border-rose-300"
      href="https://github.com/Xeven777/valentine"
      target="__blank"
    >
      Made with{" "}
      <span role="img" aria-label="heart">
        ❤️
      </span>
    </a>
  );
};
