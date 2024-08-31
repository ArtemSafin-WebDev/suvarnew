export default function applyClick() {
  const elements = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(".js-apply-link")
  );

  elements.forEach((link) => {
    const selector = link.getAttribute("data-click-element")!;

    console.log("Selector", selector);
    const foundElements = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    );
    if (!foundElements.length) return;

    link.addEventListener("click", () => {
      foundElements.forEach((element) => element.click());
    });
  });
}
