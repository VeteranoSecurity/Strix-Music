import MusicPortfolio from "@/components/ui/music-portfolio";
import "./index.css";
import img01 from "./assets/Album-Images/01.jpg";
import img02 from "./assets/Album-Images/02.jpg";
import img03 from "./assets/Album-Images/03.jpg";
import img04 from "./assets/Album-Images/04.jpg";
import img05 from "./assets/Album-Images/05.jpg";
import img06 from "./assets/Album-Images/06.jpg";

export default function App() {
  const projectsData = [
    {
      id: 1,
      artist: "STRIX MUSIC",
      album: "MIDNIGHT SUN",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2024",
      image: img01
    },
    {
      id: 2,
      artist: "STRIX MUSIC",
      album: "ETERNAL NIGHT",
      category: "ALBUM",
      label: "SELF RELEASED",
      year: "2024",
      image: img02
    },
    {
      id: 3,
      artist: "STRIX MUSIC",
      album: "SHADOW DANCE",
      category: "EP",
      label: "SELF RELEASED",
      year: "2023",
      image: img03
    },
    {
      id: 4,
      artist: "STRIX MUSIC",
      album: "BLOOD MOON",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2023",
      image: img04
    },
    {
      id: 5,
      artist: "STRIX MUSIC",
      album: "VAMPIRE TEARS",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2022",
      image: img05
    },
    {
      id: 6,
      artist: "STRIX MUSIC",
      album: "GOTHIC ROMANCE",
      category: "EP",
      label: "SELF RELEASED",
      year: "2022",
      image: img06
    }
  ];

  const config = {
    timeZone: "America/Sao_Paulo",
    timeUpdateInterval: 1000,
    idleDelay: 4000,
    debounceDelay: 100
  };

  const socialLinks = {
    spotify: "#",
    email: "mailto:contact@blackvamp.com",
    x: "https://x.com/blackvamp"
  };

  const location = {
    latitude: "23.5505° S",
    longitude: "46.6333° W",
    display: true
  };

  const callbacks = {
    onProjectHover: (project: any) => console.log('Hovering:', project),
    onProjectLeave: () => console.log('Left project'),
    onProjectClick: (project: any) => console.log('Playing:', project),
    onContainerLeave: () => console.log('Left container'),
    onIdleStart: () => console.log('Idle animation started'),
    onThemeChange: (theme: string) => console.log(`Theme changed to: ${theme}`)
  };

  return (
    <MusicPortfolio
      PROJECTS_DATA={projectsData}
      CONFIG={config}
      SOCIAL_LINKS={socialLinks}
      LOCATION={location}
      CALLBACKS={callbacks}
    />
  );
}
