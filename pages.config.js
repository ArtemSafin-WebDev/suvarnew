import home from "./pages-data/home";
import project from "./pages-data/project";
import catalog from "./pages-data/catalog";
import flat from "./pages-data/flat";
import news from "./pages-data/news";
import newsDetail from "./pages-data/newsDetail";

const pagesConfig = {
  ...home,
  ...project,
  ...catalog,
  ...flat,
  ...news,
  ...newsDetail,
};

export default pagesConfig;
