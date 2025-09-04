import React, { useRef } from "react";
import "./WakaTime.css";

const WakaTime = () => {
  return (
    <div className="wakatime-container">
      <table>
        <tr>
          <td>
            <img
              width="500px"
              alt="WakaTime"
              src="https://github-readme-stats.vercel.app/api/wakatime?username=aramuni&theme=dark&langs_count=12"
            />
          </td>
          <td>
            <img
              width="475px"
              alt="WakaTime"
              src="https://github-readme-stats.vercel.app/api/wakatime?username=aramuni&theme=dark&layout=compact"
            />
          </td>
        </tr>
      </table>
    </div>
  );
};

export default WakaTime;
