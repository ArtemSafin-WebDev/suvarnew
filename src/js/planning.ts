import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

export default function planning() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".planning")
  );

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;
    new Swiper(container, {
      slidesPerView: "auto",
      speed: 600,
      modules: [Navigation],
      navigation: {
        nextEl: element.querySelector<HTMLButtonElement>(
          ".planning__arrow--next"
        ),
        prevEl: element.querySelector<HTMLButtonElement>(
          ".planning__arrow--prev"
        ),
      },
    });
  });
}
