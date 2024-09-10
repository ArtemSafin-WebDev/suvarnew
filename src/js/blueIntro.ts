import Swiper from "swiper";
import "swiper/css";
import { EffectFade } from "swiper/modules";

export default function blueIntro() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".blue-intro")
  );

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    const slides = Array.from(
      element.querySelectorAll<HTMLElement>(".swiper-slide")
    );
    if (!container) return;

    const paginationElement = element.querySelector<HTMLElement>(
      ".blue-intro__slider-pagination"
    );
    slides.forEach(() => {
      const bullet = document.createElement("div");
      bullet.classList.add("blue-intro__slider-pagination-bullet");
      paginationElement?.appendChild(bullet);
    });
    const bullets = Array.from(
      element.querySelectorAll(".blue-intro__slider-pagination-bullet")
    );
    const setBullets = (swiper: Swiper) => {
      const activeIndex = swiper.realIndex;
      bullets.forEach((bullet, bulletIndex) => {
        bullet.classList.remove("large", "smaller", "small");
        if (bulletIndex === activeIndex) {
          bullet.classList.add("large");
          return;
        }
        const distanceToBullet = Math.abs(activeIndex - bulletIndex);
        if (distanceToBullet > 2 && distanceToBullet <= 3) {
          bullet.classList.add("smaller");
        } else if (distanceToBullet > 3) {
          bullet.classList.add("small");
        }
      });
    };

    const instance = new Swiper(container, {
      slidesPerView: 1,
      modules: [EffectFade],
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      init: false,
      on: {
        init: (swiper) => {
          setBullets(swiper);
        },
        slideChange: (swiper) => {
          setBullets(swiper);
        },
      },
    });

    instance.init();

    bullets.forEach((bullet, bulletIndex) => {
      bullet.addEventListener("click", (event) => {
        event.preventDefault();
        instance.slideTo(bulletIndex);
      });
    });
  });
}
