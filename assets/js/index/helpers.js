// export function bannerSlide() {
//   const storyEls = document.querySelectorAll(".swiper-story");
//   if (!storyEls.length) return;

//   const SCALE_DURATION = 4000;
//   const FADE_SPEED = 1000;

//   storyEls.forEach((storyEl) => {
//     const paginationEl = storyEl.querySelector(".swiper-pagination");
//     let started = false; // cờ đánh dấu đã chạy chưa

//     const swiperHero = new Swiper(storyEl, {
//       effect: "fade",
//       fadeEffect: { crossFade: true },
//       speed: FADE_SPEED,
//       loop: true,
//       simulateTouch: false,
//       autoplay: {
//         delay: SCALE_DURATION,
//         disableOnInteraction: false,
//         waitForTransition: false,
//       },
//       pagination: {
//         el: paginationEl,
//         clickable: true,
//         renderBullet: function (index, className) {
//           return `<span class="${className}"><div class="progress"></div></span>`;
//         },
//       },
//       on: {
//         init(swiper) {
//           updateProgress(swiper, 0);
//           swiper.autoplay.stop();
//         },
//         slideChange(swiper) {
//           updateProgress(swiper, 0);
//           runZoom(swiper);
//         },
//         autoplayTimeLeft(swiper, timeLeft, percentage) {
//           const progress = 1 - percentage;
//           updateProgress(swiper, progress);
//         },
//       },
//     });

