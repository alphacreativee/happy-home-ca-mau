// export các function dùng cho home
import { customDropdown, createFilterTab } from "../../main/js/global.min.js";
import {
  bannerSlide,
  growthSection,
  sliderScale,
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
document.addEventListener("DOMContentLoaded", () => {});
