export function customDropdown() {
  const dropdowns = document.querySelectorAll(
    ".dropdown-custom, .dropdown-custom-select",
  );
  if (!dropdowns.length) return;
  dropdowns.forEach((dropdown) => {
    const btnDropdown = dropdown.querySelector(".dropdown-custom-btn");
    const dropdownMenu = dropdown.querySelector(".dropdown-custom-menu");
    const dropdownItems = dropdown.querySelectorAll(".dropdown-custom-item");
    const valueSelect = dropdown.querySelector(".value-select");
    const displayText = dropdown.querySelector(".dropdown-custom-text");

    const isSelectType = dropdown.classList.contains("dropdown-custom-select");

    btnDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      dropdownMenu.classList.toggle("dropdown--active");
      btnDropdown.classList.toggle("--active");
    });

    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        if (isSelectType) {
          const optionText = item.textContent;
          displayText.textContent = optionText;
          dropdown.classList.add("selected");
        } else {
          const currentImgEl = valueSelect.querySelector("img");
          const currentImg = currentImgEl ? currentImgEl.src : "";
          const currentText = valueSelect.querySelector("span").textContent;
          const clickedHtml = item.innerHTML;

          valueSelect.innerHTML = clickedHtml;

          const isSelectTime = currentText.trim() === "Time";

          if (!isSelectTime) {
            if (currentImg) {
              item.innerHTML = `<span>${currentText}</span><img src="${currentImg}" alt="" />`;
            } else {
              item.innerHTML = `<span>${currentText}</span>`;
            }
          }
        }

        closeAllDropdowns();
      });
    });

    window.addEventListener("scroll", function () {
      if (dropdownMenu.closest(".header-lang")) {
        dropdownMenu.classList.remove("dropdown--active");
        btnDropdown.classList.remove("--active");
      }
    });
  });

  function closeAllDropdowns(exception) {
    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-custom-menu");
      const btn = dropdown.querySelector(".dropdown-custom-btn");

      if (!exception || dropdown !== exception) {
        menu.classList.remove("dropdown--active");
        btn.classList.remove("--active");
      }
    });
  }
}
// === BIẾN DÙNG CHUNG, ĐẶT NGOÀI CÙNG FILE (module scope) ===
let activeLightSections = new Set();

function updateHeaderLightClass(header) {
  if (activeLightSections.size > 0) {
    header.classList.add("header-text-light");
  } else {
    header.classList.remove("header-text-light");
  }
}
export function headerScroll() {
  const header = document.getElementById("header");
  if (!header) return null;

  const THRESHOLD = 100;

  const trigger = ScrollTrigger.create({
    start: "top top",
    end: 9999,
    onUpdate: (self) => {
      const currentScroll = self.scroll();

      if (currentScroll <= THRESHOLD) {
        header.classList.remove("scrolled");
      } else if (self.direction === 1) {
        header.classList.add("scrolled");
      }
    },
  });

  const lightSections = Array.from(
    document.querySelectorAll(".header-light"),
  ).filter((section) => !section.classList.contains("mission"));

  const lightTriggers = lightSections.map((section) => {
    // Với .reveal, section bị pin (animationReveal) nên chiều dài
    // scroll thật không phải "bottom" của chính nó, mà dài thêm theo
    // số item (items.length - 1) * 100%. Tính lại end cho đúng.
    const isReveal = section.classList.contains("reveal");
    let endValue = "bottom top+=20";

    if (isReveal) {
      const items = section.querySelectorAll(".reveal-item");
      if (items.length) {
        endValue = `+=${(items.length - 1) * 100}%`;
      }
    }

    return ScrollTrigger.create({
      trigger: section,
      start: "top top+=20",
      end: endValue,
      onEnter: () => {
        activeLightSections.add(section);
        updateHeaderLightClass(header);
      },
      onLeave: () => {
        activeLightSections.delete(section);
        updateHeaderLightClass(header);
      },
      onEnterBack: () => {
        activeLightSections.add(section);
        updateHeaderLightClass(header);
      },
      onLeaveBack: () => {
        activeLightSections.delete(section);
        updateHeaderLightClass(header);
      },
    });
  });

  return { trigger, lightTriggers };
}

