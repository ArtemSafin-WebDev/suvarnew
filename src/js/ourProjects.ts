import Swiper from "swiper";
import "swiper/css";
import { EffectFade, Pagination } from "swiper/modules";

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function ourProjects() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".our-projects")
  );

  elements.forEach((element) => {
    const viewModeBtns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(".our-projects__desktop-btn")
    );

    const listViewLayer = element.querySelector<HTMLElement>(
      ".our-projects__list-view-layer"
    )!;
    const mapViewLayer = element.querySelector<HTMLElement>(
      ".our-projects__map-view-layer"
    )!;

    const mobileMapOpen = element.querySelector<HTMLElement>(".js-map-open");
    const mobileMapClose = element.querySelector<HTMLElement>(".js-map-close");

    mobileMapOpen?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.add("map-modal-shown");
    });
    mobileMapClose?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.remove("map-modal-shown");
    });
    viewModeBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        viewModeBtns.forEach((btn) => btn.classList.remove("active"));
        btn.classList.add("active");

        const activeIndex = viewModeBtns.findIndex((btn) =>
          btn.classList.contains("active")
        );
        const state = Flip.getState(listViewLayer.parentElement);
        if (activeIndex === 0) {
          listViewLayer?.classList.remove("hidden");
          mapViewLayer?.classList.remove("active");
        } else {
          listViewLayer?.classList.add("hidden");
          mapViewLayer?.classList.add("active");
        }
        Flip.from(state, {
          ease: "power1.inOut",
          duration: 0.4,
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        });
      });
    });

    mobileMapOpen?.addEventListener("click", (event) => {
      event.preventDefault();
    });

    type CardSlider = {
      instance: Swiper;
      container: HTMLElement;
      mouseMoveHandler: (event: MouseEvent) => void;
      mouseLeaveHandler: (event: MouseEvent) => void;
    };

    let sliders: CardSlider[] = [];
    const initGallerySliders = (): CardSlider[] => {
      const cards = Array.from(
        element.querySelectorAll<HTMLElement>(".our-projects__card")
      );
      const sliders = cards.map((card) => {
        const container = card.querySelector<HTMLElement>(".swiper")!;
        const imageContainer = card.querySelector<HTMLElement>(
          ".our-projects__card-image-container"
        )!;

        const slides = Array.from(
          card.querySelectorAll<HTMLElement>(".swiper-slide")
        );

        const instance = new Swiper(container, {
          slidesPerView: 1,
          speed: 600,
          effect: "fade",
          fadeEffect: {
            crossFade: false,
          },
          modules: [EffectFade, Pagination],
          pagination: {
            el: card.querySelector<HTMLElement>(
              ".our-projects__card-pagination"
            ),
          },
        });

        const mouseMoveHandler = (event: MouseEvent) => {
          let progress = Math.ceil(
            Math.abs(event.offsetX / imageContainer.offsetWidth) * slides.length
          );

          if (progress <= 0) progress = 1;

          instance.slideTo(progress - 1);
        };

        const mouseLeaveHandler = () => {
          instance.slideTo(0);
        };

        imageContainer.addEventListener("mousemove", mouseMoveHandler);

        imageContainer.addEventListener("mouseleave", mouseLeaveHandler);

        return {
          instance,
          mouseMoveHandler,
          mouseLeaveHandler,
          container: imageContainer,
        };
      });

      return sliders;
    };

    sliders = initGallerySliders();

    element.addEventListener("reinitSlider", () => {
      sliders.forEach(
        ({ instance, mouseMoveHandler, mouseLeaveHandler, container }) => {
          instance.destroy();
          container.removeEventListener("mouseleave", mouseLeaveHandler);
          container.removeEventListener("mousemove", mouseMoveHandler);
        }
      );
      sliders = initGallerySliders();
    });
  });
}
