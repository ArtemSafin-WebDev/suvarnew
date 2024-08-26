export default function mortgageVariants() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".mortgage-variants")
  );

  elements.forEach((element) => {
    const modal = document.querySelector<HTMLElement>(
      ".mortgage-variants__modal"
    )!;
    const openModalBtns = Array.from(
      element.querySelectorAll<HTMLElement>(".mortgage-variants__card-link")
    );

    const closeModalBtns = Array.from(
      modal.querySelectorAll(".mortgage-variants__modal-close")
    );
    const mainTabBtns = Array.from(
      element.querySelectorAll<HTMLElement>(".mortgage-variants__tabs-nav-link")
    );

    const mainTabItems = Array.from(
      element.querySelectorAll<HTMLElement>(".mortgage-variants__tabs-item")
    );
    const modalTabItems = Array.from(
      modal.querySelectorAll<HTMLElement>(".mortgage-variants__modal-tabs-item")
    );
    const modalTabBtns = Array.from(
      modal.querySelectorAll<HTMLElement>(".mortgage-variants__modal-nav-link")
    );

    const setActiveTab = (index: number) => {
      mainTabBtns.forEach((btn) => btn.classList.remove("active"));
      modalTabBtns.forEach((btn) => btn.classList.remove("active"));
      modalTabItems.forEach((btn) => btn.classList.remove("active"));
      mainTabItems.forEach((btn) => btn.classList.remove("active"));

      mainTabBtns[index]?.classList.add("active");
      modalTabBtns[index]?.classList.add("active");
      modalTabItems[index]?.classList.add("active");
      mainTabItems[index]?.classList.add("active");
    };

    if (mainTabItems.length) {
      setActiveTab(0);
    }

    const openModal = () => {
      modal?.classList.add("active");
      document.body.classList.add("modal-open");
    };
    const closeModal = () => {
      modal?.classList.remove("active");
      document.body.classList.remove("modal-open");
    };

    openModalBtns.forEach((btn, btnIndex) =>
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        openModal();
        setActiveTab(btnIndex);
      })
    );
    closeModalBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        closeModal();
      })
    );

    modalTabBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        setActiveTab(btnIndex);
      });
    });
    mainTabBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        setActiveTab(btnIndex);
      });
    });
  });
}
