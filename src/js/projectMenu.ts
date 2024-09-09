import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { callAfterResize } from "./utils";

gsap.registerPlugin(ScrollTrigger);

export default function projectMenu() {
  const projectMenu = document.querySelector<HTMLElement>(".project-menu");
  const pageHeader = document.querySelector<HTMLElement>(".page-header");
  const toggleMenu = document.querySelector<HTMLButtonElement>(
    ".project-menu__mobile-toggle-btn"
  );
  const toggleDropdown = document.querySelector<HTMLElement>(
    ".project-menu__mobile"
  );
  const overlay = document.querySelector<HTMLElement>(".project-menu-overlay");
  const mobileLinks = Array.from(
    document.querySelectorAll<HTMLElement>(".project-menu__mobile-card-link")
  );
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

  if (toggleDropdown && toggleMenu) {
    toggleMenu.addEventListener("click", (event) => {
      event.preventDefault();
      toggleDropdown.classList.toggle("active");
    });

    if (overlay) {
      overlay.addEventListener("click", () => {
        toggleDropdown.classList.remove("active");
      });
    }

    mobileLinks.forEach((link) =>
      link.addEventListener("click", () => {
        toggleDropdown.classList.remove("active");
      })
    );
  }

  const desktopSelector = projectMenu.querySelector<HTMLElement>(
    ".project-menu__selector"
  )!;
  const desktopSelectorText = desktopSelector?.querySelector<HTMLElement>(
    ".js-project-menu-selector-text"
  )!;
  const desktopSelectorOptions = Array.from(
    desktopSelector.querySelectorAll<HTMLElement>(
      ".js-project-menu-selector-option"
    )
  );

  const desktopSelectorBtn = desktopSelector.querySelector<HTMLElement>(
    ".project-menu__selector-btn"
  );

  const mobileBtnText = projectMenu.querySelector<HTMLElement>(
    ".project-menu__mobile-toggle-btn-text"
  )!;

  const mobileOptions = Array.from(
    projectMenu.querySelectorAll<HTMLElement>(".js-mobile-option")
  );

  desktopSelectorBtn?.addEventListener("mouseenter", () => {
    desktopSelector.classList.add("active");
  });
  desktopSelectorBtn?.addEventListener("click", () => {
    desktopSelector.classList.add("active");
  });

  desktopSelector.addEventListener("mouseleave", () => {
    desktopSelector.classList.remove("active");
  });

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (
      target.matches(".js-project-menu-selector") ||
      target.closest(".js-project-menu-selector")
    )
      return;
    desktopSelector.classList.remove("active");
  });

  desktopSelectorOptions.forEach((option, optionIndex) => {
    option.addEventListener("click", () => {
      desktopSelectorOptions.forEach((option) =>
        option.classList.remove("active")
      );
      option.classList.add("active");
      mobileOptions.forEach((option) => option.classList.remove("active"));
      mobileOptions[optionIndex].classList.add("active");
      desktopSelectorText.textContent = option.textContent!.trim();
      mobileBtnText.textContent = option.textContent!.trim();
      desktopSelector.classList.remove("active");
    });
  });

  mobileOptions.forEach((option, optionIndex) => {
    option.addEventListener("click", (event) => {
      desktopSelectorOptions.forEach((option) =>
        option.classList.remove("active")
      );
      desktopSelectorOptions[optionIndex].classList.add("active");
      mobileOptions.forEach((option) => option.classList.remove("active"));
      mobileOptions[optionIndex].classList.add("active");
      desktopSelectorText.textContent = option.textContent!.trim();
      mobileBtnText.textContent = option.textContent!.trim();
      desktopSelector.classList.remove("active");

      console.log("Mobile option click");
    });
  });
}
