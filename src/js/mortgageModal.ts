import Validator from "./classes/Validator";

export default function mortgageModal() {
  const modal = document.querySelector("#mortgage-modal");
  if (modal) {
    const form = modal.querySelector<HTMLFormElement>("form");
    if (form) {
      const formValidator = new Validator(form);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        event.stopPropagation();
        formValidator.validate();
        if (formValidator.valid) {
          const validSubmissionEvent = new CustomEvent("validsubmit");
          form.dispatchEvent(validSubmissionEvent);
        }
      });
    }
  }
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (
      target.matches(".js-open-mortgage-modal") ||
      target.closest(".js-open-mortgage-modal")
    ) {
      event.preventDefault();
      const modal = document.querySelector<HTMLElement>("#mortgage-modal");
      modal?.classList.add("active");
      document.body.classList.add("modal-open");
    }

    if (
      target.matches(".callback-modal__close") ||
      target.closest(".callback-modal__close") ||
      target.matches("#mortgage-modal")
    ) {
      const modal = document.querySelector<HTMLElement>("#mortgage-modal");
      modal?.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  });
}
