import Swiper from "swiper";
import "swiper/css";
import { EffectFade, Navigation, Pagination } from "swiper/modules";

export default function recent() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".recent")
  );

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(
      ".recent__slider > .swiper"
    );
    if (container) {
      new Swiper(container, {
        slidesPerView: "auto",
        speed: 600,
        modules: [Navigation],
        navigation: {
          prevEl: element.querySelector<HTMLButtonElement>(
            ".recent__arrow--prev"
          ),
          nextEl: element.querySelector<HTMLButtonElement>(
            ".recent__arrow--next"
          ),
        },
      });
    }

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
          allowTouchMove: false,
          nested: false,
          modules: [EffectFade, Pagination],
          pagination: {
            el: card.querySelector<HTMLElement>(
              ".catalog__card-slider-pagination"
            ),
            clickable: true,
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
