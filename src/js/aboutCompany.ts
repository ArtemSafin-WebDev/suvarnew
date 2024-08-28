import Swiper from "swiper";
import "swiper/css";

export default function aboutCompany() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".about-company")
  );

  elements.forEach((element) => {
    const toggle = element.querySelector(".about-company__text-toggle");

    toggle?.addEventListener("click", (event) => {
      event.preventDefault();
      toggle.parentElement?.classList.toggle("content-shown");
    });
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;

    new Swiper(container, {
      slidesPerView: "auto",
      speed: 600,
    });
  });
}
