import Swiper from "swiper";
import "swiper/css";
import { EffectFade, Pagination } from "swiper/modules";
import Select from "./classes/Select";

export default function catalog() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".catalog")
  );

  elements.forEach((element) => {
    const openAllFiltersBtn = element.querySelectorAll<HTMLButtonElement>(
      ".js-open-all-filters"
    );
    const closeAllFiltersBtn = element.querySelectorAll<HTMLButtonElement>(
      ".js-close-all-filters"
    );
    const allFiltersModal = element.querySelector<HTMLElement>(
      ".catalog__all-filters-modal"
    );
    const fixedShowFilters = element.querySelector<HTMLButtonElement>(
      ".catalog__fixed-show-filters"
    );

    const sortSelects = Array.from(
      element.querySelectorAll<HTMLElement>(".catalog__sort")
    );
    sortSelects.forEach((select) => new Select(select));

    const checkScroll = () => {
      if (window.scrollY > window.innerHeight) {
        fixedShowFilters?.classList.add("shown");
      } else {
        fixedShowFilters?.classList.remove("shown");
      }
    };

    if (fixedShowFilters) {
      checkScroll();

      window.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    allFiltersModal?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target === allFiltersModal) {
        document.body.classList.remove("all-filters-shown");
      }
    });

    openAllFiltersBtn.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        document.body.classList.add("all-filters-shown");
      })
    );
    closeAllFiltersBtn.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        document.body.classList.remove("all-filters-shown");
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
