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
function initLiberateScroll() {
  const pinSection = document.querySelector(".liberate-pin");
  const wrapSection = document.querySelector(".liberate-wrap");
  const list = document.querySelector(".liberate-list");
  const wraps = gsap.utils.toArray(".liberate-item-wrap");

  if (!pinSection || !wrapSection || !list || wraps.length === 0) {
    console.warn("Liberate scroll: thiếu phần tử");
    return;
  }

  console.log("Số lượng item:", wraps.length); // ← xem console có đúng 3 không

  gsap.set(pinSection, { position: "relative", zIndex: 1 });
  gsap.set(wrapSection, { position: "relative", zIndex: 2 });

  // Set trạng thái ban đầu
  wraps.forEach((wrap) => {
    const [, box2] = wrap.querySelectorAll(".liberate-box-item");
    gsap.set(wrap, { yPercent: 100 });
    if (box2) gsap.set(box2, { yPercent: -100 });
  });

  // Pin text
  ScrollTrigger.create({
    trigger: pinSection,
    start: "top top",
    endTrigger: wrapSection,
    end: "bottom top",
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
  });

  // === Tăng mạnh khoảng scroll ===
  const scrollDistance = (wraps.length + 2) * window.innerHeight; // tăng mạnh

  const master = gsap.timeline({
    scrollTrigger: {
      trigger: wrapSection,
      start: "top top",
      end: `+=${scrollDistance}`,
      scrub: true,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // markers: true, // ← BẬT MARKERS để nhìn
    },
  });

  wraps.forEach((wrap, i) => {
    const [, box2] = wrap.querySelectorAll(".liberate-box-item");

    master.to(
      wrap,
      {
        yPercent: 0,
        ease: "none",
        duration: 1,
      },
      i,
    );

    if (box2) {
      master.to(
        box2,
        {
          yPercent: 0,
          ease: "none",
          duration: 0.5,
        },
        i + 0.5,
      );
    }
  });

  // Giữ cuối lâu hơn
  master.to({}, { duration: 0.8 });

  ScrollTrigger.refresh();
}

window.addEventListener("load", initLiberateScroll);

// Gọi hàm

// window.addEventListener("load", () => {
//   const panelTop = document.querySelector(".liberate-panel-top");
//   const list = document.querySelector(".liberate-list");
//   const wraps = gsap.utils.toArray(".liberate-item-wrap");

//   // 👇 giờ mỗi wrap (kể cả wrap đầu) đều chiếm 1 unit scroll để trượt vào
//   const scrollUnits = wraps.length - (wraps.length - 1);
//   list.style.height = `${scrollUnits * 100}vh`;

//   // 👇 TẤT CẢ wrap đều bắt đầu ẩn hoàn toàn, không còn ngoại lệ cho wrap[0]
//   wraps.forEach((wrap) => {
//     gsap.set(wrap, { yPercent: 100 });
//   });

//   ScrollTrigger.create({
//     trigger: panelTop,
//     start: "top top",
//     endTrigger: list,
//     end: "bottom top",
//     pin: true,
//     pinSpacing: false,
//     invalidateOnRefresh: true,
//   });

//   const master = gsap.timeline({
//     scrollTrigger: {
//       trigger: list,
//       start: "top top",
//       end: `+=${scrollUnits * 100}%`,
//       scrub: true,
//       pin: true,
//       invalidateOnRefresh: true,
//       markers: true,
//     },
//   });

//   wraps.forEach((wrap, i) => {
//     const [box1, box2] = wrap.querySelectorAll(".liberate-box-item");
//     gsap.set(box2, { yPercent: -100 });

//     // wrap[0] giờ cũng trượt vào ở segment i=0, y hệt logic các wrap sau
//     master.to(wrap, { yPercent: 0, ease: "none", duration: 1 }, i);
//     master.to(box2, { yPercent: 0, ease: "none", duration: 0.5 }, i + 0.5);
//   });

//   ScrollTrigger.refresh();
// });

// window.addEventListener("load", () => {
//   const panelTop = document.querySelector(".liberate-panel-top");
//   const list = document.querySelector(".liberate-list");
//   const wraps = gsap.utils.toArray(".liberate-item-wrap");

//   const scrollUnits = wraps.length - (wraps.length - 1);
//   list.style.height = `${scrollUnits * 100}vh`;

//   // Set trạng thái ban đầu cho tất cả
//   wraps.forEach((wrap) => {
//     const [, box2] = wrap.querySelectorAll(".liberate-box-item");
//     gsap.set(wrap, { yPercent: 100 });
//     gsap.set(box2, { yPercent: -100 });
//   });

//   // Pin panelTop
//   ScrollTrigger.create({
//     trigger: panelTop,
//     start: "top top",
//     endTrigger: list,
//     end: "bottom top",
//     pin: true,
//     pinSpacing: false,
//     invalidateOnRefresh: true,
//   });

//   // Master timeline – bao gồm cả wrap 0
//   const master = gsap.timeline({
//     scrollTrigger: {
//       trigger: list,
//       start: "top top",
//       end: `+=${scrollUnits * 100}%`,
//       scrub: true,
//       pin: true,
//       invalidateOnRefresh: true,
//       // markers: true,
//     },
//   });

//   wraps.forEach((wrap, i) => {
//     const [, box2] = wrap.querySelectorAll(".liberate-box-item");

//     // Item trượt lên
//     master.to(
//       wrap,
//       {
//         yPercent: 0,
//         ease: "none",
//         duration: 1,
//       },
//       i,
//     );

//     // Box bên trong
//     master.to(
//       box2,
//       {
//         yPercent: 0,
//         ease: "none",
//         duration: 0.5,
//       },
//       i + 0.5,
//     );
//   });

//   ScrollTrigger.refresh();
// });
