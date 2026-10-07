import React, { useRef } from "react";
import { isLastTerminalOutput, scrollLastCommandToTop } from "../terminal/terminalDom";
import "./Spotify.css";

const Spotify = () => {
  const containerRef = useRef(null);
  const scrolled = useRef(false);

  // Os cards vêm de serviços externos e demoram a carregar. Quando o primeiro
  // chega, leva o comando para o topo, uma vez só, e só se esta ainda for a
  // última saída do terminal. Antes, cada imagem que terminava de carregar
  // (são quatro) rolava a página de volta até aqui, mesmo com o visitante já
  // em outro comando.
  const handleImageLoad = () => {
    if (scrolled.current || !isLastTerminalOutput(containerRef.current)) return;
    scrolled.current = true;
    scrollLastCommandToTop();
  };

  return (
    <div className="spotify-container" ref={containerRef}>
      <div>
        <img
          className="spotify-card"
          onLoad={handleImageLoad}
          width="875"
          src="https://data-card-for-spotify.herokuapp.com/api/card?user_id=22lih5eniohc7dawfxohlo7wy"
          alt="Data Card for Spotify"
        />
      </div>
      <div className="spotify-recentes">
        <img
          onLoad={handleImageLoad}
          alt="Spotify"
          height="400"
          src="https://spotify-github-profile.kittinanx.com/api/view?uid=22lih5eniohc7dawfxohlo7wy&cover_image=true&theme=default&show_offline=false&background_color=121212&interchange=false"
        />
        <img
          onLoad={handleImageLoad}
          alt="Spotify list"
          height="400"
          src="https://spotify-recently-played.jeffreyca.workers.dev/svg?user=22lih5eniohc7dawfxohlo7wy&count=10&width=540&radius=40&unique=1&duration=1&album=1&footer=wave"
        />
        <a href="https://www.last.fm/pt/user/joaoaramuni" target="_blank" rel="noopener noreferrer">
          <img
            onLoad={handleImageLoad}
            height="400"
            alt="lastfm"
            src="https://lastfm-recently-played.jeffreyca.workers.dev/svg?user=joaoaramuni&count=10&radius=40&stats=compact&footer=wave&loved=off"
          />
        </a>
      </div>
      <div>
        <iframe
          className="spotify-player"
          data-testid="embed-iframe"
          title="Spotify"
          src="https://open.spotify.com/embed/track/0o8AsVRLRF15nT8GsLz5zO?utm_source=generator&theme=0"
          width="875"
          height="352"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Spotify;
