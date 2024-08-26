import Select from "./classes/Select";

export default function newsList() {
    const elements = Array.from(
        document.querySelectorAll<HTMLElement>(
            ".filters, .news-head__filters"
        )
    );

    elements.forEach((element) => {
        const selects = Array.from(
            element.querySelectorAll<HTMLElement>(".filters__form-select")
        );

        selects.forEach((select) => new Select(select));

        const closeFiltersBtns = Array.from(
            document.querySelectorAll<HTMLButtonElement>(".js-filters-close")
        );
        const openFiltersBtns = Array.from(
            document.querySelectorAll<HTMLButtonElement>(".js-filters-open")
        );

        const sortSelects = Array.from(
            element.querySelectorAll<HTMLElement>(".news-head__sort")
        );
        sortSelects.forEach((select) => new Select(select));
    });
}
