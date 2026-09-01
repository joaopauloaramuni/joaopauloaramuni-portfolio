import React, { useRef } from "react";
import "./Spotify.css";

const Spotify = () => {
  const containerRef = useRef(null);

  const handleImageLoad = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="spotify-container" ref={containerRef}>
      <div>
        <img
          width="875px"
          src="https://data-card-for-spotify.herokuapp.com/api/card?user_id=22lih5eniohc7dawfxohlo7wy"
          alt="Data Card for Spotify"
        />
      </div>
      <div>
        <table>
          <tr>
            <td>
              <img
                alt="Spotify"
                height="400px"
                src="https://spotify-github-profile.kittinanx.com/api/view?uid=22lih5eniohc7dawfxohlo7wy&cover_image=true&theme=default&show_offline=false&background_color=121212&interchange=false"
              />
            </td>
            <td>
              <img
                alt="Spotify list"
                height="400px"
                src="https://spotify-recently-played.jeffreyca.workers.dev/svg?user=22lih5eniohc7dawfxohlo7wy&amp;count=10&amp;width=540&amp;radius=40&amp;unique=1&amp;duration=1&amp;album=1&amp;footer=wave"
              />
            </td>
            <td>
              <a href="https://www.last.fm/pt/user/joaoaramuni" target="_blank">
                <img
                  height="400px"
                  alt="lastfm"
                  src="https://lastfm-recently-played.jeffreyca.workers.dev/svg?user=joaoaramuni&amp;count=10&amp;radius=40&amp;stats=compact&amp;footer=wave&amp;loved=off"
                />
              </a>
            </td>
          </tr>
        </table>
      </div>
      <div>
        <iframe
          data-testid="embed-iframe"
          style={{ borderRadius: "12px", border: "none" }}
          src="https://open.spotify.com/embed/track/0o8AsVRLRF15nT8GsLz5zO?utm_source=generator&theme=0"
          width="875px"
          height="352px"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Spotify;
