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
function initLiberateScroll() {
  const pinSection = document.querySelector(".liberate-pin");
  const wrapSection = document.querySelector(".liberate-wrap");
  const list = document.querySelector(".liberate-list");
  const wraps = gsap.utils.toArray(".liberate-item-wrap");
  const nextSection = document.querySelector(".spacer"); // section đè lên

  if (!pinSection || !wrapSection || !list || wraps.length === 0) {
    console.warn("Liberate scroll: thiếu phần tử");
    return;
  }

  gsap.set(pinSection, { position: "relative", zIndex: 1 });
  gsap.set(wrapSection, { position: "relative", zIndex: 2 });

  // Section kế tiếp: đặt cao hơn, và cho trạng thái ban đầu nằm dưới (yPercent 100)
  if (nextSection) {
    gsap.set(nextSection, {
      position: "relative",
      zIndex: 3,
      yPercent: 0, // giữ ở vị trí bình thường trong flow
    });
  }

  wraps.forEach((wrap) => {
    const [, box2] = wrap.querySelectorAll(".liberate-box-item");
    gsap.set(wrap, { yPercent: 100 });
    if (box2) gsap.set(box2, { yPercent: -100 });
  });

  ScrollTrigger.create({
    trigger: pinSection,
    start: "top top",
    endTrigger: wrapSection,
    end: "bottom top",
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
  });

  const scrollDistance = (wraps.length + 2) * window.innerHeight;

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
    },
  });

  wraps.forEach((wrap, i) => {
    const [, box2] = wrap.querySelectorAll(".liberate-box-item");

    master.to(wrap, { yPercent: 0, ease: "none", duration: 1 }, i);

    if (box2) {
      master.to(box2, { yPercent: 0, ease: "none", duration: 0.5 }, i + 0.5);
    }
  });

  master.to({}, { duration: 0.8 });

  ScrollTrigger.refresh();
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  bannerSlide();
  growthSection();
  sliderScale();
  stackedSections();
  missionSection();
  zoomImage();
  initLiberateScroll();
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
  animationReveal();
  // mapCoverAnimation();
  revealImageParallax();
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
function animationReveal() {
  gsap.registerPlugin(ScrollTrigger);

  const footer = document.getElementById("footer");
  const header = document.getElementById("header");

  document.querySelectorAll(".reveal").forEach((section) => {
    if (section.dataset.scriptInitialized) return;
    section.dataset.scriptInitialized = "true";

    const container = section.querySelector(".reveal-slider");
    const items = container.querySelectorAll(".reveal-item");
    if (!items.length) return;

    const percentParallax = 10;
    const images = Array.from(items)
      .map((item) => item.querySelector(".reveal-item-img img"))
      .filter(Boolean);

    // ----- Trạng thái ban đầu -----
    gsap.set(items, { y: "100%" });
    gsap.set(images, { yPercent: `-${percentParallax}` });
    if (footer) gsap.set(footer, { yPercent: 100 });

    const FOOTER_REVEAL = 1; // thêm 1 màn hình scroll dành cho footer trượt lên

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${(items.length + 1 + FOOTER_REVEAL) * 100}%`,
        pin: true,
        scrub: 1,
        // markers: true,
        onUpdate: (self) => {
          section.classList.toggle("show-bg", self.progress >= 0.1);
          if (header) {
            header.classList.toggle("header-text-light", self.progress >= 0.1);
          }
        },
        onEnter: () => {
          // Vào vùng pin -> gắn footer fixed theo viewport
          if (footer) {
            gsap.set(footer, {
              position: "fixed",
              left: 0,
              bottom: 0,
              width: "100%",
            });
          }
        },
        onLeaveBack: () => {
          // Cuộn ngược lên trên, ra khỏi vùng pin -> trả footer về flow bình thường
          // (an toàn vì lúc này footer đang yPercent: 100, ẩn hoàn toàn, không gây nhảy vị trí)
          if (footer) {
            gsap.set(footer, {
              clearProps: "position,left,bottom,width",
            });
          }
          if (header) {
            header.classList.remove("header-text-light");
          }
        },
        // Không cần onLeave / onEnterBack cho footer nữa —
        // vì footer là phần tử cuối trang, giữ fixed vĩnh viễn sau khi
        // đã pin qua 1 lần là đủ, tránh hiện tượng nhảy/giật khi chuyển
        // fixed -> relative giữa lúc đang hiển thị.
      },
    });

    // ----- Reveal từng item -----
    items.forEach((item, index) => {
      const img = images[index];
      const pos = index;

      tl.to(item, { y: "0%", duration: 1, ease: "power2.out" }, pos);

      if (img) {
        tl.to(
          img,
          {
            yPercent: percentParallax,
            duration: 1,
            ease: "power2.out",
          },
          pos,
        );
      }
    });

    // ----- Footer trượt lên đè phủ section, ngay sau item cuối -----
    if (footer) {
      tl.to(
        footer,
        {
          yPercent: 0,
          duration: 1,
          ease: "power2.out",
          if(footer) {
            tl.to(
              footer,
              {
                yPercent: 0,
                duration: 1,
                ease: "power2.out",
                onStart: () => {
                  section.classList.add("hide-title");
                  console.log("hide-title added", section);
                },
                onReverseComplete: () => {
                  section.classList.remove("hide-title");
                  console.log("hide-title removed", section);
                },
              },
              items.length + 0.4,
            );
          },
        },
        items.length,
      );
    }
  });
}
function revealImageParallax() {
  document.querySelectorAll(".reveal").forEach((section) => {
    const bgImg = section.querySelector(".reveal-image>img");
    if (!bgImg) return;
    if (bgImg.dataset.scriptInitialized) return;
    bgImg.dataset.scriptInitialized = "true";

    const percentParallax = 15;

    const tween = gsap.fromTo(
      bgImg,
      { yPercent: 0 },
      {
        yPercent: -percentParallax, // chỉ chạy lên. Đổi thành +percentParallax nếu muốn chạy xuống
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    bgImg._parallaxST = tween.scrollTrigger;
  });
}
