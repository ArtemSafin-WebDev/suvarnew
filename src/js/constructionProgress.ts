import Swiper from "swiper";
import "swiper/css";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import Select from "./classes/Select";

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
  });
}
