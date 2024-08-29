import Select from "./classes/Select";
import Swiper from "swiper";
import "swiper/css";
import { EffectFade, Pagination } from "swiper/modules";

export default function fav() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".fav"));

  elements.forEach((element) => {
    const sortSelects = Array.from(
      element.querySelectorAll<HTMLElement>(".catalog__sort")
    );
    sortSelects.forEach((select) => new Select(select));

    const brochureCardBtns = Array.from(
      element.querySelectorAll<HTMLElement>(".fav__brochure-inner-card-btn")
    );
    const brochureCloseBtns = Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        ".fav__brochure-inner-card-dropdown-mobile-close"
      )
    );

    const dropdowns = Array.from(
      element.querySelectorAll<HTMLElement>(
        ".fav__brochure-inner-card-dropdown"
      )
    );

    brochureCardBtns.forEach((card) =>
      card.addEventListener("click", () => {
        card.parentElement?.classList.add("active");
        document.body.classList.add("sharing-card-shown");
      })
    );
    brochureCloseBtns.forEach((card) =>
      card.addEventListener("click", () => {
        card.closest(".fav__brochure-inner-card")?.classList.remove("active");
        document.body.classList.remove("sharing-card-shown");
      })
    );

    dropdowns.forEach((dropdown) =>
      dropdown.addEventListener("click", (event) => {
        if (event.target === dropdown) {
          dropdown
            .closest(".fav__brochure-inner-card")
            ?.classList.remove("active");
          document.body.classList.remove("sharing-card-shown");
        }
      })
    );
    type CardSlider = {
      instance: Swiper;
      container: HTMLElement;
      mouseMoveHandler: (event: MouseEvent) => void;
      mouseLeaveHandler: (event: MouseEvent) => void;
    };

    let sliders: CardSlider[] = [];
    const initGallerySliders = (): CardSlider[] => {
      const cards = Array.from(
        element.querySelectorAll<HTMLElement>(".catalog__card")
      );
      const sliders = cards.map((card) => {
        const container = card.querySelector<HTMLElement>(".swiper")!;
        const imageContainer = card.querySelector<HTMLElement>(
          ".catalog__card-slider"
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
              ".catalog__card-slider-pagination"
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
