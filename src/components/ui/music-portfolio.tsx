import { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Play } from 'lucide-react'; // Using Lucide React as per instructions

// Register GSAP plugin
gsap.registerPlugin(ScrambleTextPlugin);

// Time Display Component
const TimeDisplay = ({CONFIG={}}: {CONFIG?: any}) => {
  const [time, setTime] = useState({ hours: '', minutes: '', dayPeriod: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: CONFIG.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const parts = formatter.formatToParts(now);
      
      setTime({
        hours: parts.find(part => part.type === "hour")?.value || '',
        minutes: parts.find(part => part.type === "minute")?.value || '',
        dayPeriod: parts.find(part => part.type === "dayPeriod")?.value || ''
      });
    };

    updateTime();
    const interval = setInterval(updateTime, CONFIG.timeUpdateInterval || 1000);
    return () => clearInterval(interval);
  }, [CONFIG]);

  return (
    <time className="corner-item bottom-right" id="current-time">
      {time.hours}<span className="time-blink">:</span>{time.minutes} {time.dayPeriod}
    </time>
  );
};

// Typewriter Text Component
const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timer: any;
    if (!isDeleting && displayText === text) {
      // Pause at the end before deleting
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && displayText === '') {
      // Pause before typing again
      timer = setTimeout(() => setIsDeleting(false), 1000);
    } else {
      const nextText = isDeleting 
        ? text.substring(0, displayText.length - 1)
        : text.substring(0, displayText.length + 1);
        
      const typingSpeed = isDeleting ? 30 : 100;
      
      timer = setTimeout(() => setDisplayText(nextText), typingSpeed);
    }
    
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text]);

  return <span>{displayText}<span className="time-blink">_</span></span>;
};

// ProjectItem Props Interface
interface ProjectItemProps {
  project: any;
  index: number;
  onMouseEnter: (index: number, imageUrl: string) => void;
  onMouseLeave: () => void;
  onClick: (index: number) => void;
  isActive: boolean;
  isIdle: boolean;
  isPlaying: boolean;
}

// Project Item Component
const ProjectItem = forwardRef<HTMLLIElement, ProjectItemProps>(
  ({ project, index, onMouseEnter, onMouseLeave, onClick, isActive, isIdle, isPlaying }, ref) => {
    // We can merge the external ref and internal itemRef or just use the external one for animations if needed.
    // The user's code uses projectItemsRef.current[index] = el on the <li>
    // And itemRef is inside ProjectItem but it's never used. 
    // Wait, let's just pass the forwarded ref down to the li instead of itemRef.
    const textRefs = {
    artist: useRef<HTMLSpanElement>(null),
    album: useRef<HTMLSpanElement>(null),
    category: useRef<HTMLSpanElement>(null),
    label: useRef<HTMLSpanElement>(null),
    year: useRef<HTMLSpanElement>(null),
  };

  useEffect(() => {
    if (isActive) {
      // Animate text scramble on hover
      Object.entries(textRefs).forEach(([key, ref]) => {
        if (ref.current) {
          gsap.killTweensOf(ref.current);
          gsap.to(ref.current, {
            duration: 0.8,
            scrambleText: {
              text: project[key],
              chars: "qwerty1337h@ck3r",
              revealDelay: 0.3,
              speed: 0.4
            }
          });
        }
      });
    } else {
      // Reset text
      Object.entries(textRefs).forEach(([key, ref]) => {
        if (ref.current) {
          gsap.killTweensOf(ref.current);
          ref.current.textContent = project[key];
        }
      });
    }
  }, [isActive, project]);

  return (
    <li 
      ref={ref}
      className={`project-item ${isActive ? 'active' : ''} ${isIdle ? 'idle' : ''} ${isPlaying ? 'playing' : ''}`}
      onMouseEnter={() => onMouseEnter(index, project.image)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(index)}
      data-image={project.image}
    >
      <div className="project-data artist flex items-center gap-2">
        {isPlaying && <Play size={16} fill="currentColor" className="shrink-0" />}
        <span ref={textRefs.artist} className="hover-text w-full truncate">
          {project.artist}
        </span>
      </div>
      <span ref={textRefs.album} className="project-data album hover-text">
        {project.album}
      </span>
      <span ref={textRefs.category} className="project-data category hover-text">
        {project.category}
      </span>
      <span ref={textRefs.label} className="project-data label hover-text">
        {project.label}
      </span>
      <span ref={textRefs.year} className="project-data year hover-text">
        {project.year}
      </span>
    </li>
  );
});

