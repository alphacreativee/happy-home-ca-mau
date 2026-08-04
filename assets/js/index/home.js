// export các function dùng cho home
import { customDropdown, createFilterTab } from "../../main/js/global.min.js";
import { bannerSlide, growthSection } from "../../main/js/helpers.min.js";
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
document.addEventListener("DOMContentLoaded", () => {
  // === LẤY DỮ LIỆU SLIDES TỪ HTML ===
  const sliderDataContainer = document.querySelector(".slider-data");
  if (!sliderDataContainer) {
    console.error("Không tìm thấy .slider-data");
    return;
  }

  const sliderItems = sliderDataContainer.querySelectorAll(".slider-item");
  if (sliderItems.length === 0) {
    console.error("Không có .slider-item nào trong .slider-data");
    return;
  }

  const slides = Array.from(sliderItems)
    .map((item) => {
      const img = item.querySelector(".image img");
      const valueEl = item.querySelector(".value");
      return {
        image: img ? img.src : "",
        value: valueEl ? valueEl.innerHTML.trim() : "",
      };
    })
    .filter((slide) => slide.image && slide.value);

  if (slides.length === 0) {
    console.error("Không có slide hợp lệ nào (thiếu ảnh hoặc giá trị).");
    return;
  }

  // === PRELOAD TẤT CẢ ẢNH TRƯỚC ===
  slides.forEach((slide) => {
    const preloadImg = new Image();
    preloadImg.src = slide.image;
  });

  // === DOM ELEMENTS ===
  const sliderImages = document.querySelector(".slider-images");
  const sliderIndices = document.querySelector(".slider-indices");
  const sliderIndicator = document.querySelector(".slider-indicator");

  // === STATE ===
  let activeSlide = 0;
  let isAnimating = false;

  // === TÍNH KHOẢNG CÁCH PIN ===
  const pinDistance = window.innerHeight * slides.length;

  // === TẠO CHỈ SỐ (INDICES) ===
  function createIndices() {
    sliderIndices.innerHTML = "";

    const indicators = [];

    slides.forEach((slide, index) => {
      const indicator = document.createElement("p");
      indicator.dataset.index = index;
      indicator.innerHTML = `<span class="index">${slide.value}</span>`;
      sliderIndices.appendChild(indicator);
      indicators.push(indicator);

      const num = indicator.querySelector(".index");
      if (index === 0) {
        num.classList.add("active");
      }
    });

    return indicators;
  }

  // === ANIMATION: KHỐI INDICATOR CHẠY TỪ BOTTOM LÊN TOP, SUỐT QUÁ TRÌNH CUỘN ===
  function setupIndicatorScrub() {
    gsap.set(sliderIndicator, { top: "125%" });

    gsap.to(sliderIndicator, {
      top: "50%",
      ease: "none",
      scrollTrigger: {
        trigger: ".slider",
        start: "top top",
        end: `+=${pinDistance}px`,
        scrub: true,
      },
    });
  }

  // === HIỆU ỨNG CHUYỂN ẢNH ===
  function animateNewSlide(index, onComplete) {
    const newImg = document.createElement("img");
    newImg.alt = `Slide ${index + 1}`;

    gsap.set(newImg, { opacity: 0, scale: 1.1 });
    sliderImages.appendChild(newImg);

    const startFade = () => {
      gsap.to(newImg, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });
      gsap.to(newImg, {
        scale: 1,
        duration: 1,
        ease: "power2.out",
        overwrite: "auto",
      });

      const allImgs = sliderImages.querySelectorAll("img");
      if (allImgs.length > 3) {
        const removeCount = allImgs.length - 3;
        for (let i = 0; i < removeCount; i++) {
          gsap.killTweensOf(allImgs[i]);
          allImgs[i].remove();
        }
      }
    };

    if (newImg.complete && newImg.naturalWidth !== 0) {
      startFade();
    } else {
      newImg.onload = startFade;
      newImg.onerror = () => {
        if (onComplete) onComplete();
      };
    }

    newImg.src = slides[index].image;

    animateIndicators(index);
  }

  // === HIỆU ỨNG CHỈ SỐ KHI ĐỔI SLIDE (active state) ===
  function animateIndicators(index) {
    const indicators = sliderIndices.querySelectorAll("p");
    indicators.forEach((el, i) => {
      const num = el.querySelector(".index");
      if (i === index) {
        num.classList.add("active");
      } else {
        num.classList.remove("active");
      }
    });
  }

  // === KHỞI TẠO ===
  createIndices();
  setupIndicatorScrub();
  animateNewSlide(0);

  // === SCROLLTRIGGER CHÍNH (PIN + CHUYỂN SLIDE) ===
  ScrollTrigger.create({
    trigger: ".slider",
    start: "top top",
    end: `+=${pinDistance}px`,
    scrub: 1,
    pin: true,
    pinSpacing: true,
    onUpdate: (self) => {
      const currentSlide = Math.floor(self.progress * slides.length);
      if (
        activeSlide !== currentSlide &&
        currentSlide < slides.length &&
        !isAnimating
      ) {
        activeSlide = currentSlide;
        isAnimating = true;
        animateNewSlide(activeSlide, () => {
          isAnimating = false;
        });
      }
    },
  });
});
