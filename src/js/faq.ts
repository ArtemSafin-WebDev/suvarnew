export default function faq() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".faq"));

  elements.forEach((element) => {
    const btns = Array.from(
      element.querySelectorAll<HTMLElement>(".faq__accordion-btn")
    );

    btns.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        btns.forEach((otherBtn) => {
          if (otherBtn === btn) return;
          otherBtn.parentElement?.classList.remove("active");
        });
        btn.parentElement?.classList.toggle("active");
      });
    });
  });
}
