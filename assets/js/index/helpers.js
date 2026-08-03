export function bannerSlide() {
  if (!document.querySelector(".swiper-hero")) return;

  const SCALE_DURATION = 4000;
  const FADE_SPEED = 1000;

  const swiperHero = new Swiper(".swiper-hero", {
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
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return `<span class="${className}"><div class="progress"></div></span>`;
      },
    },
    on: {
      init(swiper) {
        updateProgress(swiper, 0);
        runZoom(swiper);
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
