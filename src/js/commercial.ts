import Select from "./classes/Select";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function commercial() {
  const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".commercial")
  );

  elements.forEach((element) => {
    const openAllFiltersBtn = element.querySelectorAll<HTMLButtonElement>(
        ".js-open-all-filters"
    );
    const closeAllFiltersBtn = element.querySelectorAll<HTMLButtonElement>(
        ".js-close-all-filters"
    );
    const allFiltersModal = element.querySelector<HTMLElement>(
        ".commercial__all-filters-modal"
    );
    const fixedShowFilters = element.querySelector<HTMLButtonElement>(
        ".commercial__fixed-show-filters"
    );

    const sortSelects = Array.from(
        element.querySelectorAll<HTMLElement>(".commercial__sort")
    );
    sortSelects.forEach((select) => new Select(select));

    const mainTabBtns = Array.from(
        element.querySelectorAll<HTMLElement>(".commercial-tabs__tabs-nav-link")
    );

    const mainTabItems = Array.from(
        element.querySelectorAll<HTMLElement>(".commercial-tabs__tabs-item")
    );

    const mobileMapOpen = element.querySelector<HTMLElement>(".js-map-open");
    const mobileMapClose = element.querySelector<HTMLElement>(".js-map-close");

    mobileMapOpen?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.add("map-modal-shown");
    });
    mobileMapClose?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.remove("map-modal-shown");
    });

    const setActiveTab = (index: number) => {
      mainTabBtns.forEach((btn) => btn.classList.remove("active"));
      mainTabItems.forEach((btn) => btn.classList.remove("active"));

      mainTabBtns[index]?.classList.add("active");
      mainTabItems[index]?.classList.add("active");
    };

    if (mainTabItems.length) {
      setActiveTab(0);
    }

    mainTabBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        setActiveTab(btnIndex);
      });
    });

    const checkScroll = () => {
      if (window.scrollY > window.innerHeight) {
        fixedShowFilters?.classList.add("shown");
      } else {
        fixedShowFilters?.classList.remove("shown");
      }
    };

    if (fixedShowFilters) {
      checkScroll();
      window.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    allFiltersModal?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target === allFiltersModal) {
        document.body.classList.remove("all-filters-shown");
      }
    });

    openAllFiltersBtn.forEach((btn) =>
        btn.addEventListener("click", (event) => {
          event.preventDefault();
          document.body.classList.add("all-filters-shown");
        })
    );

    closeAllFiltersBtn.forEach((btn) =>
        btn.addEventListener("click", (event) => {
          event.preventDefault();
          document.body.classList.remove("all-filters-shown");
        })
    );

    const mapElement = element.querySelector<HTMLElement>(".cm-projects__map");
    const rightColumn = element.querySelector<HTMLElement>(".cm-projects__right");

    let scrollTriggerInstance: ScrollTrigger | null = null;

    const enableScrollTrigger = () => {
      if (window.innerWidth > 641) {
        if (!scrollTriggerInstance && mapElement && rightColumn) {
          scrollTriggerInstance = ScrollTrigger.create({
            trigger: rightColumn,
            start: "top top",
            end: () => `+=${rightColumn.offsetHeight - mapElement.offsetHeight}`,
            pin: mapElement,
            pinSpacing: false,
            markers: false,
          });
        }
      } else {
        if (scrollTriggerInstance) {
          scrollTriggerInstance.kill();
          scrollTriggerInstance = null;
          mapElement?.style.removeProperty('position');
          mapElement?.style.removeProperty('top');
          mapElement?.style.removeProperty('width');
        }
      }
    };

    const onScroll = () => {
      if (!scrollTriggerInstance) {
        enableScrollTrigger();
        window.addEventListener("resize", enableScrollTrigger);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener('resize', enableScrollTrigger);
  });
}
