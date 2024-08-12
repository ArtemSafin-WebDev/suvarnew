import Validator from "./classes/Validator";

export default function footer() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".page-footer")
  );

  elements.forEach((element) => {
    const accordionsBtns = Array.from(
      element.querySelectorAll(".page-footer__nav-title")
    );
    accordionsBtns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        accordionsBtns.forEach((otherBtn) => {
          if (otherBtn === btn) return;
          otherBtn.parentElement?.classList.remove("active");
        });
        btn.parentElement?.classList.toggle("active");
      });
    });

    const form = element.querySelector("form");

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
