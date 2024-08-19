import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

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
  });
}
