import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";
import Select from "./classes/Select";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function constructionProgress() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".construction-progress")
  );
  elements.forEach((element) => {
    const selects = Array.from(
      element.querySelectorAll<HTMLElement>(".construction-progress__select")
    );
    selects.forEach((select) => new Select(select));

    const openFilters = element.querySelector<HTMLElement>(
      ".construction-progress__filters-mobile-btn"
    );
    const closeFilters = element.querySelector<HTMLElement>(
      ".construction-progress__filters-close"
    );
    const modal = element.querySelector(
      ".construction-progress__filters-modal"
    );

    openFilters?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.add("construction-filters-shown");
    });
    closeFilters?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.remove("construction-filters-shown");
    });

    modal?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.matches(".construction-progress__filters-modal")) {
        document.body.classList.remove("construction-filters-shown");
      }
    });

    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;

    let instance: Swiper | null = null;

    const initSlider = () => {
      if (instance) instance.destroy();
      instance = new Swiper(container, {
        speed: 600,
        modules: [Navigation],
        slidesPerView: "auto",
        navigation: {
          prevEl: element.querySelector<HTMLButtonElement>(
            ".construction-progress__arrow--prev"
          ),
          nextEl: element.querySelector<HTMLButtonElement>(
            ".construction-progress__arrow--next"
          ),
        },
      });
    };

    initSlider();

    element.addEventListener("reinitSlider", () => {
      initSlider;
    });

    const videoModal = element.querySelector<HTMLElement>(
      ".construction-progress__modal"
    );
    if (videoModal) {
      const modalClose = videoModal.querySelector<HTMLElement>(
        ".construction-progress__modal-close"
      );
      const openModal = () => {
        document.body.classList.add("modal-open");
        videoModal?.classList.add("active");
      };
      const closeModal = () => {
        document.body.classList.remove("modal-open");
        videoModal?.classList.remove("active");
        const iframe = videoModal?.querySelector("iframe");
        if (iframe) {
          let iframeSrc = iframe.src;
          iframe.src = iframeSrc;
        }
      };

      element.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (
          target.matches(".construction-progress__slider-card") ||
          target.closest(".construction-progress__slider-card")
        ) {
          event.preventDefault();
          openModal();
        }
      });

      modalClose?.addEventListener("click", (event) => {
        event.preventDefault();
        closeModal();
      });

      videoModal?.addEventListener("click", (event) => {
        if (event.target === videoModal) {
          closeModal();
        }
      });
    }
  });
}
