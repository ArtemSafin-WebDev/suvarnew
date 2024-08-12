import Swiper from "swiper";
import "swiper/css";
import { EffectFade, Pagination } from "swiper/modules";

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
    );
    const mapViewLayer = element.querySelector<HTMLElement>(
      ".our-projects__map-view-layer"
    );
    viewModeBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        viewModeBtns.forEach((btn) => btn.classList.remove("active"));
        btn.classList.add("active");

        const activeIndex = viewModeBtns.findIndex((btn) =>
          btn.classList.contains("active")
        );
        if (activeIndex === 0) {
          listViewLayer?.classList.remove("hidden");
          mapViewLayer?.classList.remove("active");
        } else {
          listViewLayer?.classList.add("hidden");
          mapViewLayer?.classList.add("active");
        }
      });
    });

    const cards = Array.from(
      element.querySelectorAll<HTMLElement>(".our-projects__card")
    );
    cards.forEach((card) => {
      const container = card.querySelector<HTMLElement>(".swiper");
      const imageContainer = card.querySelector<HTMLElement>(
        ".our-projects__card-image-container"
      );
      if (!container || !imageContainer) return;

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
          el: card.querySelector<HTMLElement>(".our-projects__card-pagination"),
        },
      });

      imageContainer.addEventListener("mousemove", (event) => {
        let progress = Math.ceil(
          Math.abs(event.offsetX / imageContainer.offsetWidth) * slides.length
        );

        if (progress <= 0) progress = 1;

        instance.slideTo(progress - 1);

        // console.log("progress", progress);
      });

      imageContainer.addEventListener("mouseleave", () => {
        instance.slideTo(0);
      });
    });
  });
}