//     // ----- Quan sát viewport (chỉ chạy 1 lần) -----
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && !started) {
//             started = true;
//             swiperHero.autoplay.start();
//             runZoom(swiperHero);
//             observer.unobserve(storyEl); // không cần theo dõi nữa
//           }
//         });
//       },
//       {
//         threshold: 0.3,
//       },
//     );

//     observer.observe(storyEl);
//   });

//   function updateProgress(swiper, progressValue) {
//     const realIndex = swiper.realIndex;
//     const bullets = swiper.pagination.bullets;

//     bullets.forEach((bullet, index) => {
//       const progressEl = bullet.querySelector(".progress");
//       if (!progressEl) return;

//       progressEl.classList.remove("is-active");
//       progressEl.style.animation = "none";

//       if (index < realIndex) {
//         progressEl.style.width = "100%";
//       } else if (index === realIndex) {
//         progressEl.style.width = `${Math.min(progressValue * 100, 100)}%`;
//       } else {
//         progressEl.style.width = "0%";
//       }
//     });
//   }

//   function resetAllImages(swiper) {
//     swiper.slides.forEach((slide) => {
//       const img = slide.querySelector("img");
//       if (img) {
//         img.classList.remove("kb-zoom");
//         img.style.animationDuration = "";
//       }
//     });
//   }

//   function runZoom(swiper) {
//     const activeImg = swiper.slides[swiper.activeIndex]?.querySelector("img");

//     resetAllImages(swiper);

//     if (activeImg) {
//       void activeImg.offsetWidth; // force reflow
//       activeImg.style.animationDuration = `${SCALE_DURATION}ms`;
//       activeImg.classList.add("kb-zoom");
//     }
//   }
// }
export function bannerSlide() {
  gsap.registerPlugin(ScrollTrigger);

  const storyEls = document.querySelectorAll(".swiper-story");
  if (!storyEls.length) return;

  const SCALE_DURATION = 4000;
  const FADE_SPEED = 1000;

  storyEls.forEach((storyEl) => {
    const paginationEl = storyEl.querySelector(".swiper-pagination");
    let started = false; // cờ đánh dấu đã chạy chưa

    const swiperHero = new Swiper(storyEl, {
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: FADE_SPEED,
      loop: true,
      simulateTouch: false,
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

    // ----- Kích hoạt bằng ScrollTrigger (chỉ chạy 1 lần) -----
    ScrollTrigger.create({
      trigger: storyEl,
      start: "top 70%", // tương đương threshold 0.3 của IntersectionObserver
      once: true, // tự động chỉ bắn onEnter đúng 1 lần rồi kill trigger
      onEnter: () => {
        if (started) return;
        started = true;
        swiperHero.autoplay.start();
        runZoom(swiperHero);
      },
    });
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
export function fadeSlide() {
  if (window.innerWidth > 992) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const fadeEls = document.querySelectorAll(".swiper-fade-story");
  if (!fadeEls.length) return;

  const SCALE_DURATION = 4000;
  const FADE_SPEED = 1000;

  fadeEls.forEach((fadeEl) => {
    const paginationEl = fadeEl.querySelector(".swiper-pagination");
    const titleListEl = fadeEl
      .closest(".title-fade-change")
      ?.querySelector(".swiper-title-list");
    const titleEls = titleListEl
      ? Array.from(titleListEl.querySelectorAll(".tilte-item"))
      : [];

    // ----- Split từng title 1 lần duy nhất, lưu lại lines -----
    const titleSplits = titleEls.map((titleEl) => {
      const split = SplitText.create(titleEl, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
      });
      gsap.set(split.lines, { y: "100%" }); // ẩn ban đầu
      return split;
    });

    let activeIndex = -1;
    let started = false;

    const swiperFade = new Swiper(fadeEl, {
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: FADE_SPEED,
      loop: true,
      simulateTouch: false,
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
          updateTitle(swiper);
          swiper.autoplay.stop();
        },
        slideChange(swiper) {
          updateProgress(swiper, 0);
          updateTitle(swiper);
          runZoom(swiper);
        },
        autoplayTimeLeft(swiper, timeLeft, percentage) {
          const progress = 1 - percentage;
          updateProgress(swiper, progress);
        },
      },
    });

    ScrollTrigger.create({
      trigger: fadeEl,
      start: "top 70%",
      once: true,
      onEnter: () => {
        if (started) return;
        started = true;
        swiperFade.autoplay.start();
        runZoom(swiperFade);
      },
    });

    function updateTitle(swiper) {
      if (!titleSplits.length) return;
      const realIndex = swiper.realIndex;

      if (realIndex === activeIndex) return; // tránh chạy lại nếu chưa đổi index

      // Ẩn title cũ (nếu có)
      if (activeIndex !== -1 && titleSplits[activeIndex]) {
        const oldTitleEl = titleEls[activeIndex];
        const oldLines = titleSplits[activeIndex].lines;

        gsap.to(oldLines, {
          y: "-100%",
          duration: 0.5,
          ease: "power3.inOut",
          stagger: 0.03,
          onComplete: () => {
            oldTitleEl.classList.remove("active");
            gsap.set(oldLines, { y: "100%" }); // reset về trạng thái ẩn ban đầu
          },
        });
      }

      // Hiện title mới
      const newTitleEl = titleEls[realIndex];
      const newLines = titleSplits[realIndex]?.lines;

      if (newTitleEl && newLines) {
        newTitleEl.classList.add("active");
        gsap.set(newLines, { y: "100%" });
        gsap.to(newLines, {
          y: "0%",
          duration: 0.7,
          ease: "power3.inOut",
          stagger: 0.05,
          delay: activeIndex === -1 ? 0 : 0.2, // delay nhẹ để chờ title cũ thoát ra (bỏ nếu muốn chạy đồng thời)
        });
      }

      activeIndex = realIndex;
    }
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
      void activeImg.offsetWidth;
      activeImg.style.animationDuration = `${SCALE_DURATION}ms`;
      activeImg.classList.add("kb-zoom");
    }
  }
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
  const isMobile = window.innerWidth <= 991; // chỉnh breakpoint theo project của bạn
  const multiplier = isMobile ? 0.5 : 1; // 0.6 = scroll ngắn hơn ~40%, chỉnh số này tùy ý

  sliderWrapper.style.height = `${
    window.innerHeight * (slides.length + multiplier)
  }px`;

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
// export function stackedSections() {
//   const sections = document.querySelectorAll('[class*="pin-section-"]');
//   if (sections.length === 0) return;

//   sections.forEach((section, index) => {
//     if (index === sections.length - 1) return;

//     const isMission = section.classList.contains("mission");

//     if (isMission) {
//       // Section mission cần pin LÂU HƠN (đủ chỗ cho carousel bên trong chuyển item)
//       const items = section.querySelectorAll(".mission-visual-item");
//       const extraScroll = window.innerHeight * items.length; // khoảng cuộn thêm cho carousel

//       ScrollTrigger.create({
//         trigger: section,
//         start: "top top",
//         end: `+=${extraScroll}`, // pin lâu hơn bình thường
//         pin: true,
//         pinSpacing: false,
//         onUpdate: (self) => {
//           missionUpdateItem(self.progress, items);
//         },
//       });
//     } else {
//       // Các section khác giữ nguyên logic pin cũ
//       ScrollTrigger.create({
//         trigger: section,
//         start: "top top",
//         end: "bottom top",
//         pin: true,
//         pinSpacing: false,
//       });
//     }
//   });

//   requestAnimationFrame(() => {
//     ScrollTrigger.refresh();
//   });
// }
export function zoomImage() {
  const elements = document.querySelectorAll(".zoomImage");
  if (elements.length === 0) return;

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 1.2,
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
gsap.registerPlugin(SplitText, ScrollTrigger);

// === FUNCTION 1: PIN CHUNG CHO CÁC SECTION STACKED (TRỪ MISSION) ===
export function stackedSections() {
  const sections = document.querySelectorAll('[class*="pin-section-"]');
  if (sections.length === 0) return;

  ScrollTrigger.config({ ignoreMobileResize: true });

  sections.forEach((section, index) => {
    if (index === sections.length - 1) return;
    if (section.classList.contains("mission")) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true, // tính lại đúng khi có refresh thật sự (đổi orientation, resize thật)
    });
  });
}

export function missionSection() {
  const section = document.querySelector(".mission");
  const items = document.querySelectorAll(".mission-visual-item");
  const header = document.getElementById("header");
  const cols = document.querySelectorAll(".mission-col");
  if (window.innerWidth < 991) return;
  if (!section || items.length === 0) return;

  let activeIndex = 0;
  let isAnimating = false;
  const splitInstances = [];

  const bgYSetters = Array.from(cols).map((col) =>
    gsap.quickSetter(col, "backgroundPositionY", "%"),
  );

  items.forEach((item, index) => {
    const img = item.querySelector(".mission-visual-img img");
    const title = item.querySelector(".mission-visual-content h3");
    const desc = item.querySelector(".mission-visual-content .desc");

    const splitTitle = SplitText.create(title, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });
    const splitDesc = SplitText.create(desc, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });

    splitInstances.push({ splitTitle, splitDesc });

    if (index === 0) {
      item.classList.add("active");
      gsap.set(img, { scale: 1, opacity: 1 });
      gsap.set([splitTitle.lines, splitDesc.lines], { y: "0%" });
    } else {
      item.classList.remove("active");
      gsap.set(item, { display: "none" });
      gsap.set(img, { scale: 1.08, opacity: 0 });
      gsap.set([splitTitle.lines, splitDesc.lines], { y: "100%" });
    }
  });

  function showItem(index) {
    const item = items[index];
    const img = item.querySelector(".mission-visual-img img");
    const { splitTitle, splitDesc } = splitInstances[index];

    item.classList.add("active");
    gsap.set(item, { display: "block" });

    gsap.fromTo(
      img,
      { opacity: 0, scale: 1.08 },
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
    );
    gsap.fromTo(
      splitTitle.lines,
      { y: "100%" },
      { y: "0%", duration: 0.8, ease: "power3.inOut", stagger: 0.05 },
    );
    gsap.fromTo(
      splitDesc.lines,
      { y: "100%" },
      {
        y: "0%",
        duration: 0.8,
        ease: "power3.inOut",
        stagger: 0.05,
        delay: 0.05,
      },
    );
  }

  function hideItem(index) {
    const item = items[index];
    const img = item.querySelector(".mission-visual-img img");
    const { splitTitle, splitDesc } = splitInstances[index];

    item.classList.remove("active");
    gsap.to(img, { opacity: 0, scale: 1.08, duration: 0.6, ease: "power2.in" });
    gsap.to([splitTitle.lines, splitDesc.lines], {
      y: "-100%",
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(item, { display: "none" });
        gsap.set([splitTitle.lines, splitDesc.lines], { y: "100%" });
      },
    });
  }

  const extraScroll = window.innerHeight * items.length;

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: `+=${extraScroll}`,
    pin: true,
    pinSpacing: true,
    scrub: true, // đảm bảo mượt theo tốc độ cuộn thật
    onEnter: () => header?.classList.add("header-text-light"),
    onEnterBack: () => header?.classList.add("header-text-light"),
    onUpdate: (self) => {
      const currentIndex = Math.min(
        Math.floor(self.progress * items.length),
        items.length - 1,
      );

      if (currentIndex !== activeIndex && !isAnimating) {
        isAnimating = true;
        hideItem(activeIndex);
        showItem(currentIndex);
        activeIndex = currentIndex;

        gsap.delayedCall(0.5, () => {
          isAnimating = false;
        });
      }

      // background chạy theo % tiến trình cuộn (0 -> 100)
      const bgY = self.progress * 100;
      bgYSetters.forEach((setter) => setter(bgY));
    },
  });
}

