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
  // mapCoverAnimation();
  ScrollTrigger.refresh();
});
function mapCoverAnimation() {
  const mapSection = document.querySelector(".map");
  if (!mapSection) return;

  gsap.set(".connect", { zIndex: 1, position: "relative" });
  gsap.set(mapSection, { zIndex: 20, position: "relative" });

  ScrollTrigger.create({
    trigger: mapSection,
    start: "top bottom",
    end: "top top",
    scrub: true,
    pin: true,
    pinSpacing: false,
    markers: true,
  });
}

window.addEventListener("load", () => {
  const panelTop = document.querySelector(".liberate-panel-top");
  const wraps = gsap.utils.toArray(".liberate-item-wrap");
  const list = document.querySelector(".liberate-list");

  const scrollUnits = wraps.length - 1;
  list.style.height = `${scrollUnits * 100}vh`;

  wraps.forEach((wrap) => {
    gsap.set(wrap, { yPercent: 100 });
  });

  // Pin panel-top: dính đúng bằng chiều cao content thật của nó,
  // kết thúc pin đúng lúc .liberate-list bắt đầu (item 1 sắp trượt lên đè)
  ScrollTrigger.create({
    trigger: panelTop,
    start: "top top",
    endTrigger: list,
    end: "bottom top", // 👈 đổi lại — pin panel-top xuyên suốt lúc list đang pin
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
    // markers: true,
  });

  const master = gsap.timeline({
    scrollTrigger: {
      trigger: list,
      start: "top top",
      end: `+=${scrollUnits * 100}%`,
      scrub: true,
      pin: true,
      invalidateOnRefresh: true,
      // markers: true,
    },
  });

  wraps.forEach((wrap, i) => {
    const boxItems = wrap.querySelectorAll(".liberate-box-item");
    const [box1, box2] = boxItems;
    gsap.set(box2, { yPercent: -100 });

    master.to(wrap, { yPercent: 0, ease: "none", duration: 1 }, i);
    master.to(box2, { yPercent: 0, ease: "none", duration: 0.5 }, i + 0.5);
  });

  ScrollTrigger.refresh();
});
console.log("ScrollTriggers:", ScrollTrigger.getAll().length);
console.log(
  "list height:",
  document.querySelector(".liberate-list").style.height,
);
console.log(
  "wraps:",
  document.querySelectorAll(".liberate-item-wrap").length,
  "innerHeight:",
  window.innerHeight,
);
