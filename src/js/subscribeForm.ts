import Validator from "./classes/Validator";

export default function subscribeForm() {
    const elements = Array.from(
        document.querySelectorAll<HTMLElement>(".subscribe-form")
    );

    elements.forEach((element) => {
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
