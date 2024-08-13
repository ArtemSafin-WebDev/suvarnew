import "virtual:svg-icons-register";
import "../scss/style.scss";
import footer from "./footer";
import homeNews from "./homeNews";
import mortgage from "./mortgage";
import aboutProject from "./aboutProject";
import projectIntro from "./projectIntro";
import intro from "./intro";
import header from "./header";
import ourProjects from "./ourProjects";
import filters from "./filters";
import documents from "./documents";
import planning from "./planning";
import phase from "./phase";
import constructionProgress from "./constructionProgress";

document.addEventListener("DOMContentLoaded", () => {
  footer();
  homeNews();
  mortgage();
  aboutProject();
  projectIntro();
  intro();
  header();
  ourProjects();
  filters();
  documents();
  planning();
  phase();
  constructionProgress();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
