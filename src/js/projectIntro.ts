import gsap from "gsap";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade } from "swiper/modules";

export default function projectIntro() {
  const elements = Array.from(document.querySelectorAll(".project-intro"));

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");

    const cursor = element.querySelector(".project-intro__cursor");
    const pagination = element.querySelector(".project-intro__pagination");
    const paginationTextElement = pagination?.querySelector(
      ".project-intro__pagination-inner"
    );
    let cursorDirection = "right";

    let autoplayDisabled = false;
    const AUTOPLAY_DURATION = 15;
    const slides = Array.from(element.querySelectorAll(".swiper-slide"));
    const bulletsWrapper = element.querySelector(".project-intro__bullets");

    slides.forEach(() => {
      const bullet = document.createElement("div");
      bullet.classList.add("project-intro__bullet");
      bulletsWrapper?.appendChild(bullet);
    });

    const bullets = Array.from(
      element.querySelectorAll(".project-intro__bullet")
    );

    const setFraction = (swiper: Swiper) => {
      if (!paginationTextElement) return;
      paginationTextElement.textContent = `${swiper.realIndex + 1} / ${
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
      if (autoplayDisabled) return;
      gsap.killTweensOf(element);
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

    if (container) {
      const instance = new Swiper(container, {
        speed: 1000,
        effect: "fade",
        loop: true,
        modules: [EffectFade],
        longSwipesRatio: 0.3,
        fadeEffect: {
          crossFade: false,
        },
        init: false,

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

      if (cursor) {
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });

        let xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" }),
          yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

        element.addEventListener("mousemove", (event) => {
          const e = event as MouseEvent;
          if (e.clientX > window.innerWidth / 2) {
            cursorDirection = "right";
            cursor.classList.remove("flipped");
          } else {
            cursorDirection = "left";
            cursor.classList.add("flipped");
          }
          xTo(e.clientX);
          yTo(e.clientY + window.scrollY);
        });

        element.addEventListener("mouseenter", () => {
          gsap.to(cursor, {
            autoAlpha: 1,
            duration: 0.2,
          });
        });
        element.addEventListener("mouseleave", () => {
          gsap.to(cursor, {
            autoAlpha: 0,
            duration: 0.2,
          });
        });

        element.addEventListener("click", () => {
          if (cursorDirection === "right") {
            instance.slideNext();

            console.log("Sliding next");
          } else {
            instance.slidePrev();
            console.log("Sliding prev");
          }
        });
      }
    }
  });
}
