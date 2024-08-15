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

    // Подключение к прослушиванию ползунков
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

  // Ползунки в этом блоке
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

  // Событие при отправке формы, если она валидная, дальше можно писать аякс запрос
  pageFooterForm.addEventListener("validsubmit", () => {
    console.log("Form is valid");
  });

  // Реинициализация слайдера после фильтрации
  const constructionProgress = document.querySelector(".construction-progress");
  if (constructionProgress) {
    // const reinitEvent = new CustomEvent("reinitSlider");
    // constructionProgress.dispatchEvent(reinitEvent);
  }
});
