import { callAfterResize } from "./utils";

export default function header() {
  const burgerOpen = document.querySelector<HTMLButtonElement>(
    ".page-header__button--burger"
  );
  const burgerClose = document.querySelector<HTMLButtonElement>(
    ".mobile-menu__close"
  );
  burgerOpen?.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.add("menu-open");
  });
  burgerClose?.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.remove("menu-open");
  });

  const pageHeader = document.querySelector<HTMLElement>(".page-header");

  const checkHeader = () => {
    if (window.scrollY > 60) {
      pageHeader?.classList.add("fixed");
    } else {
      pageHeader?.classList.remove("fixed");
    }
  };

  checkHeader();

  callAfterResize(() => {
    checkHeader();
  }, 300);

  window.addEventListener("scroll", () => {
    checkHeader();
  });
}
