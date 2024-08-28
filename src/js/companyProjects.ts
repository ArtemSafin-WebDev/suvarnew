export default function companyProjects() {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (
      target.matches(".company-projects__card-info") ||
      target.closest(".company-projects__card-info")
    ) {
      const card = target.closest(".company-projects__card");

      card?.classList.toggle("info-shown");
    }
  });
}
