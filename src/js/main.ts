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
import advantages from "./advantages";
import callbackModal from "./callbackModal";
import plan from "./plan";
import catalog from "./catalog";
import gallery from "./gallery";
import flatPlan from "./flatPlan";
import similarFlats from "./similarFlats";
import faq from "./faq";
import mortgageModal from "./mortgageModal";
import excursion from "./excursion";
import mortgageVariants from "./mortgageVariants";
import newsList from "./newsList";
import subscribeForm from "./subscribeForm";
import newsDetail from "./newsDetail";
import newsMore from "./newsMore";
import commercial from "./commercial";
import awards from "./awards";
import aboutTeam from "./aboutTeam";
import aboutCompany from "./aboutCompany";
import companyProjects from "./companyProjects";
import aboutIntro from "./aboutIntro";
import aboutHistory from "./aboutHistory";
import fav from "./fav";
import recent from "./recent";
import projectMenu from "./projectMenu";
import parking from "./parking";
import boxrooms from "./boxrooms";
import applyClick from "./applyClick";
import parkingProject from "./parkingProject";
import parkingHouse from "./parkingHouse";
import boxroomsProject from "./boxroomsProject";
import boxroomsHouse from "./boxroomsHouse";
import parkingProjectPlan from "./parkingProjectPlan";
import boxroomsProjectPlan from "./boxroomsProjectPlan";
import blueIntro from "./blueIntro";

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
  advantages();
  callbackModal();
  plan();
  catalog();
  gallery();
  flatPlan();
  similarFlats();
  faq();
  mortgageModal();
  excursion();
  mortgageVariants();
  newsList();
  subscribeForm();
  newsDetail();
  newsMore();
  awards();
  aboutTeam();
  aboutCompany();
  companyProjects();
  aboutIntro();
  aboutHistory();
  fav();
  recent();
  projectMenu();
  commercial();
  parking();
  boxrooms();
  applyClick();
  parkingProject();
  parkingHouse();
  boxroomsHouse();
  boxroomsProject();
  parkingProjectPlan();
  boxroomsProjectPlan();
  blueIntro();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
