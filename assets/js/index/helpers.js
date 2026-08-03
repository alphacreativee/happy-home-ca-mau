// export các function trang home
export function bannerSlide() {
  if (!document.querySelector(".swiper-hero")) return;
  var swiperHero = new Swiper(".swiper-hero", {
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    speed: 2000,
    loop: true,
    autoplay: {
      delay: 2000,
    },
    pagination: {
      el: ".swiper-pagination",
    },
  });
}
