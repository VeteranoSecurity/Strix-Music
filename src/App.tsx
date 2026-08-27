import MusicPortfolio from "@/components/ui/music-portfolio";
import "./index.css";
import img01 from "./assets/Album-Images/old vampir.jpg";
import img02 from "./assets/Album-Images/bats.jpg";
import img03 from "./assets/Album-Images/V X L.jpg";
import img04 from "./assets/Album-Images/gold Eyes.png";
import img05 from "./assets/Album-Images/blackwhite crown.gif";
import img06 from "./assets/Album-Images/Werewolf house.png";
import img07 from "./assets/Album-Images/crypt.jpg";
import img08 from "./assets/Album-Images/Werewolf real.png";
import img09 from "./assets/Album-Images/wewwolf water.jpg";
import defaultBg from "./assets/background.avif";

import cityWithoutKings from "./assets/Musics/STRIXxXIRTS/CITY WITHOUT KINGS.mp3";
import endOfSilence from "./assets/Musics/STRIXxXIRTS/End of Silence.mp3";
import ghostsOfTheImmortals from "./assets/Musics/STRIXxXIRTS/GHOSTS OF THE IMMORTALS.mp3";
import instinctInTheInfrastructure from "./assets/Musics/STRIXxXIRTS/INSTINCT IN THE INFRASTRUCTURE.mp3";
import noGodsInTheStatic from "./assets/Musics/STRIXxXIRTS/NO GODS IN THE STATIC.mp3";
import signalDistortion from "./assets/Musics/STRIXxXIRTS/SIGNAL DISTORTION.mp3";
import theCityLeans from "./assets/Musics/STRIXxXIRTS/THE CITY LEANS.mp3";
import keinGottFuerDenBlock from "./assets/Musics/STRIXxXIRTS/Kein_Gott_fuer_den_Block.mp3";
import schwarzerMarsch from "./assets/Musics/STRIXxXIRTS/Schwarzer_Marsch.mp3";

export default function App() {
  const projectsData = [
    {
      id: 1,
      artist: "STRIX MUSIC",
      album: "CITY WITHOUT KINGS",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2026",
      audio: cityWithoutKings,
      image: img01
    },
    {
      id: 2,
      artist: "STRIX MUSIC",
      album: "End of Silence",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2026",
      audio: endOfSilence,
      image: img02
    },
    {
      id: 3,
      artist: "STRIX MUSIC",
      album: "GHOSTS OF THE IMMORTALS",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2026",
      audio: ghostsOfTheImmortals,
      image: img03
    },
    {
      id: 4,
      artist: "STRIX MUSIC",
      album: "INSTINCT IN THE INFRASTRUCTURE",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2026",
      audio: instinctInTheInfrastructure,
      image: img04
    },
    {
      id: 5,
      artist: "STRIX MUSIC",
      album: "NO GODS IN THE STATIC",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2026",
      audio: noGodsInTheStatic,
      image: img05
    },
    {
      id: 6,
      artist: "STRIX MUSIC",
      album: "SIGNAL DISTORTION",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2026",
      audio: signalDistortion,
      image: img06
    },
    {
      id: 7,
      artist: "STRIX MUSIC",
      album: "THE CITY LEANS",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2026",
      audio: theCityLeans,
      image: img07
    },
    {
      id: 8,
      artist: "STRIX MUSIC",
      album: "Kein Gott für den Block",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2026",
      audio: keinGottFuerDenBlock,
      image: img08
    },
    {
      id: 9,
      artist: "STRIX MUSIC",
      album: "Schwarzer Marsch",
      category: "SINGLE",
      label: "SELF RELEASED",
      year: "2026",
      audio: schwarzerMarsch,
      image: img09
    }
  ];

  const config = {
    timeZone: "America/Sao_Paulo",
    timeUpdateInterval: 1000,
    idleDelay: 4000,
    debounceDelay: 100,
    defaultBackground: defaultBg
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
      LOCATION={location}
      CALLBACKS={callbacks}
    />
  );
}
