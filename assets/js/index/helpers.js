export function bannerSlide() {
  const storyEls = document.querySelectorAll(".swiper-story");
  if (!storyEls.length) return;

  const SCALE_DURATION = 4000;
  const FADE_SPEED = 1000;

  storyEls.forEach((storyEl) => {
    const paginationEl = storyEl.querySelector(".swiper-pagination");

    const swiperHero = new Swiper(storyEl, {
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: FADE_SPEED,
      loop: true,
      autoplay: {
        delay: SCALE_DURATION,
        disableOnInteraction: false,
        waitForTransition: false,
      },
      pagination: {
        el: paginationEl,
        clickable: true,
        renderBullet: function (index, className) {
          return `<span class="${className}"><div class="progress"></div></span>`;
        },
      },
      on: {
        init(swiper) {
          updateProgress(swiper, 0);
          // Không chạy zoom/autoplay ngay, chờ vào viewport
          swiper.autoplay.stop();
        },
        slideChange(swiper) {
          updateProgress(swiper, 0);
          runZoom(swiper);
        },
        autoplayTimeLeft(swiper, timeLeft, percentage) {
          const progress = 1 - percentage;
          updateProgress(swiper, progress);
        },
      },
    });

    // ----- Quan sát viewport -----
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            swiperHero.autoplay.start();
            runZoom(swiperHero);
          } else {
            swiperHero.autoplay.stop();
            // reset ảnh để lần sau vào lại chạy zoom từ đầu
            resetAllImages(swiperHero);
          }
        });
      },
      {
        threshold: 0.3, // 30% swiper hiện ra là bắt đầu chạy, chỉnh tùy ý
      },
    );

    observer.observe(storyEl);
  });

  function updateProgress(swiper, progressValue) {
    const realIndex = swiper.realIndex;
    const bullets = swiper.pagination.bullets;

    bullets.forEach((bullet, index) => {
      const progressEl = bullet.querySelector(".progress");
      if (!progressEl) return;

      progressEl.classList.remove("is-active");
      progressEl.style.animation = "none";

      if (index < realIndex) {
        progressEl.style.width = "100%";
      } else if (index === realIndex) {
        progressEl.style.width = `${Math.min(progressValue * 100, 100)}%`;
      } else {
        progressEl.style.width = "0%";
      }
    });
  }

  function resetAllImages(swiper) {
    swiper.slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img) {
        img.classList.remove("kb-zoom");
        img.style.animationDuration = "";
      }
    });
  }

  function runZoom(swiper) {
    const activeImg = swiper.slides[swiper.activeIndex]?.querySelector("img");

    resetAllImages(swiper);

    if (activeImg) {
      void activeImg.offsetWidth; // force reflow
      activeImg.style.animationDuration = `${SCALE_DURATION}ms`;
      activeImg.classList.add("kb-zoom");
    }
  }
}
export function growthSection() {
  if (!document.querySelector(".growth")) return;

  gsap.registerPlugin(ScrollTrigger);

  // Pin hero lại tại chỗ trong khi growth cuộn lên đè lên trên
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: "+=100%", // hero đứng yên trong khoảng 1 viewport height cuộn
    pin: true,
    pinSpacing: false, // không chừa khoảng trống, để growth đè ngay lên
  });

  // Growth section: cho nó trượt từ dưới lên, đè lên hero
  gsap.fromTo(
    ".growth",
    {
      yPercent: 0, // vị trí ban đầu (đứng bình thường theo luồng document)
    },
    {
      yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".growth",
        start: "top bottom", // bắt đầu khi growth chạm đáy viewport
        end: "top top", // kết thúc khi growth chạm đỉnh viewport
        scrub: true,
        // markers: true,
      },
    },
  );
}
// export function sliderScale() {
//   // === LẤY DỮ LIỆU SLIDES TỪ HTML ===
//   const sliderDataContainer = document.querySelector(".slider-data");
//   if (!sliderDataContainer) return;