// Main Portfolio Component
const MusicPortfolio = ({PROJECTS_DATA=[], LOCATION={}, CALLBACKS={}, CONFIG={}}: {PROJECTS_DATA?: any, LOCATION?: any, CALLBACKS?: any, CONFIG?: any}) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [isIdle, setIsIdle] = useState(true);
  
  const backgroundRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const idleTimerRef = useRef<any>(null);
  const idleAnimationRef = useRef<any>(null);
  const debounceRef = useRef<any>(null);
  const projectItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Preload images
  useEffect(() => {
    // Add default background
    if (CONFIG.defaultBackground && backgroundRef.current && playingIndex === -1 && activeIndex === -1) {
      backgroundRef.current.style.backgroundImage = `url(${CONFIG.defaultBackground})`;
      backgroundRef.current.style.opacity = "0.2";
    }

    PROJECTS_DATA.forEach((project: any) => {
      if (project.image) {
        const img = new Image();
        img.src = project.image;
      }
    });
  }, [PROJECTS_DATA]);

  // Start idle animation
  const startIdleAnimation = useCallback(() => {
    if (idleAnimationRef.current) return;
    
    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 2
    });
    
    projectItemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      const hideTime = 0 + index * 0.05;
      const showTime = 0 + (PROJECTS_DATA.length * 0.05 * 0.5) + index * 0.05;
      
      timeline.to(item, {
        opacity: 0.2,
        duration: 0.2,
        ease: "power2.inOut"
      }, hideTime);
      
      timeline.to(item, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.inOut"
      }, showTime);
    });
    
    idleAnimationRef.current = timeline;
  }, [PROJECTS_DATA.length]);

  // Stop idle animation
  const stopIdleAnimation = useCallback(() => {
    if (idleAnimationRef.current) {
      idleAnimationRef.current.kill();
      idleAnimationRef.current = null;
      
      projectItemsRef.current.forEach(item => {
        if (item) {
          gsap.set(item, { opacity: 1 });
        }
      });
    }
  }, []);

  // Start idle timer
  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    idleTimerRef.current = setTimeout(() => {
      if (activeIndex === -1) {
        setIsIdle(true);
        startIdleAnimation();
      }
    }, CONFIG.idleDelay || 4000);
  }, [activeIndex, startIdleAnimation, CONFIG.idleDelay]);

  // Stop idle timer
  const stopIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  // Handle mouse enter on project
  const handleProjectMouseEnter = useCallback((index: number, imageUrl: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    stopIdleAnimation();
    stopIdleTimer();
    setIsIdle(false);
    
    if (activeIndex === index) return;
    
    setActiveIndex(index);
    if (CALLBACKS.onProjectHover) CALLBACKS.onProjectHover(PROJECTS_DATA[index]);
    
    if (imageUrl && backgroundRef.current) {
      // Show background with animation
      const bg = backgroundRef.current;
      bg.style.transition = "none";
      bg.style.transform = "scale(1.1)";
      bg.style.backgroundImage = `url(${imageUrl})`;
      bg.style.opacity = "1";
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bg.style.transition = "opacity 0.6s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          bg.style.transform = "scale(1.0)";
        });
      });
    }
  }, [activeIndex, stopIdleAnimation, stopIdleTimer, CALLBACKS, PROJECTS_DATA]);

  // Handle click on project
  const handleProjectClick = useCallback((index: number) => {
    setPlayingIndex(prevIndex => prevIndex === index ? -1 : index);
    if (CALLBACKS.onProjectClick) CALLBACKS.onProjectClick(PROJECTS_DATA[index]);
  }, [CALLBACKS, PROJECTS_DATA]);

  // Handle mouse leave on project
  const handleProjectMouseLeave = useCallback(() => {
    debounceRef.current = setTimeout(() => {
      if (CALLBACKS.onProjectLeave) CALLBACKS.onProjectLeave();
    }, CONFIG.debounceDelay || 50);
  }, [CALLBACKS, CONFIG.debounceDelay]);

  // Handle container mouse leave
  const handleContainerMouseLeave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    setActiveIndex(-1);
    if (CALLBACKS.onContainerLeave) CALLBACKS.onContainerLeave();
    
    if (backgroundRef.current) {
      // Keep background of playing track if one is playing
      if (playingIndex !== -1 && PROJECTS_DATA[playingIndex]?.image) {
        backgroundRef.current.style.backgroundImage = `url(${PROJECTS_DATA[playingIndex].image})`;
        backgroundRef.current.style.opacity = "0.4"; // Dim it a bit when not hovered
      } else if (CONFIG.defaultBackground) {
        backgroundRef.current.style.backgroundImage = `url(${CONFIG.defaultBackground})`;
        backgroundRef.current.style.opacity = "0.2";
      } else {
        backgroundRef.current.style.opacity = "0.15";
      }
    }
    
    startIdleTimer();
  }, [startIdleTimer, CALLBACKS, playingIndex, PROJECTS_DATA]);

  // Update background when playing index changes and mouse is not hovering
  useEffect(() => {
    if (activeIndex === -1 && backgroundRef.current) {
      if (playingIndex !== -1 && PROJECTS_DATA[playingIndex]?.image) {
        backgroundRef.current.style.backgroundImage = `url(${PROJECTS_DATA[playingIndex].image})`;
        backgroundRef.current.style.opacity = "0.4";
      } else if (CONFIG.defaultBackground) {
        backgroundRef.current.style.backgroundImage = `url(${CONFIG.defaultBackground})`;
        backgroundRef.current.style.opacity = "0.2";
      } else {
        backgroundRef.current.style.opacity = "0.15";
      }
    }
  }, [playingIndex, activeIndex, PROJECTS_DATA, CONFIG.defaultBackground]);

  // Initial idle animation
  useEffect(() => {
    startIdleTimer();
    return () => {
      stopIdleTimer();
      stopIdleAnimation();
    };
  }, [startIdleTimer, stopIdleTimer, stopIdleAnimation]);

  return (
    <>
      <div className="app-container">
        <main 
          ref={containerRef}
          className={`portfolio-container ${activeIndex !== -1 ? 'has-active' : ''}`}
          onMouseLeave={handleContainerMouseLeave}
        >
          <h1 className="sr-only">Strix Music</h1>
          <ul className="project-list" role="list">
            {PROJECTS_DATA.map((project: any, index: number) => (
              <ProjectItem
                key={project.id}
                project={project}
                index={index}
                onMouseEnter={handleProjectMouseEnter}
                onMouseLeave={handleProjectMouseLeave}
                onClick={handleProjectClick}
                isActive={activeIndex === index}
                isPlaying={playingIndex === index}
                isIdle={isIdle}
                ref={(el: HTMLLIElement | null) => { projectItemsRef.current[index] = el; }}
              />
            ))}
          </ul>
        </main>

        <div 
          ref={backgroundRef}
          className="background-image" 
          id="backgroundImage" 
          role="img" 
          aria-hidden="true"
        />

        <aside className="corner-elements">
          <div className="corner-item top-left">
            <div className="corner-square" aria-hidden="true"></div>
          </div>
          <nav className="corner-item top-right">
            <span style={{ margin: "0 0.5rem", cursor: "default" }}>Spotify</span> |
            <span style={{ margin: "0 0.5rem", cursor: "default" }}>Email</span> |
            <span style={{ margin: "0 0.5rem", cursor: "default" }}>X</span>
          </nav>
          <div className="corner-item bottom-left">{LOCATION.display ? `${LOCATION.latitude}, ${LOCATION.longitude}` : ''}</div>
          <div className="corner-item bottom-center">
            <a 
              href="https://wa.me/5561982573590?text=quero%20fazer%20um%20site%2Fdesign%20com%20voce" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ cursor: "pointer" }}
            >
              <TypewriterText text="Desenvolvido por TrilhaRede" />
            </a>
          </div>
          <TimeDisplay CONFIG={CONFIG} />
        </aside>
      </div>
    </>
  );
};

export default MusicPortfolio;