/////// thêm class select-tab vào thì vẫn filter theo đúng type đó, không show hết item.
export function createFilterTab() {
  document.querySelectorAll(".filter-section").forEach((section) => {
    let result;

    const targetSelector = section.dataset.target;
    if (targetSelector) {
      result = document.querySelector(targetSelector);
    } else {
      result = section.querySelector(".filter-section-result");
      if (!result) {
        result = section.nextElementSibling;
        if (!result?.classList.contains("filter-section-result")) return;
      }
    }

    if (!result) return;
    //check select tab
    const isSelectTab = section.classList.contains("select-tab");
    const buttons = section.querySelectorAll(".filter-button[data-type]");

    const activeBtn = section.querySelector(".filter-button.active");
    if (activeBtn) {
      const activeType = activeBtn.dataset.type;
      if (activeType !== "all") {
        result.querySelectorAll(".filter-item").forEach((item) => {
          item.style.display = item.classList.contains(activeType)
            ? ""
            : "none";
        });
      }
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", function () {
        section
          .querySelectorAll(".filter-button")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const type = this.dataset.type;
        const items = result.querySelectorAll(".filter-item");

        gsap
          .timeline()
          .to(result, { autoAlpha: 0, duration: 0.3 })
          .call(() => {
            items.forEach((item) => {
              // Nếu là select-tab thì không có trường hợp "all" → luôn filter theo type
              if (!isSelectTab && type === "all") {
                item.style.display = "";
              } else {
                item.style.display = item.classList.contains(type)
                  ? ""
                  : "none";
              }
            });
          })
          .to(result, { autoAlpha: 1, duration: 0.3 });
      });
    });
  });
}

