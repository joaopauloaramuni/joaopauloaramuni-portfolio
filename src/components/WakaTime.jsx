import React, { useRef } from "react";
import "./WakaTime.css";

const WakaTime = () => {
  return (
    <div className="wakatime-container">
      <table>
        <tr>
          <td>
            <img
              src="https://helio-github-stats.vercel.app/api/wakatime?username=aramuni&custom_title=WakaTime+Stats&card_width=466&line_height=25&layout=compact&display_format=time&disable_animations=false&langs_count=22"
              alt="WakaTime Stats"
              width="466"
              loading="lazy"
            />
          </td>
          <td>
            <img
              src="https://helio-github-stats.vercel.app/api/wakatime?username=aramuni&custom_title=WakaTime+Stats&card_width=466&line_height=25&layout=default&display_format=time&disable_animations=false&langs_count=12"
              alt="WakaTime Stats"
              width="466"
              loading="lazy"
            />
          </td>
        </tr>
      </table>
    </div>
  );
};

export default WakaTime;
