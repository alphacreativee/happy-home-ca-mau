// export các function trang home
export function bannerSlide() {
  if (!document.querySelector(".swiper-hero")) return;

  const SCALE_DURATION = 3000;
  const FADE_SPEED = 1000;

  var swiperHero = new Swiper(".swiper-hero", {
    effect: "fade",
    fadeEffect: { crossFade: true },
    speed: FADE_SPEED,
    loop: true,
    autoplay: {
      delay: SCALE_DURATION,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return `<span class="${className}"><div class="progress"></div></span>`;
      },
    },
    on: {
      init: function (swiper) {
        resetAllProgress(swiper);
        runEffects(swiper);
      },
      slideChangeTransitionEnd: function (swiper) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            runEffects(swiper);
          });
        });
      },
    },
  });

  function resetAllProgress(swiper) {
    swiper.pagination.bullets.forEach((bullet) => {
      const progressEl = bullet.querySelector(".progress");
      if (progressEl) {
        progressEl.classList.remove("is-active");
        progressEl.style.animation = "none";
        progressEl.style.width = "0%";
      }
    });
  }

  function runEffects(swiper) {
    const activeImg = swiper.slides[swiper.activeIndex].querySelector("img");
    const activeBullet = swiper.pagination.bullets[swiper.realIndex];
    const progressEl = activeBullet?.querySelector(".progress");

    // Reset image zoom
    if (activeImg) {
      activeImg.classList.remove("kb-zoom");
    }

    // Reset progress khi về slide đầu (loop)
    if (swiper.realIndex === 0) {
      resetAllProgress(swiper);
    }

    // Reset progress của bullet hiện tại
    if (progressEl) {
      progressEl.classList.remove("is-active");
      progressEl.style.animation = "none";
      progressEl.style.width = "0%";
      void progressEl.offsetWidth; // force reflow
    }

    // Chạy đồng thời cả progress + zoom
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Progress
        if (progressEl) {
          progressEl.style.animation = "";
          progressEl.style.width = "";
          progressEl.style.animationDuration = `${SCALE_DURATION}ms`;
          progressEl.classList.add("is-active");
        }

        // Image zoom – bắt đầu cùng lúc, cùng thời gian
        if (activeImg) {
          activeImg.style.animationDuration = `${SCALE_DURATION}ms`;
          activeImg.classList.add("kb-zoom");
        }
      });
    });
  }
}
