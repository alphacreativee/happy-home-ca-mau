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

gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".liberate-item-wrap").forEach((wrap) => {
  const panel = wrap.querySelector(".liberate-item");
  const boxItems = wrap.querySelectorAll(".liberate-box-item");
  const box1 = boxItems[0];
  const box2 = boxItems[1];

  gsap.set(box2, { yPercent: -100, zIndex: 1 });
  gsap.set(box1, { zIndex: 2 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: "top top",
      end: "+=200%", // khớp với height:200vh của wrap
      scrub: true,
      markers: true,
    },
  });

  // nửa đầu quãng cuộn: item pin & trượt lên che panel/item trước
  tl.fromTo(
    panel,
    { yPercent: 100 },
    { yPercent: 0, duration: 0.5, ease: "none" },
    0,
  );

  // nửa sau: 2 ảnh tách khỏi nhau
  tl.to(box2, { yPercent: 0, duration: 0.5, ease: "none" }, 0.5);
});
