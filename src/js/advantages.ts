import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function advantages() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".advantages")
  );

  elements.forEach((element) => {
    const tabsNavBtns = Array.from(
      element.querySelectorAll(".advantages__tabs-nav-link")
    );
    const tabItems = Array.from(
      element.querySelectorAll<HTMLElement>(".advantages__tabs-item")
    );

    const setActive = (index: number) => {
      const state = Flip.getState(tabItems[0]?.parentElement);
      tabsNavBtns.forEach((btn) => btn.classList.remove("active"));
      tabItems.forEach((item) => item.classList.remove("active"));
      tabItems[index]?.classList.add("active");
      tabsNavBtns[index]?.classList.add("active");
      Flip.from(state, {
        ease: "power1.inOut",
        duration: 0.4,
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      });
    };

    if (tabItems.length) {
      setActive(0);
    }

    tabsNavBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        setActive(btnIndex);
      });
    });

    tabItems.forEach((item) => {
      let autoplayDisabled = false;
      const AUTOPLAY_DURATION = 15;
      const container = item.querySelector<HTMLElement>(".swiper");
      if (!container) return;
      const paginationElement = item.querySelector<HTMLElement>(
        ".advantages__card-slider-pagination"
      );

      const fractionTextElement = item?.querySelector(
        ".advantages__card-slider-fraction-pagination-inner"
      );
      const slides = Array.from(item.querySelectorAll(".swiper-slide"));
      slides.forEach(() => {
        const bullet = document.createElement("div");
        bullet.classList.add("advantages__card-slider-pagination-bullet");
        paginationElement?.appendChild(bullet);
      });
      const bullets = Array.from(
        item.querySelectorAll(".advantages__card-slider-pagination-bullet")
      );

      const setFraction = (swiper: Swiper) => {
        if (!fractionTextElement) return;
        fractionTextElement.textContent = `${swiper.realIndex + 1} / ${
          swiper.slides.length
        }`;
      };
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
      function autoplay(swiper: Swiper) {
        gsap.killTweensOf(element);
        if (autoplayDisabled) return;
        gsap.fromTo(
          element,
          {
            "--p": 0,
          },
          {
            "--p": 100,
            ease: "none",
            duration: AUTOPLAY_DURATION,
            onComplete: () => {
              swiper.slideNext();
            },
          }
        );
      }
      const instance = new Swiper(container, {
        slidesPerView: 1,
        speed: 600,
        init: false,
        modules: [Navigation],
        loop: true,
        navigation: {
          prevEl: item.querySelector<HTMLButtonElement>(
            ".advantages__card-slider__arrow--prev"
          ),
          nextEl: item.querySelector<HTMLButtonElement>(
            ".advantages__card-slider__arrow--next"
          ),
        },
        on: {
          init: (swiper) => {
            setFraction(swiper);
            setBullets(swiper);
            autoplay(swiper);
          },
          slideChange: (swiper) => {
            setFraction(swiper);
            setBullets(swiper);
            autoplay(swiper);
          },
        },
      });

      instance.init();
    });
  });
}
