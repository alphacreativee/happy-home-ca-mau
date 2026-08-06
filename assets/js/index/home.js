// export các function dùng cho home
import { customDropdown, createFilterTab } from "../../main/js/global.min.js";
import {
  bannerSlide,
  growthSection,
  sliderScale,
  stackedSections,
  zoomImage,
  missionSection,
  connectAnimation,
} from "../../main/js/helpers.min.js";
("use strict");
$ = jQuery;

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  bannerSlide();
  growthSection();
  sliderScale();
  stackedSections();
  missionSection();
  zoomImage();
};
document.addEventListener("DOMContentLoaded", () => {
  init();
});

// event click element a
let isLinkClicked = false;

document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (
    link?.href &&
    !link.href.startsWith("#") &&
    !link.href.startsWith("javascript:")
  ) {
    isLinkClicked = true;
  }
});

window.addEventListener("beforeunload", () => {
  if (!isLinkClicked) window.scrollTo(0, 0);
  isLinkClicked = false;
});

window.addEventListener("load", () => {
  connectAnimation();
  mapCoverAnimation();
  ScrollTrigger.refresh();
});
export function mapCoverAnimation() {
  const connectSection = document.querySelector(".connect");
  const mapSection = document.querySelector(".map");

  if (!connectSection || !mapSection) return;

  // Chỉ set giá trị ban đầu, KHÔNG pin gì cả
  gsap.set(mapSection, { marginTop: 0 });

  gsap.to(mapSection, {
    marginTop: -connectSection.offsetHeight * 0.5, // chỉnh % độ che theo ý bạn
    ease: "none",
    scrollTrigger: {
      trigger: connectSection,
      start: "bottom bottom", // khi đáy connect chạm đáy viewport thì bắt đầu
      end: "bottom top",
      scrub: true,
    },
  });
}
