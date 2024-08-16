export default function plan() {
  const mql = window.matchMedia("(max-width: 640px)");
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".plan"));

  elements.forEach((element) => {
    const points = Array.from(
      element.querySelectorAll<HTMLElement>(".plan__map-point")
    );
    const mobilePopupsContainer = element.querySelector(
      ".plan__mobile-popups-container"
    );

    element.addEventListener("touchstart", () => {
      element.classList.add("touched");
    });

    const tabsOuter = Array.from(
      element.querySelectorAll<HTMLElement>(".plan__tabs-outer-item")
    );
    const tabsOuterBtns = Array.from(
      element.querySelectorAll(".plan__outer-tabs-btn")
    );

    const setActive = (index: number) => {
      tabsOuter.forEach((tab) => tab.classList.remove("active"));
      tabsOuterBtns.forEach((btn) => btn.classList.remove("active"));
      tabsOuter[index]?.classList.add("active");
      tabsOuterBtns[index]?.classList.add("active");
    };

    setActive(0);

    tabsOuterBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        setActive(btnIndex);
      });
    });

    tabsOuter.forEach((tab) => {
      const innerTabs = Array.from(
        tab.querySelectorAll<HTMLElement>(".plan__tabs-inner-item")
      );
      const innerBtns = Array.from(
        tab.querySelectorAll<HTMLElement>(".plan__tabs-inner-inner-btn")
      );
      const setActive = (index: number) => {
        innerTabs.forEach((tab) => tab.classList.remove("active"));
        innerBtns.forEach((btn) => btn.classList.remove("active"));
        innerTabs[index]?.classList.add("active");
        innerBtns[index]?.classList.add("active");
      };

      setActive(0);

      innerBtns.forEach((btn, btnIndex) => {
        btn.addEventListener("click", (event) => {
          event.preventDefault();
          setActive(btnIndex);
        });
      });
    });

    points.forEach((point) => {
      const pointPopover =
        point.querySelector<HTMLElement>(".plan__map-popover");
      const pointInner = point.querySelector<HTMLElement>(
        ".plan__map-point-inner"
      );
      const closeBtn = point.querySelector<HTMLButtonElement>(
        ".plan__map-popover-close"
      );
      if (!pointPopover) return;

      pointInner?.addEventListener("click", (event) => {
        event.preventDefault();
        pointPopover.classList.add("active");
        document.body.classList.add("plan-popver-shown");
      });

      closeBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        pointPopover.classList.remove("active");
        document.body.classList.remove("plan-popver-shown");
      });

      const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
          mobilePopupsContainer?.appendChild(pointPopover);
        } else {
          point.appendChild(pointPopover);
        }
      };

      mql.addEventListener("change", handleWidthChange);

      handleWidthChange(mql);
    });
  });
}
