import { useLayoutEffect, useState } from "react";
import { downloadVideos } from "../constants/downloadVideos";

export default function Section6() {
  const [randomVideo, setRandomVideo] = useState<string | null>(null);

  useLayoutEffect(() => {
    const randomIndex = Math.floor(Math.random() * downloadVideos.length);
    setRandomVideo(downloadVideos[randomIndex]);
  }, []);

  return (
    <section
      className="relative w-full"
      style={{ height: "100vh", minHeight: "400px", maxHeight: "1200px" }}
    >
      <div className="overflow-hidden absolute left-0 top-0 flex w-full h-full items-center bg-customBg">
        <div id="download" className="opacity-1 relative z-0 h-full w-full">
          {randomVideo ? (
            <video
              preload="none"
              style={{
                objectFit: "cover",
                objectPosition: "center top",
                height: "100%",
                width: "100%",
              }}
              loop
              muted
              playsInline
              autoPlay
            >
              <source src={randomVideo} type="video/mp4" />
            </video>
          ) : null}
        </div>
      </div>
      <div className="absolute left-0 top-0 flex w-full h-full items-center justify-center text-customBlack">
        <a
          id="download-button"
          className="cursor-pointer uppercase relative inline-block p-0 text-xs font-bold border-0"
          style={{
            minWidth: "195px",
            height: "56px",
            margin: "5px",
            letterSpacing: "0.15em",
          }}
        >
          <span
            className="relative flex items-center justify-center"
            style={{
              boxSizing: "border-box",
              minWidth: "195px",
              height: "56px",
              padding: "0px 40px",
            }}
          >
            <div>
              <span
                className="bg-primary hover:bg-primaryHover absolute left-0 top-0 w-full"
                style={{
                  minWidth: "195px",
                  height: "56px",
                  transition:
                    "background-color 200ms ease 0s, opacity 0.01s ease 400ms",
                }}
              ></span>
            </div>
            <span className="relative z-1">Jouez gratuitement</span>
          </span>
          <div className="absolute inset-1 pointer-events-none">
            <canvas
              className="absolute block"
              width="206"
              height="54"
              style={{
                width: "247.519px",
                height: "66px",
                left: "-6px",
                top: "-6px",
              }}
            ></canvas>
          </div>
        </a>
      </div>
    </section>
  );
}
