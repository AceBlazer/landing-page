import { useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollElementContext from "./contexts/scroll-element";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Section0 from "./components/Section0";
import Section1 from "./components/Section1";
import Section2 from "./components/Section2";
import Section3 from "./components/Section3";
import Section4 from "./components/Section4";
import Section5 from "./components/Section5";
import Section6 from "./components/Section6";
import Section7 from "./components/Section7";
import {
  InputManagerInstance,
  ViewportManagerInstance,
  activateManagers,
  deactivateManagers,
} from "./managers";
import { useResize } from "./utils/hooks/use-resize";

function App() {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(
    useContext(ScrollElementContext)
  );

  const ref = useRef<HTMLDivElement>(null);
  gsap.registerPlugin(ScrollTrigger);

  const animateDownloadSection = () => {
    const element = ref.current;
    if (!element) {
      return;
    }
    gsap.fromTo(
      element.querySelector("#download"),
      {
        opacity: 0,
        y: -220,
        z: 7,
      },
      {
        opacity: 1,
        y: 0,
        z: 0,
        ease: "none",
        scrollTrigger: {
          trigger: element.querySelector("#download"),
          start: "20% 80%",
          end: "bottom bottom",
          scrub: 1,
        },
      }
    );
  };

  const animateDownloadButton = () => {
    const element = ref.current;
    if (!element) {
      return;
    }
    gsap.fromTo(
      element.querySelector("#download-button"),
      {
        y: -200,
      },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: element.querySelector("#download"),
          start: "20% 80%",
          end: "bottom bottom",
          scrub: 2,
        },
      }
    );
  };

  const animateSectionFive = () => {
    const element = ref.current;
    if (!element) {
      return;
    }
    let yValue = 270.8;
    let startValue = -45;
    let endValue = 0;
    Array.from(element.querySelector("#section-five")?.children ?? []).forEach(
      (child) => {
        yValue = yValue + 15;
        gsap.fromTo(
          child,
          {
            y: yValue,
          },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: element.querySelector("#section-five"),
              start: `${startValue + 50}% 80%`,
              end: `${endValue + 50}% 100%`,
              scrub: 2,
            },
          }
        );
      }
    );
  };

  useEffect(() => {
    animateDownloadSection();
    animateDownloadButton();
    animateSectionFive();
  }, []);

  // Bind global managers...
  useEffect(() => {
    if (scrollElement === null) return;
    activateManagers(scrollElement);
    const delayedInitialResize = setTimeout(() => {
      ViewportManagerInstance.refresh();
      ViewportManagerInstance.apply();
      InputManagerInstance.refresh();
    }, 3000); // 3s provides enough time for initial entry animations to finish first
    return () => {
      clearTimeout(delayedInitialResize);
      deactivateManagers();
    };
  }, [scrollElement]);

  // ...also keep the InputManager bounds up-to-date
  useResize(() => {
    if (scrollElement === null) return;
    InputManagerInstance.refresh();
  }, [scrollElement]);

  return (
    <div ref={ref}>
      <Header />
      <Section0 />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Footer />
    </div>
  );
}

export default App;
