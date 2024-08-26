import Swiper from "swiper";
import "swiper/css";
import { EffectFade, Pagination, Navigation } from "swiper/modules";

export default function similarFlats() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".similar-flats"));

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".similar-flats__slider");
    if (!container) return;

    let swiperInstance: Swiper | null = null;

    const mql = window.matchMedia("(max-width: 640px)");

    const initSwiper = (isSmallScreen: boolean) => {
      if (swiperInstance) swiperInstance.destroy(true, true);

      swiperInstance = new Swiper(container, {
        slidesPerView: "auto",
        speed: 600,
        modules: [Navigation],
        navigation: {
          nextEl: element.querySelector<HTMLButtonElement>(".similar-flats__arrow--next"),
          prevEl: element.querySelector<HTMLButtonElement>(".similar-flats__arrow--prev"),
        },
        slidesOffsetBefore: isSmallScreen ? 16 : 0,
        slidesOffsetAfter: isSmallScreen ? 16 : 0,
      });
    };

    initSwiper(mql.matches);

    mql.addEventListener("change", (e) => {
      initSwiper(e.matches);
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
