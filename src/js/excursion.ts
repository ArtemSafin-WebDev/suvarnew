import Validator from "./classes/Validator";

export default function excursion() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".excursion")
  );

  elements.forEach((element) => {
    const form = element.querySelector<HTMLFormElement>("form");
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
  });
}
