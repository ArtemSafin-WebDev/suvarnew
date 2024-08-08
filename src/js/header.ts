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
}
