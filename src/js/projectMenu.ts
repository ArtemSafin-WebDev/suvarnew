import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { callAfterResize } from "./utils";

gsap.registerPlugin(ScrollTrigger);

export default function projectMenu() {
  const projectMenu = document.querySelector<HTMLElement>(".project-menu");
  const pageHeader = document.querySelector<HTMLElement>(".page-header");

  if (!pageHeader || !projectMenu) return;

  let headerHeight = pageHeader.offsetHeight;
  let menuHeight = projectMenu.offsetHeight;

  const showHeader = () => {
    document.body.classList.remove("header-hidden");

    const tl = gsap.timeline();
    tl.to(pageHeader, {
      yPercent: 0,
      duration: 0.4,
    }).to(
      projectMenu,
      {
        y: () => Math.ceil(headerHeight - 1),
        duration: 0.4,
      },
      0
    );
  };
  const hideHeader = () => {
    document.body.classList.add("header-hidden");

    const tl = gsap.timeline();
    tl.to(pageHeader, {
      yPercent: -100,
      duration: 0.4,
    }).to(
      projectMenu,
      {
        y: 0,
        duration: 0.4,
      },
      0
    );
  };
  const checkHeader = () => {
    headerHeight = pageHeader.offsetHeight;
    menuHeight = projectMenu.offsetHeight;
    document.documentElement.style.scrollPaddingTop = `${
      headerHeight + menuHeight
    }px`;
    if (window.scrollY > window.innerHeight) {
      const tl = gsap.timeline();
      tl.to(projectMenu, {
        autoAlpha: 1,
        duration: 0.2,
      });
      //   pageHeader.classList.add("page-header--fixed");
    } else {
      const tl = gsap.timeline();
      tl.to(projectMenu, {
        autoAlpha: 0,
        duration: 0.2,
      });
      //   pageHeader.classList.remove("page-header--fixed");
    }
  };

  checkHeader();
  window.addEventListener("scroll", () => {
    checkHeader();
  });

  callAfterResize(() => {
    checkHeader();
  }, 300);

  ScrollTrigger.create({
    onUpdate: (self) => {
      const direction = self.direction;

      if (window.scrollY < window.innerHeight) {
        showHeader();
        return;
      }

      if (direction === 1) {
        hideHeader();
      } else {
        showHeader();
      }
    },
  });
}