export function connectAnimation() {
  if (window.innerWidth < 991) return;
  const firstRow = document.querySelector(".connect-row:not(.three-col)");
  const threeColRow = document.querySelector(".connect-row.three-col");

  if (!firstRow || !threeColRow) return;

  const firstCol = firstRow.querySelector(".connect-col:first-child");
  const parallaxEls = firstRow.querySelectorAll(".parallax-image");

  // --- Tween cho firstCol ---
  gsap.set(firstCol, { y: 150 });

  gsap.to(firstCol, {
    y: 0,
    ease: "none",
    scrollTrigger: {
      trigger: firstRow,
      start: "top 80%",
      end: "top 20%",
      scrub: true,
    },
  });

  // --- Freeze / resume parallax khi pin ---
  const freezeParallax = () => {
    parallaxEls.forEach((el) => {
      if (el._parallaxST) el._parallaxST.disable(false);
    });
  };

  const resumeParallax = () => {
    parallaxEls.forEach((el) => {
      if (el._parallaxST) el._parallaxST.enable();
    });
  };

  // --- Dùng getBoundingClientRect để lấy chiều cao chính xác (subpixel) ---
  // + cộng thêm 1-2px buffer để đảm bảo không hở dù có sai số làm tròn nào khác
  const getPinEndDistance = () => {
    const rect = threeColRow.getBoundingClientRect();
    return Math.ceil(rect.height) + 20; // +2px buffer an toàn
  };

  // --- Pin firstRow ---
  ScrollTrigger.create({
    trigger: firstRow,
    start: "top top",
    end: () => "+=" + getPinEndDistance(),
    pin: true,
    pinSpacing: false,
    onEnter: freezeParallax,
    onEnterBack: freezeParallax,
    onLeave: resumeParallax,
    onLeaveBack: resumeParallax,
  });

  // --- Refresh ScrollTrigger sau khi ảnh + font load xong ---
  const waitForImages = new Promise((resolve) => {
    const imgs = firstRow.querySelectorAll("img");
    if (!imgs.length) return resolve();

    let loaded = 0;
    const check = () => {
      loaded++;
      if (loaded === imgs.length) resolve();
    };

    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        check();
      } else {
        img.addEventListener("load", check, { once: true });
        img.addEventListener("error", check, { once: true });
      }
    });
  });

  const waitForFonts = document.fonts
    ? document.fonts.ready
    : Promise.resolve();

  Promise.all([waitForImages, waitForFonts]).then(() => {
    ScrollTrigger.refresh();
  });

  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true },
  );
}
