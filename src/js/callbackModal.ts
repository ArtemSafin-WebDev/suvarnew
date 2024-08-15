import Validator from "./classes/Validator";

export default function callbackModal() {
  const modal = document.querySelector("#callback-modal");
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
      target.matches(".js-open-callback-modal") ||
      target.closest(".js-open-callback-modal")
    ) {
      event.preventDefault();
      const modal = document.querySelector<HTMLElement>("#callback-modal");
      modal?.classList.add("active");
      document.body.classList.add("modal-open");
    }

    if (
      target.matches(".callback-modal__close") ||
      target.closest(".callback-modal__close") ||
      target.matches("#callback-modal")
    ) {
      const modal = document.querySelector<HTMLElement>("#callback-modal");
      modal?.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  });
}
