import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

function App() {
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

  useEffect(() => {
    animateDownloadSection();
    animateDownloadButton();
  }, []);

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
