import Select from "./classes/Select";
import { getNoun } from "./utils";
import Swiper from "swiper";
import { Swiper as SwiperInstance } from "swiper/types";
import "swiper/css";

export default function mortgage() {
  const mql = window.matchMedia("(max-width: 640px)");
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".mortgage")
  );

  elements.forEach((element) => {
    const rangeFields = Array.from(
      element.querySelectorAll<HTMLElement>(".mortgage__form-range")
    );
    rangeFields.forEach((field) => {
      const input = field.querySelector<HTMLInputElement>(
        'input[type="range"]'
      );
      if (!input) return;
      const format =
        input.getAttribute("data-format") === "years" ? "years" : "currency";
      const valueShown = field.querySelector<HTMLElement>(
        ".mortgage__form-range-value-text"
      );

      const setValue = (value: number) => {
        const formattedValue =
          format === "currency"
            ? value.toLocaleString("ru-RU").toString() + " руб."
            : value.toString() + ` ${getNoun(value, "год", "года", "лет")}`;
        console.log("Formatted value", formattedValue);
        if (valueShown) valueShown.textContent = formattedValue;
        const range = +input.max - +input.min;
        const progress = (value - +input.min) / range;
        console.log("Progress", progress);
        field.style.setProperty("--progress", progress.toString());
      };

      input.addEventListener("input", () => {
        setValue(+input.value);
      });

      if (input.value) setValue(+input.value);
    });

    const selects = Array.from(
      element.querySelectorAll<HTMLElement>(".mortgage__form-select")
    );

    selects.forEach((select) => {
      new Select(select);
    });

    const container = element.querySelector<HTMLElement>(".swiper");

    if (container) {
      let instance: SwiperInstance | null = null;

      const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
          instance = new Swiper(container, {
            speed: 600,
            slidesPerView: "auto",
          });
        } else {
          if (instance) {
            instance.destroy();
            instance = null;
          }
        }
      };

      mql.addEventListener("change", handleWidthChange);

      handleWidthChange(mql);
    }
  });
}
