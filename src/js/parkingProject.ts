import Select from "./classes/Select";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { gsap } from "gsap";

export default function parkingProject() {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".parking-project"));

    gsap.registerPlugin(Draggable, ScrollTrigger);

    const mediaQuery = window.matchMedia('(min-width: 641px)');

    elements.forEach((element) => {
        const accordionButtons = element.querySelectorAll<HTMLButtonElement>(".button-accordion-arrow");
        const listItems = element.querySelectorAll<HTMLElement>(".parking-project__table-list-item");

        if (mediaQuery.matches) {
            // Логика для десктопа (больше 641px)
            accordionButtons.forEach((accordionButton) => {
                accordionButton.addEventListener("click", (event) => {
                    event.stopPropagation();  // Предотвращаем всплытие события
                    handleAccordionClick(accordionButton);
                });
            });

            listItems.forEach((listItem) => {
                listItem.addEventListener("click", (event) => {
                    if (!(event.target as HTMLElement).closest(".button-accordion-arrow") && !listItem.classList.contains("active")) {
                        handleAccordionClick(listItem);
                    }
                });
            });
        } else {
            // Логика для мобильных устройств (меньше 641px)
            listItems.forEach((listItem) => {
                const contentWrapper = listItem.querySelector<HTMLElement>(".parking-project__table-card-content-wrapper");

                // При клике на элемент списка добавляем классы
                listItem.addEventListener("click", () => {
                    document.body.classList.add("plan-show");
                    listItem.classList.add("active");
                });

                if (contentWrapper) {
                    // При клике на wrapper, не даем событию всплывать выше
                    contentWrapper.addEventListener("click", (event) => {
                        event.stopPropagation();  // Предотвращаем всплытие события
                        if (!contentWrapper.classList.contains("active")) {
                            contentWrapper.classList.add("active");
                            setupZoomAndDrag(listItem); // Передаем listItem, чтобы функция сработала корректно
                        }
                    });
                }

                // Обработка нажатия на кнопку "Назад"
                const backButton = listItem.querySelector<HTMLButtonElement>(".parking-project__table-card-content-button-back");

                if (backButton) {
                    backButton.addEventListener("click", (event) => {
                        event.stopPropagation();  // Предотвращаем всплытие события
                        document.body.classList.remove("plan-show");
                        listItem.classList.remove("active");
                        if (contentWrapper) {
                            contentWrapper.classList.remove("active");
                        }
                    });
                }
            });
        }

        function handleAccordionClick(clickedElement: HTMLElement) {
            if (clickedElement.closest<HTMLElement>(".parking-project__table-list-item")?.classList.contains("active")) {
                clickedElement.closest<HTMLElement>(".parking-project__table-list-item")?.classList.remove("active");
                return;
            }

            const allItems = element.querySelectorAll<HTMLElement>(".parking-project__table-list-item");
            allItems.forEach(item => item.classList.remove("active"));

            const listItem = clickedElement.closest<HTMLElement>(".parking-project__table-list-item");
            if (listItem) {
                listItem.classList.add("active");
                setupZoomAndDrag(listItem);
            }
        }

        function setupZoomAndDrag(container: HTMLElement) {
            const contentContainer = container.querySelector<HTMLDivElement>(".parking-project__image-draggable");
            const decreaseButton = container.querySelector<HTMLButtonElement>(".parking-project__decrease");
            const increaseButton = container.querySelector<HTMLButtonElement>(".parking-project__increase");

            if (!contentContainer || !decreaseButton || !increaseButton) {
                return;
            }

            const parentElement = contentContainer.parentElement;
            if (!parentElement) {
                return;
            }

            const initialScale = Math.min(
                parentElement.clientWidth / contentContainer.clientWidth,
                parentElement.clientHeight / contentContainer.clientHeight
            );

            let scale = initialScale;
            const minScale = parseFloat(parentElement.dataset.minScale || "1.0");
            const maxScale = parseFloat(parentElement.dataset.maxScale || "2.6");

            const updateScale = (): void => {
                scale = Math.max(minScale, Math.min(maxScale, scale));

                gsap.to(contentContainer, {
                    scale: scale,
                    duration: 0.3,
                    transformOrigin: "center center",
                    zIndex: 1,
                });

                toggleButtons();
            };

            const toggleButtons = (): void => {
                decreaseButton.disabled = scale <= minScale;
                increaseButton.disabled = scale >= maxScale;
            };

            const increaseScale = (): void => {
                if (scale < maxScale) {
                    scale += 0.1;
                    updateScale();
                }
            };

            const decreaseScale = (): void => {
                if (scale > minScale) {
                    scale -= 0.1;
                    updateScale();
                }
            };

            Draggable.create(contentContainer, {
                type: "x,y",
                edgeResistance: 0.65,
                bounds: parentElement,
                inertia: true,
                zIndexBoost: false,
            });

            increaseButton.addEventListener("click", (event) => {
                event.stopPropagation();  // Предотвращаем всплытие события
                increaseScale();
            });

            decreaseButton.addEventListener("click", (event) => {
                event.stopPropagation();  // Предотвращаем всплытие события
                decreaseScale();
            });

            contentContainer.addEventListener("wheel", (e: WheelEvent) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;

                scale += delta;
                updateScale();
            });

            updateScale();
            toggleButtons();
        }

        // Функционал фильтров и карты
        const openAllFiltersBtn = element.querySelectorAll<HTMLButtonElement>(".js-open-all-filters");
        const closeAllFiltersBtn = element.querySelectorAll<HTMLButtonElement>(".js-close-all-filters");
        const allFiltersModal = element.querySelector<HTMLElement>(".parking-project__all-filters-modal");
        const fixedShowFilters = element.querySelector<HTMLButtonElement>(".parking-project__fixed-show-filters");

        const sortSelects = Array.from(element.querySelectorAll<HTMLElement>(".parking-project__sort"));
        sortSelects.forEach((select) => new Select(select));

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

        // Добавляем функционал попапа "Подробнее"
        const moreButtons = element.querySelectorAll<HTMLButtonElement>(".parking-project__more");

        moreButtons.forEach((moreButton) => {
            moreButton.addEventListener("click", (event) => {
                event.preventDefault();
                openMoreModal(moreButton);
            });
        });

        function openMoreModal(moreButton: HTMLButtonElement) {
            const listItem = moreButton.closest<HTMLElement>(".parking-project__table-list-item");
            if (!listItem) return;

            // Создаем попап
            const modal = document.createElement("div");
            modal.classList.add("parking-project__modal-more");

            const modalWrapper = document.createElement("div");
            modalWrapper.classList.add("parking-project__modal-more-wrapper");
            modal.appendChild(modalWrapper);


            // Добавляем контент в попап
            const title = listItem.querySelector<HTMLElement>(".parking-project__table-card-content-title");
            const price = listItem.querySelector<HTMLElement>(".parking-project__table-card-content-price");
            const options = listItem.querySelector<HTMLElement>(".parking-project__table-card-content-options");


            if (title) modalWrapper.appendChild(title.cloneNode(true));
            if (price) modalWrapper.appendChild(price.cloneNode(true));
            if (options) modalWrapper.appendChild(options.cloneNode(true));

            // Добавляем кнопку закрытия попапа
            const closeButton = document.createElement("button");
            closeButton.classList.add("parking-project__modal-more-close", "js-close-modal-mores");
            closeButton.innerHTML = `
                <svg width="14" height="14" aria-hidden="true">
                    <use xlink:href="#modal-close"></use>
                </svg>
            `;
            closeButton.addEventListener("click", () => closeModal(modal, moreButton));
            modalWrapper.appendChild(closeButton);

            // Добавляем попап в body
            document.body.appendChild(modal);

            // Скрываем кнопку "Подробнее" и показываем "Заказать звонок"
            moreButton.style.display = "none";
            const orderCallButton = listItem.querySelector<HTMLElement>(".parking-project__order-call");
            if (orderCallButton) {
                orderCallButton.style.display = "flex";
            }
        }

        function closeModal(modal: HTMLElement, moreButton: HTMLButtonElement) {
            // Удаляем попап
            modal.remove();

            // Показываем кнопку "Подробнее" и скрываем "Заказать звонок"
            moreButton.style.display = "flex";
            const listItem = moreButton.closest<HTMLElement>(".parking-project__table-list-item");
            const orderCallButton = listItem?.querySelector<HTMLElement>(".parking-project__order-call");
            if (orderCallButton) {
                orderCallButton.style.display = "none";
            }
        }
    });

    mediaQuery.addEventListener('change', () => {
        window.location.reload();
    });
}
