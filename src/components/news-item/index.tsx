import React, { ReactElement, useEffect, useState } from "react";

import * as ease from "../../utils/math/easing";

import HexOutline from "../../components/hex-outline";
import { gsap } from "gsap";

export interface LinkProps {
  url: string;
}

export interface Props {
  isActive?: boolean;
  category?: string;
  headline: string;
  blurb: string;
  image: ReactElement;
  link: LinkProps;
  visible?: boolean;
  className?: string;
  accentThickness?: number;
  transitionDelay?: number;
  transitionDuration?: number;
  testId?: string;
}

const NewsItem: React.FC<Props> = ({
  isActive = true,
  category,
  headline,
  blurb,
  image,
  link,
  visible = true,
  className,
  accentThickness = 2,
  transitionDelay = 0,
  transitionDuration = 1000,
  testId,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <article
      className={`${className ? className : ""} ${
        visible ? "is-visible" : ""
      } w-[30%] h-full mobile:h-full mobile:w-[20rem] mobile:my-0 mobile:mx-[10px] bg-white`}
      onMouseEnter={() => {
        setIsHovering(true);
        gsap.fromTo(
          document.querySelector("#img"),
          {
            scale: 1,
          },
          {
            scale: -1.2,
          }
        );
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        gsap.to("#img", { scale: 1, duration: 0.5 });
      }}
    >
      <a
        className="h-full, box-border relative flex items-center hover:no-underline"
        {...link}
      >
        <HexOutline
          isActive={isActive}
          clipRightTop={20}
          strokeColor={"transparent"}
          fillColor={"rgba(255,255,255,0)"}
          transitionDuration={transitionDuration}
          transitionDelay={transitionDelay}
          interactive
          hovering={isHovering}
          hoverDuration={300}
          hoverEase={ease.outExpo}
        />
        <div id="img" className="w-full h-[90%] max-w-[145px]">
          {image}
        </div>
        <div className="w-full max-w-[85%] h-full p-[10px] box-border overflow-hidden mobile:h-full">
          {category && (
            <div
              className="m-0 text-sm font-bold tracking-wide "
              style={{ color: "#bcbcbc" }}
            >
              {category}
            </div>
          )}
          <h1 className="leading-normal	mt-[10px] font-bold text-sm font-arialNarrow tracking-normal text-customBlack text-ellipsis overflow-hidden">
            {headline}
          </h1>
          <p className="relative mt-[8px] font-black text-[12px] tracking-[0.05rem] text-ellipsis overflow-hidden">
            {blurb}
          </p>
        </div>
        <HexOutline
          isActive={isActive}
          clipRightTop={20}
          strokeColor={"#bababa"}
          accentColor={"#bababa"}
          accentThickness={accentThickness}
          transitionDuration={transitionDuration}
          transitionDelay={transitionDelay}
          interactive
          hovering={isHovering}
          hoverDuration={300}
          hoverEase={ease.outExpo}
        />
      </a>
    </article>
  );
};

export default NewsItem;