//   const sliderItems = sliderDataContainer.querySelectorAll(".slider-item");
//   if (sliderItems.length === 0) return;

//   const slides = Array.from(sliderItems)
//     .map((item) => {
//       const img = item.querySelector(".image img");
//       const valueEl = item.querySelector(".value");
//       return {
//         image: img ? img.src : "",
//         value: valueEl ? valueEl.innerHTML.trim() : "",
//       };
//     })
//     .filter((slide) => slide.image && slide.value);

//   if (slides.length === 0) return;

//   // === PRELOAD TẤT CẢ ẢNH TRƯỚC ===
//   slides.forEach((slide) => {
//     const preloadImg = new Image();
//     preloadImg.src = slide.image;
//   });

//   // === DOM ELEMENTS ===
//   const sliderImages = document.querySelector(".slider-images");
//   const sliderIndices = document.querySelector(".slider-indices");
//   const sliderIndicator = document.querySelector(".slider-indicator");

//   // === STATE ===
//   let activeSlide = 0;
//   let isAnimating = false;

//   // === TÍNH KHOẢNG CÁCH PIN ===
//   const pinDistance = window.innerHeight * slides.length;

//   // === TẠO CHỈ SỐ (INDICES) ===
//   function createIndices() {
//     sliderIndices.innerHTML = "";

//     const indicators = [];

//     slides.forEach((slide, index) => {
//       const indicator = document.createElement("p");
//       indicator.dataset.index = index;
//       indicator.innerHTML = `<span class="index">${slide.value}</span>`;
//       sliderIndices.appendChild(indicator);
//       indicators.push(indicator);

//       const num = indicator.querySelector(".index");
//       if (index === 0) {
//         num.classList.add("active");
//       }
//     });

//     return indicators;
//   }

//   // === ANIMATION: KHỐI INDICATOR CHẠY TỪ BOTTOM LÊN TOP, SUỐT QUÁ TRÌNH CUỘN ===
//   function setupIndicatorScrub() {
//     gsap.set(sliderIndicator, { top: "125%" });

//     gsap.to(sliderIndicator, {
//       top: "50%",
//       ease: "none",
//       scrollTrigger: {
//         trigger: ".slider",
//         start: "top top",
//         end: `+=${pinDistance}px`,
//         scrub: true,
//       },
//     });
//   }

//   // === HIỆU ỨNG CHUYỂN ẢNH ===
//   function animateNewSlide(index, onComplete) {
//     const newImg = document.createElement("img");
//     newImg.alt = `Slide ${index + 1}`;

//     gsap.set(newImg, { opacity: 0, scale: 1.08 });
//     sliderImages.appendChild(newImg);

//     const startFade = () => {
//       gsap.to(newImg, {
//         opacity: 1,
//         duration: 0.6,
//         ease: "power2.out",
//         overwrite: "auto",
//         onComplete: () => {
//           if (onComplete) onComplete();
//         },
//       });
//       gsap.to(newImg, {
//         scale: 1,
//         duration: 1,
//         ease: "power2.out",
//         overwrite: "auto",
//       });

//       const allImgs = sliderImages.querySelectorAll("img");
//       if (allImgs.length > 3) {
//         const removeCount = allImgs.length - 3;
//         for (let i = 0; i < removeCount; i++) {
//           gsap.killTweensOf(allImgs[i]);
//           allImgs[i].remove();
//         }
//       }
//     };

//     if (newImg.complete && newImg.naturalWidth !== 0) {
//       startFade();
//     } else {
//       newImg.onload = startFade;
//       newImg.onerror = () => {
//         if (onComplete) onComplete();
//       };
//     }

//     newImg.src = slides[index].image;

//     animateIndicators(index);
//   }

//   // === HIỆU ỨNG CHỈ SỐ KHI ĐỔI SLIDE (active state) ===
//   function animateIndicators(index) {
//     const indicators = sliderIndices.querySelectorAll("p");
//     indicators.forEach((el, i) => {
//       const num = el.querySelector(".index");
//       if (i === index) {
//         num.classList.add("active");
//       } else {
//         num.classList.remove("active");
//       }
//     });
//   }

