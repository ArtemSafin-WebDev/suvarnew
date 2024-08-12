document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelector(".filters");

  if (filters) {
    const selectRadios = Array.from(
      filters.querySelectorAll(".filters__form-select-radio-input")
    );

    selectRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const checkedValue = selectRadios.find((radio) => radio.checked)?.value;
        console.log("Select checked value", checkedValue);
      });
    });

    const rangeSliders = Array.from(
      filters.querySelectorAll(".filters__form-range-slider")
    );

    rangeSliders.forEach((slider) => {
      slider.addEventListener("rangeupdate", (event) => {
        const { min, max } = event.detail;
        console.log(`Min: ${min}; Max: ${max}`);
      });
    });
  }

  const mortgage = document.querySelector(".mortgage");
  if (mortgage) {
    const ranges = Array.from(mortgage.querySelectorAll('input[type="range"]'));
    ranges.forEach((range) => {
      range.addEventListener("input", () => {
        console.log("Value", range.value);
      });
    });
  }

  const pageFooterForm = document.querySelector(".page-footer__form");

  pageFooterForm.addEventListener("validsubmit", () => {
    console.log("Form is valid");
  });
});
