export default function phase() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".phase"));

  elements.forEach((element) => {
    const phaseItems = Array.from(
      element.querySelectorAll<HTMLElement>(".phase__list-item")
    );

    phaseItems.forEach((element) => {
      const btn = element.querySelector<HTMLLinkElement>(
        ".phase__card-choose-specs"
      );
      btn?.addEventListener("click", (event) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        target.closest(".phase__card-wrapper")?.classList.toggle("open");
      });
    });

    const navBtns = Array.from(
      element.querySelectorAll<HTMLElement>(".phase__nav-link")
    );
    const listItems = Array.from(
      element.querySelectorAll<HTMLElement>(".phase__list-item")
    );
    const setActiveElement = (index: number) => {
      navBtns.forEach((btn) => btn.classList.remove("active"));
      listItems.forEach((item) => item.classList.remove("active"));
      navBtns[index]?.classList.add("active");
      listItems[index]?.classList.add("active");
    };
    if (navBtns.length) {
      setActiveElement(0);
    }

    navBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        setActiveElement(btnIndex);
      });
    });
  });
}