export function getDateLightPick() {
  var picker = new Lightpick({
    field: document.getElementById("datepicker"),
    minDate: new Date(),
    singleDate: false,
    numberOfMonths: 2,
    // lang: "en-US",
  });
}
// html : pin-stack > section
export function pinStackSections() {
  gsap.registerPlugin(ScrollTrigger);

  const sections = gsap.utils.toArray(".pin-stack > section");

  sections.forEach((section, index) => {
    // Section cuối cùng không cần pin (không có gì đè lên nó nữa)
    if (index === sections.length - 1) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });
  });
}
export function animationText() {
  gsap.registerPlugin(SplitText, ScrollTrigger);

  document.fonts.ready.then(() => {
    document.querySelectorAll(".el-txt-line").forEach((el) => {
      if (el.dataset.scriptInitialized) return;
      el.dataset.scriptInitialized = "true";

      let splitTitle;

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true, // tự động resplit khi resize (kể cả đổi lines) - cần GSAP 3.13+
        onSplit: (self) => {
          splitTitle = self;

          return gsap.fromTo(
            self.lines,
            { y: "100%" },
            {
              y: "0%",
              duration: 0.8,
              ease: "power3.inOut",
              stagger: 0.05,
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "bottom 85%",
                toggleActions: "play none none none",
              },
            },
          );
        },
      });
    });
  });
}
export function imageParallax() {
  document.querySelectorAll(".parallax-image").forEach((el) => {
    if (el.dataset.scriptInitialized) return;
    el.dataset.scriptInitialized = "true";

    const img = el.querySelector("img");
    if (!img) return;

    const percentParallax = 15;

    // dùng container cha gần nhất có kích thước ổn định làm trigger
    // để tất cả ảnh trong cùng 1 row đồng bộ progress với nhau
    const row = el.closest(".connect-row") || el;

    const tween = gsap.fromTo(
      img,
      { yPercent: `-${percentParallax}` },
      {
        yPercent: percentParallax,
        ease: "none",
        scrollTrigger: {
          trigger: row, // 👈 đổi từ el sang row (chung cho cả 2 ảnh)
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    el._parallaxST = tween.scrollTrigger;
  });
}
export function animationFade() {
  gsap.registerPlugin(ScrollTrigger);

  // ----- Fade đơn lẻ -----
  document.querySelectorAll(".el-fade").forEach((el) => {
    if (el.dataset.scriptInitialized) return;
    el.dataset.scriptInitialized = "true";

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 85%",
          toggleActions: "play none none none",
          // markers: true,
        },
      },
    );
  });

  // ----- Fade theo danh sách (stagger) -----
  document.querySelectorAll(".el-fade-list").forEach((listEl) => {
    if (listEl.dataset.scriptInitialized) return;
    listEl.dataset.scriptInitialized = "true";

    const items = listEl.children; // hoặc listEl.querySelectorAll(":scope > *")
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: listEl,
          start: "top 85%",
          end: "bottom 85%",
          toggleActions: "play none none none",
          // markers: true,
        },
      },
    );
  });
}
export function mousetail() {
  const allContainers = document.querySelectorAll(".mouse-trail");

  allContainers.forEach((mouseContainer) => {
    initTrailForContainer(mouseContainer);
  });

  function initTrailForContainer(mouseContainer) {
    const hiddenImages = mouseContainer.querySelectorAll(".hidden-images img");
    const images = Array.from(hiddenImages).map((img) => img.src);

    if (images.length === 0) return;

    let currentImageIndex = 0;
    let lastX = 0;
    let lastY = 0;

    const isMobile = window.innerWidth < 991;
    const distanceThreshold = isMobile ? 100 : 200;

    const IMG_WIDTH = isMobile ? 200 : 400;
    const IMG_HEIGHT = isMobile ? 150 : 270;

    const OFFSET_RANGE = 0;
    const ROTATE_RANGE = 0;

    if (isMobile) {
      // ================= MOBILE =================
      function createRandomFallingImage() {
        const img = document.createElement("img");
        img.classList.add("image-trail");
        img.src = images[currentImageIndex];

        img.style.width = `${IMG_WIDTH}px`;
        img.style.height = `${IMG_HEIGHT}px`;

        mouseContainer.appendChild(img);
        currentImageIndex = (currentImageIndex + 1) % images.length;

        const rect = mouseContainer.getBoundingClientRect();
        const maxX = Math.max(rect.width - IMG_WIDTH, 0);
        const maxY = Math.max(rect.height - IMG_HEIGHT, 0);

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        gsap.set(img, {
          x: randomX,
          y: randomY,
          scale: 0,
          opacity: 0,
          rotation: gsap.utils.random(-ROTATE_RANGE, ROTATE_RANGE),
        });

        gsap.to(img, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(img, {
          scale: 0.2,
          opacity: 0,
          duration: 1,
          delay: 0.8,
          ease: "power2.in",
          onComplete: () => img.remove(),
        });
      }

      function startRandomImageFall() {
        createRandomFallingImage();
        const nextDelay = Math.random() * 1000 + 700;
        setTimeout(startRandomImageFall, nextDelay);
      }

      startRandomImageFall();
    } else {
      // ================= DESKTOP =================
      mouseContainer.addEventListener("mousemove", (e) => {
        const rect = mouseContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - lastX;
        const dy = y - lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > distanceThreshold) {
          createTrail(x, y);
          lastX = x;
          lastY = y;
        }
      });
    }

    function createTrail(x, y) {
      const img = document.createElement("img");
      img.classList.add("image-trail");
      img.src = images[currentImageIndex];

      img.style.width = `${IMG_WIDTH}px`;
      img.style.height = `${IMG_HEIGHT}px`;

      mouseContainer.appendChild(img);
      currentImageIndex = (currentImageIndex + 1) % images.length;

      const offsetX = gsap.utils.random(-OFFSET_RANGE, OFFSET_RANGE);
      const offsetY = gsap.utils.random(-OFFSET_RANGE, OFFSET_RANGE);

      gsap.set(img, {
        x: x - IMG_WIDTH / 2 + offsetX,
        y: y - IMG_HEIGHT / 2 + offsetY,
        scale: 0,
        opacity: 0,
        rotation: gsap.utils.random(-ROTATE_RANGE, ROTATE_RANGE),
      });

      gsap.to(img, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(img, {
        scale: 0.2,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power2.in",
        onComplete: () => img.remove(),
      });
    }
  }
}
export function animationFooter() {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const footer = document.querySelector(".footer-container");
  if (!footer) return;
  if (footer.dataset.scriptInitialized) return;
  footer.dataset.scriptInitialized = "true";

  // ----- Logo: fade + trượt nhẹ lên -----
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
    scrollTrigger: {
      trigger: footer,
      start: "top 85%",
      toggleActions: "play none none none",
      markers: true,
    },
  });

  // ----- Text: hiệu ứng line (split theo dòng, trượt lên) -----
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
      scrollTrigger: {
        trigger: footer,
        start: "top 85%",
        toggleActions: "play none none none",
        // markers: true,
      },
    });
  });
}
