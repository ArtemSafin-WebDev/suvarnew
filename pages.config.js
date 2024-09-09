import home from "./pages-data/home";
import project from "./pages-data/project";
import catalog from "./pages-data/catalog";
import flat from "./pages-data/flat";
import news from "./pages-data/news";
import newsDetail from "./pages-data/newsDetail";
import commercial from "./pages-data/commercial";
import commercialList from "./pages-data/commercialList";
import commercialListTable from "./pages-data/commercialListTable";
import commercialDetail from "./pages-data/commercialDetail";
import parking from "./pages-data/parking";
import boxrooms from "./pages-data/boxrooms";
import parkingProject from "./pages-data/parkingProject";
import parkingHouse from "./pages-data/parkingHouse";
import boxroomsProject from "./pages-data/boxroomsProject";
import boxroomsHouse from "./pages-data/boxroomsHouse";
import parkingProjectPlan from "./pages-data/parkingProjectPlan";
import boxroomsProjectPlan from "./pages-data/boxroomsProjectPlan";
import homeTwo from "./pages-data/home-2";

const pagesConfig = {
  ...home,
  ...homeTwo,
  ...project,
  ...catalog,
  ...flat,
  ...news,
  ...newsDetail,
  ...commercial,
  ...commercialList,
  ...commercialListTable,
  ...commercialDetail,
  ...parking,
  ...boxrooms,
  ...parkingProject,
  ...parkingHouse,
  ...boxroomsProject,
  ...boxroomsHouse,
  ...parkingProjectPlan,
  ...boxroomsProjectPlan,
};

export default pagesConfig;
