import Select from "./classes/Select";
import * as noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

export default function filters() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".filters, .catalog__short-filters, .catalog__all-filters-modal-form"
    )
  );

  elements.forEach((element) => {
    const selects = Array.from(
      element.querySelectorAll<HTMLElement>(".filters__form-select")
    );

    selects.forEach((select) => new Select(select));

    const rangeSliders = Array.from(
      element.querySelectorAll(".filters__form-range-slider")
    );

    rangeSliders.forEach((element) => {
      const inputs = Array.from(
        element.querySelectorAll<HTMLInputElement>("input")
      );
      const rangeSliderElement = element.querySelector(
        ".filters__form-range-slider-element-inner"
      ) as noUiSlider.target;
      const minValue = element.hasAttribute("data-min")
        ? Number(element.getAttribute("data-min"))
        : 10;
      const maxValue = element.hasAttribute("data-max")
        ? Number(element.getAttribute("data-max"))
        : 15;
      const stepValue = element.hasAttribute("data-step")
        ? Number(element.getAttribute("data-step"))
        : 1;
      const form = element.closest<HTMLFormElement>("form");
      const startValue = inputs[0].value.replace(/\s/g, "").trim()
        ? parseFloat(inputs[0].value.replace(/\s/g, "").trim())
        : "";
      const endValue = inputs[1].value.replace(/\s/g, "").trim()
        ? parseFloat(inputs[1].value.replace(/\s/g, "").trim())
        : "";

      noUiSlider.create(rangeSliderElement, {
        start: [
          startValue ? startValue : minValue,
          endValue ? endValue : maxValue,
        ],
        connect: true,
        orientation: "horizontal",
        step: stepValue,
        range: {
          min: minValue,
          max: maxValue,
        },
        format: {
          to: (v) => {
            const vFormatted = Number(
              parseFloat(v.toString()).toFixed(0)
            ).toLocaleString("ru-RU");

            return vFormatted;
          },
          from: (v) => {
            const vFormatted = Number(parseFloat(v.toString()).toFixed(0));
            return vFormatted;
          },
        },
      });

      rangeSliderElement.noUiSlider?.on("update", () => {
        const newValue = rangeSliderElement.noUiSlider?.get() as [
          number,
          number
        ];

        inputs[0].value = newValue[0].toString();
        inputs[1].value = newValue[1].toString();
      });

      rangeSliderElement.noUiSlider?.on("set", () => {
        const newValue = rangeSliderElement.noUiSlider?.get() as [
          number,
          number
        ];
        const rangeUpdateEvent = new CustomEvent<{
          min: number;
          max: number;
        }>("rangeupdate", {
          detail: {
            min: +newValue[0].toString().replace(/[^\d]+/g, ""),
            max: +newValue[1].toString().replace(/[^\d]+/g, ""),
          },
        });

        element.dispatchEvent(rangeUpdateEvent);
      });

      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          const value = input.value;
          const newCleanedValue = parseInt(value.replace(/[^\d]+/g, ""), 10);

          if (isNaN(newCleanedValue)) {
            input.value = "";
          } else {
            input.value = newCleanedValue.toLocaleString("ru-RU");
          }
        });
      });

      inputs[0].addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;

        rangeSliderElement.noUiSlider?.set(target.value.replace(/[^\d]+/g, ""));
      });
      inputs[1].addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;
        rangeSliderElement.noUiSlider?.set([
          null,
          target.value.replace(/[^\d]+/g, ""),
        ]);
      });
      if (form) {
        form.addEventListener("reset", () => {
          rangeSliderElement.noUiSlider?.reset();
          setTimeout(() => {
            const newValue = rangeSliderElement.noUiSlider?.get() as [
              number,
              number
            ];

            inputs[0].value = newValue[0].toString();
            inputs[1].value = newValue[1].toString();
          }, 10);
        });
      }
    });

    const closeFiltersBtns = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".js-filters-close")
    );
    const openFiltersBtns = Array.from(
      document.querySelectorAll<HTMLButtonElement>(".js-filters-open")
    );

    openFiltersBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        element.classList.add("active");
        document.body.classList.add("modal-open");
      });
    });
    closeFiltersBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        element.classList.remove("active");
        document.body.classList.remove("modal-open");
      });
    });
  });
}
