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
  gsap.registerPlugin(ScrollTrigger, SplitText);

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

  if (nextSection) {
    gsap.set(nextSection, {
      position: "relative",
      zIndex: 3,
      yPercent: 0,
    });
  }

  wraps.forEach((wrap) => {
    const [, box2] = wrap.querySelectorAll(".liberate-box-item");
    gsap.set(wrap, { yPercent: 100 });
    if (box2) gsap.set(box2, { yPercent: -100 });
  });

  // ----- Pin panel-top dưới list -----
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

  // ----- Timeline chính: pin toàn bộ list, cho từng item trượt lên -----
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

  const PARALLAX_PERCENT = 10; // ~5-7%, chỉnh trong khoảng này tuỳ ý

  wraps.forEach((wrap, i) => {
    const [, box2] = wrap.querySelectorAll(".liberate-box-item");
    const images = wrap.querySelectorAll(".liberate-box .image img");

    master.addLabel(`item${i}`, i);

    master.to(wrap, { yPercent: 0, ease: "none", duration: 1 }, i);

    if (box2) {
      master.to(box2, { yPercent: 0, ease: "none", duration: 0.5 }, i + 0.5);
    }

    // Parallax nhẹ cho ảnh bên trong, chạy song song lúc wrap trượt lên
    if (images.length) {
      gsap.set(images, { yPercent: `${PARALLAX_PERCENT}` });
      master.to(
        images,
        { yPercent: -PARALLAX_PERCENT, ease: "none", duration: 1 },
        i,
      );
    }
  });

  master.addLabel("end", wraps.length);
  master.to({}, { duration: 0.8 });

  ScrollTrigger.refresh();

  // ----- Text animation riêng cho từng item, chạy trễ hơn card 1 xíu -----
  document.fonts.ready.then(() => {
    const DELAY = 0.3; // trễ hơn 0.3 đơn vị timeline so với lúc card bắt đầu lên

    wraps.forEach((wrap, i) => {
      const el = wrap.querySelector(".liberate-content .content");
      if (!el) return;

      const splitTitle = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
      });

      gsap.set(splitTitle.lines, { yPercent: 100 });

      const startLabel = `item${i}`;
      const endLabel = i + 1 < wraps.length ? `item${i + 1}` : "end";

      ScrollTrigger.create({
        start: () =>
          master.scrollTrigger.labelToScroll(startLabel) +
          DELAY *
            ((master.scrollTrigger.end - master.scrollTrigger.start) /
              wraps.length),
        end: () => master.scrollTrigger.labelToScroll(endLabel),
        toggleActions: "play none none reverse",
        // markers: true,
        onEnter: () => {
          gsap.to(splitTitle.lines, {
            yPercent: 0,
            duration: 0.8,
            ease: "power3.inOut",
            stagger: 0.05,
            overwrite: "auto",
          });
        },
        onLeaveBack: () => {
          gsap.to(splitTitle.lines, {
            yPercent: 100,
            duration: 0.5,
            ease: "power3.inOut",
            stagger: 0.05,
            overwrite: "auto",
          });
        },
      });
    });

    ScrollTrigger.refresh();
  });
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

    const FOOTER_REVEAL = 1; // độ dài (đơn vị timeline) để footer trượt lên hết
    const FOOTER_DELAY = 1; // trễ thêm bao nhiêu đơn vị trước khi footer bắt đầu chạy

    // Tổng đơn vị timeline thật = số item + delay + đoạn footer chạy
    const totalUnits = items.length + FOOTER_DELAY + FOOTER_REVEAL;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top", // section pin đúng tại top top, không dịch chuyển
        end: `+=${totalUnits * 100}%`,
        pin: true,
        scrub: 1,
        // markers: true,
        onUpdate: (self) => {
          section.classList.toggle("show-bg", self.progress >= 0.1);
          if (header) {
            header.classList.toggle("header-text-light", self.progress >= 0);
          }
        },
        onEnter: () => {
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
          if (footer) {
            gsap.set(footer, { clearProps: "position,left,bottom,width" });
          }
          if (header) {
            header.classList.remove("header-text-light");
          }
        },
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
          { yPercent: percentParallax, duration: 1, ease: "power2.out" },
          pos,
        );
      }
    });

    // ----- Footer trượt lên đè phủ section, sau khi trễ FOOTER_DELAY -----
    if (footer) {
      tl.to(
        footer,
        {
          yPercent: 0,
          duration: FOOTER_REVEAL,
          ease: "power2.out",
          onStart: () => {
            section.classList.add("hide-title");
            animateFooterContent(footer);
          },
          onReverseComplete: () => {
            section.classList.remove("hide-title");
          },
        },
        items.length + FOOTER_DELAY, // bắt đầu trễ đúng FOOTER_DELAY sau item cuối
      );
    }
  });
}

function animateFooterContent(footer) {
  if (footer.dataset.contentAnimated) return;
  footer.dataset.contentAnimated = "true";

  const logos = footer.querySelectorAll(
    ".footer-logo-big, .footer-logo .logo-simple",
  );
  gsap.set(logos, { opacity: 0, y: 30 });
  gsap.to(logos, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.15,
  });

  document.fonts.ready.then(() => {
    const textEls = footer.querySelectorAll(
      ".address .label, .address .desc, .hotline .label, .hotline a, .footer-menu ul li a, .footer-terms ul li a, .copy-right p, .footer-author a",
    );
    if (!textEls.length) return;

    const splitTexts = SplitText.create(textEls, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });
    gsap.set(splitTexts.lines, { yPercent: 100 });
    gsap.to(splitTexts.lines, {
      yPercent: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.03,
    });
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
