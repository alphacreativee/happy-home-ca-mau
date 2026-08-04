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