//   // === KHỞI TẠO ===
//   createIndices();
//   setupIndicatorScrub();
//   animateNewSlide(0);

//   // === SCROLLTRIGGER CHÍNH (PIN + CHUYỂN SLIDE) ===
//   ScrollTrigger.create({
//     trigger: ".slider",
//     start: "top top",
//     end: `+=${pinDistance}px`,
//     scrub: 1,
//     pin: true,
//     pinSpacing: true,
//     onUpdate: (self) => {
//       const currentSlide = Math.floor(self.progress * slides.length);
//       if (
//         activeSlide !== currentSlide &&
//         currentSlide < slides.length &&
//         !isAnimating
//       ) {
//         activeSlide = currentSlide;
//         isAnimating = true;
//         animateNewSlide(activeSlide, () => {
//           isAnimating = false;
//         });
//       }
//     },
//   });
//   requestAnimationFrame(() => {
//     ScrollTrigger.refresh();
//   });
// }
export function sliderScale() {
  const sliderDataContainer = document.querySelector(".slider-data");
  if (!sliderDataContainer) return;

  const sliderItems = sliderDataContainer.querySelectorAll(".slider-item");
  if (sliderItems.length === 0) return;

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

  if (slides.length === 0) return;

  slides.forEach((slide) => {
    const preloadImg = new Image();
    preloadImg.src = slide.image;
  });

  const sliderWrapper = document.querySelector(".slider-wrapper");
  const sliderImages = document.querySelector(".slider-images");
  const sliderIndices = document.querySelector(".slider-indices");
  const sliderIndicator = document.querySelector(".slider-indicator");

  // Cộng thêm 1 viewport height để bù cho chiều cao của chính phần tử sticky
  sliderWrapper.style.height = `${window.innerHeight * (slides.length + 1)}px`;

  let activeSlide = 0;
  let isAnimating = false;

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
      if (index === 0) num.classList.add("active");
    });

    return indicators;
  }

  function animateNewSlide(index, onComplete) {
    const newImg = document.createElement("img");
    newImg.alt = `Slide ${index + 1}`;

    gsap.set(newImg, { opacity: 0, scale: 1.08 });
    sliderImages.appendChild(newImg);

    const startFade = () => {
      gsap.to(newImg, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => onComplete && onComplete(),
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
      newImg.onerror = () => onComplete && onComplete();
    }

    newImg.src = slides[index].image;
    animateIndicators(index);
  }

  function animateIndicators(index) {
    const indicators = sliderIndices.querySelectorAll("p");
    indicators.forEach((el, i) => {
      const num = el.querySelector(".index");
      if (i === index) num.classList.add("active");
      else num.classList.remove("active");
    });
  }

  createIndices();
  gsap.set(sliderIndicator, { top: "125%" });
  animateNewSlide(0);

  ScrollTrigger.create({
    trigger: sliderWrapper,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      gsap.set(sliderIndicator, {
        top: gsap.utils.interpolate("125%", "50%", self.progress),
      });

      const currentSlide = Math.floor(self.progress * slides.length);
      const clampedSlide = Math.min(currentSlide, slides.length - 1);

      if (activeSlide !== clampedSlide && !isAnimating) {
        activeSlide = clampedSlide;
        isAnimating = true;
        animateNewSlide(activeSlide, () => {
          isAnimating = false;
        });
      }
    },
  });
}
export function stackedSections() {
  const sections = document.querySelectorAll('[class*="pin-section-"]');

  if (sections.length === 0) return;

  sections.forEach((section, index) => {
    if (index === sections.length - 1) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });
  });

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
export function zoomImage() {
  const elements = document.querySelectorAll(".zoomImage");
  if (elements.length === 0) return;

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 1.08,
        duration: 1.5,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          // markers: true,
        },
      },
    );
  });
}
