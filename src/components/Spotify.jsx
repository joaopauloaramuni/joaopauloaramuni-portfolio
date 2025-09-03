// src/components/Spotify.jsx
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import "./Spotify.css";

const Spotify = () => {
  const { t } = useTranslation();
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
          width="820px"
          src="https://data-card-for-spotify.herokuapp.com/api/card?user_id=22lih5eniohc7dawfxohlo7wy"
          alt="Data Card for Spotify"
          onLoad={handleImageLoad}
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
                onLoad={handleImageLoad}
              />
            </td>
            <td>
              <img
                alt="Spotify list"
                height="400px"
                src="https://spotify-recently-played-readme.vercel.app/api?user=22lih5eniohc7dawfxohlo7wy&count=10"
                onLoad={handleImageLoad}
              />
            </td>
            <td>
              <a href="https://www.last.fm/pt/user/joaoaramuni" target="_blank">
                <img
                  height="400px"
                  alt="lastfm"
                  src="https://lastfm-recently-played.vercel.app/api?user=joaoaramuni&count=10"
                  onLoad={handleImageLoad}
                />
              </a>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default Spotify;
