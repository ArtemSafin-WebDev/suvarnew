import Swiper from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";
import { Controller, EffectFade, Navigation, Thumbs } from "swiper/modules";
import gsap from "gsap";

export default function aboutHistory() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".about-history")
  );

  elements.forEach((element) => {
    const mainContainer = element.querySelector<HTMLElement>(
      ".about-history__text-slider .swiper"
    );
    const imageSliderContainer = element.querySelector<HTMLElement>(
      ".about-history__image-slider .swiper"
    );
    const thumbsContainer = element.querySelector<HTMLElement>(
      ".about-history__thumbs-slider .swiper"
    );
    const AUTOPLAY_DURATION = 15;
    const fractionTextElement = element.querySelector<HTMLElement>(
      ".about-history__slider-fraction-pagination-inner"
    );
    let autoplayDisabled = window.matchMedia("(max-width: 640px)").matches
      ? true
      : false;

    const setFraction = (swiper: Swiper) => {
      if (!fractionTextElement) return;
      fractionTextElement.textContent = `${swiper.realIndex + 1} / ${
        swiper.slides.length
      }`;
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
            if (swiper.isEnd) {
              swiper.slideTo(0);
            } else {
              swiper.slideNext();
            }
          },
        }
      );
    }

    if (!mainContainer || !imageSliderContainer || !thumbsContainer) return;

    const thumbsInstance = new Swiper(thumbsContainer, {
      slidesPerView: "auto",
      speed: 600,
    });
    const imageInstance = new Swiper(imageSliderContainer, {
      slidesPerView: 1,
      speed: 600,
      effect: "fade",
      modules: [EffectFade, Controller],
    });

    const mainInstance = new Swiper(mainContainer, {
      slidesPerView: 1,
      speed: 600,
      modules: [Navigation, Controller, EffectFade, Thumbs],
      effect: "fade",
      thumbs: {
        swiper: thumbsInstance,
      },
      fadeEffect: {
        crossFade: true,
      },
      autoHeight: true,
      navigation: {
        prevEl: element.querySelector<HTMLButtonElement>(
          ".about-history__arrow--prev"
        ),
        nextEl: element.querySelector<HTMLButtonElement>(
          ".about-history__arrow--next"
        ),
      },
      on: {
        init: (swiper) => {
          setFraction(swiper);
          autoplay(swiper);
        },
        slideChange: (swiper) => {
          setFraction(swiper);
          autoplay(swiper);
        },
      },
      breakpoints: {
        641: {
          autoHeight: false,
        },
      },
    });

    mainInstance.init();

    mainInstance.controller.control = imageInstance;
    imageInstance.controller.control = mainInstance;

    window.addEventListener("load", () => {
      mainInstance.updateAutoHeight();
    });
  });
}
