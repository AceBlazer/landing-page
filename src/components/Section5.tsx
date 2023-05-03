import { useState } from "react";
import HexOutline, { HexTransitionType } from "./hex-outline";
import * as ease from "../utils/math/easing";

export default function Section5() {
  const [isHovering, setIsHovering] = useState("");

  return (
    <div className="h-auto px-5 py-20 flex w-full  after:content-[''] after:w-[80px]">
      <div className="relative" style={{ width: "60px", flex: "0 0 auto" }}>
        <div
          className="z-10 relative inline-block ml-1/2"
          style={{ transform: "translateX(-50%)" }}
        >
          <div
            className="uppercase whitespace-nowrap text-primaryText text-xs font-arialNarrow -rotate-90 -translate-x-1/2 translate-y-full after:content-[''] after:inline-block after:align-middle after:w-4 after:h-0.5 after:ml-1 after:bg-current"
            style={{
              paddingTop: "100%",
              transformOrigin: "left top",
              letterSpacing: "0.25em",
              fontWeight: "bold",
            }}
          >
            À L'AFFICHE
          </div>
        </div>
      </div>
      <div className="min-w-0 after:block" style={{ flex: "1 1 100%" }}>
        <div className="max-w-full mx-auto my-0">
          <section>
            <div
              className="relative z-1 text-center text-customBlack"
              style={{ marginBottom: "65px" }}
            >
              <h1
                className="m-0 font-normal text-center"
                style={{ marginBlockStart: "0.83em", marginBlockEnd: "0.83em" }}
              >
                <span className="text-xl italic leading-[1.1rem] font-semibold tracking-widest block">
                  <div
                    style={{
                      animationDuration: "2000ms",
                      animationDelay: "100ms",
                      animationTimingFunction:
                        "cubic-bezier(0.165, 0.84, 0.44, 1)",
                      clipPath: "polygon(100% 100%, -200% 100%, 100% -200%)",
                      display: "inline-block",
                    }}
                  >
                    <span>EN DÉCOUVRIR</span>
                  </div>
                </span>
                <strong className="uppercase sm:text-[calc(43.27px + 2.12vw)] italic tracking-[0.03em] font-extrabold block">
                  <div
                    style={{
                      animationDuration: "2000ms",
                      animationDelay: "100ms",
                      animationTimingFunction:
                        "cubic-bezier(0.165, 0.84, 0.44, 1)",
                      clipPath: "polygon(100% 100%, -200% 100%, 100% -200%)",
                      display: "inline-block",
                    }}
                  >
                    <span>DAVANTAGE</span>
                  </div>
                </strong>
              </h1>
            </div>
            <ul
              id="section-five"
              className="relative z-1 w-full max-w-[960px] list-none mt-[10px] mx-auto mb-0	p-0 flex mobile:flex-col "
            >
              <li
                key={"listItem1"}
                className="z-10 mt-0 flex-[0_1_100%] w-full min-w-0 mobile:mt-0"
                onMouseEnter={() => setIsHovering("listItem1")}
                onMouseLeave={() => setIsHovering("")}
              >
                <article className="h-full">
                  <a className="relative box-border flex flex-col h-full my-0 mx-[10px] border-0 bg-transparent">
                    <div className="relative width-[calc(100% + 20px)] -ml-[10px] pt-[56.25%]">
                      <div className="absolute top-0 left-0 w-full h-full">
                        <img
                          className="object-cover block w-full h-full"
                          src="/images/MSI23_PATTERN_ALT_1920x1080-WHITE.jpg"
                        />
                      </div>
                    </div>
                    <div className="uppercase italic flex-[1_1_auto] p-[10%] my-0 -ml-[10px] text-center break-words bg-ccwhite font-lolBold text-md">
                      Présentation du MSI 2023
                    </div>
                    <HexOutline
                      className="-ml-[10px]"
                      isActive
                      offsetAmount={4}
                      offsetHorizontal={-1}
                      offsetVertical={1}
                      clipRightTop={20}
                      strokeColor={"#bcbcbc"}
                      accentColor={"#bcbcbc"}
                      accentThickness={1.7}
                      transitionDuration={1500}
                      transitionDelay={0}
                      interactive
                      hovering={isHovering === "listItem1"}
                      hoverEase={ease.outExpo}
                      transition={HexTransitionType.GROW}
                    />
                  </a>
                </article>
              </li>
              <li
                key={"listItem2"}
                className="z-10 mt-0 flex-[0_1_100%] w-full min-w-0 mobile:mt-[30px]"
                onMouseEnter={() => setIsHovering("listItem2")}
                onMouseLeave={() => setIsHovering("")}
              >
                <article className="h-full">
                  <a className="relative box-border flex flex-col h-full my-0 mx-[10px] border-0 bg-transparent">
                    <div className="relative width-[calc(100% + 20px)] -ml-[10px] pt-[56.25%]">
                      <div className="absolute top-0 left-0 w-full h-full">
                        <img
                          className="object-cover block w-full h-full"
                          src="/images/00_Header_SG2.jpg"
                        />
                      </div>
                    </div>
                    <div className="uppercase italic flex-[1_1_auto] p-[10%] my-0 -ml-[10px] text-center break-words bg-ccwhite font-lolBold text-sm">
                      Précédemment dans les Gardiens des étoiles
                    </div>

                    <HexOutline
                      className="-ml-[10px]"
                      isActive
                      offsetAmount={4}
                      offsetHorizontal={-1}
                      offsetVertical={1}
                      clipRightTop={20}
                      strokeColor={"#bcbcbc"}
                      accentColor={"#bcbcbc"}
                      accentThickness={1.5}
                      transitionDuration={1500}
                      transitionDelay={0}
                      interactive
                      hovering={isHovering === "listItem2"}
                      hoverEase={ease.outExpo}
                      transition={HexTransitionType.GROW}
                    />
                  </a>
                </article>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
