import "virtual:svg-icons-register";
import "../scss/ui-kit.scss";
import Select from "./classes/Select";

document.addEventListener("DOMContentLoaded", () => {
  const selects = Array.from(
    document.querySelectorAll<HTMLElement>(".ui-select")
  );

  selects.forEach((select) => new Select(select));
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
