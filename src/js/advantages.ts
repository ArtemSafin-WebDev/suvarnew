import Swiper from "swiper";
import "swiper/css";

import { Controller, Navigation } from "swiper/modules";
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

    const modalSliders = Array.from(
      element.querySelectorAll<HTMLElement>(".advantages-modal__images-slider")
    );

    const modalSlidersWrapper = element.querySelector<HTMLElement>(
      ".advantages-modal__images-sliders"
    );

    const cursor = element.querySelector(".advantages-modal__cursor");
    let cursorDirection = "right";
    const modalTabsNavLinks = Array.from(
      element.querySelectorAll<HTMLElement>(".advantages-modal__tabs-nav-link")
    );

    const fullscreenBtns = Array.from(
      element.querySelectorAll<HTMLElement>(".advantages__card-fullscreen-btn")
    );

    const modalCloseBtns = Array.from(
      element.querySelectorAll<HTMLElement>(".advantages-modal__close")
    );

    const modal = element.querySelector<HTMLElement>(".advantages__modal");

    let sliderInstances: Swiper[] = [];
    let activeTabIndex = 0;

    const setActive = (index: number) => {
      const state = Flip.getState(tabItems[0]?.parentElement);
      tabsNavBtns.forEach((btn) => btn.classList.remove("active"));
      tabItems.forEach((item) => item.classList.remove("active"));
      modalTabsNavLinks.forEach((item) => item.classList.remove("active"));
      modalSliders.forEach((item) => item.classList.remove("active"));
      tabItems[index]?.classList.add("active");
      tabsNavBtns[index]?.classList.add("active");
      modalTabsNavLinks[index]?.classList.add("active");
      modalSliders[index]?.classList.add("active");
      activeTabIndex = index;
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
    modalTabsNavLinks.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        setActive(btnIndex);
      });
    });

    fullscreenBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        modal?.classList.add("active");
        document.body.classList.add("modal-open");
      })
    );
    modalCloseBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        modal?.classList.remove("active");
        document.body.classList.remove("modal-open");
      })
    );

    tabItems.forEach((item, itemIndex) => {
      let autoplayDisabled = window.matchMedia("(max-width: 640px)").matches
        ? true
        : false;
      const AUTOPLAY_DURATION = 15;
      const container = item.querySelector<HTMLElement>(".swiper");
      if (!container) return;
      const paginationElement = item.querySelector<HTMLElement>(
        ".advantages__card-slider-pagination"
      );

      const modalSliderItem = modalSliders[itemIndex];

      const fractionTextElement = item?.querySelector<HTMLElement>(
        ".advantages__card-slider-fraction-pagination-inner"
      );
      const modalFractionText = modalSliderItem?.querySelector<HTMLElement>(
        ".advantages-modal__images-slider-fraction-pagination-inner"
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
        if (fractionTextElement) {
          fractionTextElement.textContent = `${swiper.realIndex + 1} / ${
            swiper.slides.length
          }`;
        }
        if (modalFractionText) {
          modalFractionText.textContent = `${swiper.realIndex + 1} / ${
            swiper.slides.length
          }`;
        }
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
        gsap.killTweensOf([item, modalSliderItem]);
        if (autoplayDisabled) return;
        gsap.fromTo(
          [item, modalSliderItem],
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

      let modalInstance: Swiper | null = null;
      const modalContainer =
        modalSliders[itemIndex]?.querySelector<HTMLElement>(".swiper");
      if (modalContainer) {
        modalInstance = new Swiper(modalContainer, {
          slidesPerView: 1,
          speed: 600,
          modules: [Controller],
          loop: true,
        });
      }

      const instance = new Swiper(container, {
        slidesPerView: 1,
        speed: 600,
        init: false,
        modules: [Navigation, Controller],
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

      sliderInstances.push(instance);

      if (modalInstance) {
        instance.controller.control = modalInstance;
        modalInstance.controller.control = instance;
      }
    });

    if (cursor && modalSlidersWrapper) {
      gsap.set(cursor, { xPercent: -50, yPercent: -50 });

      let xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" }),
        yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

      modalSlidersWrapper.addEventListener("mousemove", (event) => {
        const e = event as MouseEvent;
        if (e.clientX > window.innerWidth / 2) {
          cursorDirection = "right";
          cursor.classList.remove("flipped");
        } else {
          cursorDirection = "left";
          cursor.classList.add("flipped");
        }
        xTo(e.clientX);
        yTo(e.clientY);
      });

      // element.addEventListener("mouseenter", () => {
      //   gsap.to(cursor, {
      //     autoAlpha: 1,
      //     duration: 0.2,
      //   });
      // });
      // element.addEventListener("mouseleave", () => {
      //   gsap.to(cursor, {
      //     autoAlpha: 0,
      //     duration: 0.2,
      //   });
      // });

      modalSlidersWrapper.addEventListener("click", () => {
        if (cursorDirection === "right") {
          sliderInstances[activeTabIndex].slideNext();

          console.log("Sliding next");
        } else {
          sliderInstances[activeTabIndex].slidePrev();
          console.log("Sliding prev");
        }
      });
    }
  });
}
