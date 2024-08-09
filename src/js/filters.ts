import Select from "./classes/Select";

export default function filters() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".filters")
  );

  elements.forEach((element) => {
    const selects = Array.from(
      element.querySelectorAll<HTMLElement>(".filters__form-select")
    );

    selects.forEach((select) => new Select(select));

    const rangeSliders = Array.from(
      element.querySelectorAll(".filters__form-range-slider")
    );

    rangeSliders.forEach((slider) => {
      const rangeInputs = Array.from(
        slider.querySelectorAll<HTMLInputElement>('input[type="range"]')
      );
      const priceInputs = Array.from(
        slider.querySelectorAll<HTMLInputElement>(
          ".filters__form-range-slider-numeric-input"
        )
      );
      const progress = slider.querySelector<HTMLElement>(
        ".filters__form-range-slider-element-progress"
      )!;

      const GAP = +rangeInputs[0].step;

      rangeInputs.forEach((input) => {
        input.addEventListener("input", (event) => {
          const target = event.target as HTMLInputElement;
          let minVal = parseInt(rangeInputs[0].value, 10);
          let maxVal = parseInt(rangeInputs[1].value, 10);

          if (maxVal - minVal < GAP) {
            if (
              target.matches(".filters__form-range-slider-range-input--from")
            ) {
              rangeInputs[0].value = (maxVal - GAP).toString();
            } else {
              rangeInputs[1].value = (minVal + GAP).toString();
            }
          } else {
            priceInputs[0].value = minVal.toString();
            priceInputs[1].value = maxVal.toString();
            progress.style.left = `${(minVal / +rangeInputs[0].max) * 100}%`;
            progress.style.right = `${
              100 - (maxVal / +rangeInputs[1].max) * 100
            }%`;
          }
        });
      });
    });
  });
}
