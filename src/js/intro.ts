import gsap from "gsap";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { Controller, EffectFade } from "swiper/modules";

export default function intro() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".intro"));
  const mql = window.matchMedia("(max-width: 640px)");
  elements.forEach((element) => {
    const sliderItems = Array.from(
      element.querySelectorAll<HTMLElement>(".intro__slider-item")
    );

    sliderItems.forEach((item) => {
      const bgContainer = item.querySelector<HTMLElement>(
        ".intro__bg-slider-wrapper .swiper"
      );
      const mainContainer = item.querySelector<HTMLElement>(
        ".intro__main-slider-wrapper .swiper"
      );
      const cursor = element.querySelector<HTMLElement>(
        ".intro__slider-item-cursor"
      );
      const slides = Array.from(
        element.querySelectorAll(".intro__main-slider-wrapper .swiper-slide")
      );
      const paginationElement = element.querySelector<HTMLElement>(
        ".intro__slider-pagination"
      );
      slides.forEach(() => {
        const bullet = document.createElement("div");
        bullet.classList.add("intro__slider-pagination-bullet");
        paginationElement?.appendChild(bullet);
      });
      const bullets = Array.from(
        element.querySelectorAll(".intro__slider-pagination-bullet")
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
      let cursorDirection = "right";
      if (!bgContainer || !mainContainer) return;

      const bgInstance = new Swiper(bgContainer, {
        slidesPerView: 1,
        speed: 600,
        modules: [Controller],
        loop: true,
      });

      const mainInstance = new Swiper(mainContainer, {
        slidesPerView: 1,
        speed: 600,
        modules: [EffectFade, Controller],
        effect: "fade",
        loop: true,
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

      mainInstance.init();

      mainInstance.controller.control = bgInstance;
      bgInstance.controller.control = mainInstance;
      bullets.forEach((bullet, bulletIndex) => {
        bullet.addEventListener("click", (event) => {
          event.preventDefault();
          mainInstance.slideToLoop(bulletIndex);
        });
      });

      if (cursor) {
        // let xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" }),
        //   yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

        let rect = item.getBoundingClientRect();

        window.addEventListener("resize", () => {
          rect = item.getBoundingClientRect();
        });

        item.addEventListener("mousemove", (event) => {
          const e = event as MouseEvent;
          const x = e.pageX - rect.left;
          const y = e.pageY - rect.top;

          console.log({
            x,
            y,
            width: rect.width,
          });
          if (x > rect.width / 2) {
            cursorDirection = "right";
            cursor.classList.remove("flipped");
          } else {
            cursorDirection = "left";
            cursor.classList.add("flipped");
          }

          cursor.style.top = `${y}px`;
          cursor.style.left = `${x}px`;

          // xTo(x);
          // yTo(y);
        });

        item.addEventListener("mouseenter", () => {
          cursor.classList.add("shown");
        });
        item.addEventListener("mouseleave", () => {
          cursor.classList.remove("shown");
        });

        element.addEventListener("click", () => {
          if (window.matchMedia("(max-width: 640px)").matches) return;
          if (cursorDirection === "right") {
            mainInstance.slideNext();

            console.log("Sliding next");
          } else {
            mainInstance.slidePrev();
            console.log("Sliding prev");
          }
        });
      }
    });

    const promoSliders = Array.from(
      element.querySelectorAll<HTMLElement>(".intro__promo-slider")
    );

    promoSliders.forEach((element) => {
      const container = element.querySelector<HTMLElement>(".swiper");
      if (!container) return;

      let instance: Swiper | null = null;

      const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
          instance = new Swiper(container, {
            slidesPerView: "auto",
            speed: 600,
          });
        } else {
          if (instance) instance.destroy();
          instance = null;
        }
      };

      mql.addEventListener("change", handleWidthChange);

      handleWidthChange(mql);
    });
  });
}
