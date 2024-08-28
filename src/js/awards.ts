import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

export default function awards() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".awards")
  );

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;

    new Swiper(container, {
      slidesPerView: "auto",
      speed: 600,
      modules: [Navigation],
      navigation: {
        prevEl: element.querySelector<HTMLButtonElement>(
          ".awards__arrow--prev"
        ),
        nextEl: element.querySelector<HTMLButtonElement>(
          ".awards__arrow--next"
        ),
      },
    });
  });
}
