import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import Select from "./classes/Select";

export default function parkingProjectPlan() {
    const houseItems = document.querySelectorAll<HTMLElement>(".parking-project__plan-list-item");

    gsap.registerPlugin(Draggable);

    const mediaQuery = window.matchMedia('(min-width: 641px)');

    houseItems.forEach((houseItem) => {
        const floorSwitchItems = houseItem.querySelectorAll<HTMLElement>(".parking-project__plan-card-floor-switch-item");
        const floors = houseItem.querySelectorAll<HTMLElement>(".parking-project__plan-card-floor");
        const mobileSelect = houseItem.querySelector<HTMLElement>('.filters__form-select-dropdown-inner');

        setupFloorSwitch(houseItem, floorSwitchItems, floors);
        setupZoomAndDrag(houseItem);
        setupMobileFloorSwitch(houseItem, mobileSelect, floors);

        setupSortSelect(houseItem);
    });

    setupPopupsAndMarkers();

    window.addEventListener("resize", () => {
        handleResize();
    });

    function handleResize() {
        houseItems.forEach((houseItem) => {
            const floorSwitchItems = houseItem.querySelectorAll<HTMLElement>(".parking-project__plan-card-floor-switch-item");
            const floors = houseItem.querySelectorAll<HTMLElement>(".parking-project__plan-card-floor");
            const mobileSelect = houseItem.querySelector<HTMLElement>('.filters__form-select-dropdown-inner');

            setupFloorSwitch(houseItem, floorSwitchItems, floors);
            setupZoomAndDrag(houseItem);
            setupMobileFloorSwitch(houseItem, mobileSelect, floors);
            setupSortSelect(houseItem);
        });

        setupPopupsAndMarkers();
    }

    function setupSortSelect(houseItem: HTMLElement) {
        const sortSelects = Array.from(houseItem.querySelectorAll<HTMLElement>(".parking-project__plan-sort"));

        sortSelects.forEach((selectElement) => {
            const select = new Select(selectElement);

            const selectedOption = selectElement.querySelector('input[type="radio"]:checked') as HTMLInputElement | null;
            if (selectedOption) {
                const sortBtnText = selectElement.querySelector<HTMLElement>('.parking-project__plan-sort-btn-text');
                if (sortBtnText) {
                    sortBtnText.textContent = selectedOption.value;
                }
            }

            selectElement.addEventListener('change', () => {
                const selectedOption = selectElement.querySelector('input[type="radio"]:checked') as HTMLInputElement | null;
                if (selectedOption) {
                    const selectedFloorId = selectedOption.getAttribute('data-id');
                    const switchItem = houseItem.querySelector<HTMLElement>(`#${selectedFloorId}`);

                    const sortBtnText = selectElement.querySelector<HTMLElement>('.parking-project__plan-sort-btn-text');
                    if (sortBtnText) {
                        sortBtnText.textContent = selectedOption.value;
                    }

                    if (switchItem) {
                        switchItem.click();
                    }
                }
            });
        });
    }

    function setupFloorSwitch(houseItem: HTMLElement, floorSwitchItems: NodeListOf<HTMLElement>, floors: NodeListOf<HTMLElement>) {
        floorSwitchItems.forEach((switchItem) => {
            switchItem.addEventListener("click", () => {
                floorSwitchItems.forEach(item => item.classList.remove("active"));
                floors.forEach(floor => floor.classList.remove("active"));

                switchItem.classList.add("active");
                const targetFloor = houseItem.querySelector<HTMLElement>(`#${switchItem.id.replace("switch", "floor")}`);
                if (targetFloor) {
                    targetFloor.classList.add("active");
                }

                setupZoomAndDrag(houseItem);
            });
        });
    }

    function setupMobileFloorSwitch(houseItem: HTMLElement, mobileSelect: HTMLElement | null, floors: NodeListOf<HTMLElement>) {
        if (!mobileSelect) return;

        const radioInputs = mobileSelect.querySelectorAll<HTMLInputElement>('input[type="radio"]');

        radioInputs.forEach((radioInput) => {
            radioInput.addEventListener('change', () => {
                const selectedFloorId = radioInput.getAttribute('data-id');
                const switchItem = houseItem.querySelector<HTMLElement>(`#${selectedFloorId}`);

                if (switchItem) {
                    switchItem.click();
                }
            });
        });
    }

    function setupZoomAndDrag(houseItem: HTMLElement) {
        const activeFloor = houseItem.querySelector<HTMLElement>(".parking-project__plan-card-floor.active");
        if (!activeFloor) return;

        const zoomableContainer = activeFloor.querySelector<HTMLElement>(".parking-project__zoom");
        const contentContainer = zoomableContainer?.querySelector<HTMLElement>(".parking-project__image-draggable");
        const decreaseButton = activeFloor.querySelector<HTMLButtonElement>(".parking-project__zoom-control.parking-project__decrease");
        const increaseButton = activeFloor.querySelector<HTMLButtonElement>(".parking-project__zoom-control.parking-project__increase");

        if (!contentContainer || !decreaseButton || !increaseButton) {
            return;
        }

        let scale = 1.0;
        const minScale = 1.0;
        const maxScale = 2.6;

        const updateScale = () => {
            scale = Math.max(minScale, Math.min(maxScale, scale));
            gsap.to(contentContainer, {
                scale: scale,
                duration: 0.3,
                transformOrigin: "center center",
            });
            toggleButtons();
        };

        const toggleButtons = () => {
            decreaseButton.disabled = scale <= minScale;
            increaseButton.disabled = scale >= maxScale;
        };

        // Поддержка для десктопа (Draggable)
        if (mediaQuery.matches) {
            Draggable.create(contentContainer, {
                type: "x,y",
                edgeResistance: 0.65,
                bounds: zoomableContainer?.querySelector(".parking-project__image-wrapper"),
                inertia: true,
                zIndexBoost: false,
            });
        }

        // Поддержка для мобильных устройств (touch)
        contentContainer.addEventListener("touchstart", handleTouchStart, { passive: true });
        contentContainer.addEventListener("touchmove", handleTouchMove, { passive: false });
        contentContainer.addEventListener("touchend", handleTouchEnd);

        let startDistance = 0;

        function handleTouchStart(event: TouchEvent) {
            if (event.touches.length === 2) {
                startDistance = getDistance(event.touches);
            }
        }

        function handleTouchMove(event: TouchEvent) {
            if (event.touches.length === 2) {
                event.preventDefault();
                const currentDistance = getDistance(event.touches);
                scale = scale * (currentDistance / startDistance);
                updateScale();
            }
        }

        function handleTouchEnd() {
            startDistance = 0;
        }

        function getDistance(touches: TouchList) {
            const touch1 = touches[0];
            const touch2 = touches[1];
            return Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
        }

        increaseButton.addEventListener("click", () => {
            scale += 0.1;
            updateScale();
        });

        decreaseButton.addEventListener("click", () => {
            scale -= 0.1;
            updateScale();
        });

        contentContainer.addEventListener("wheel", (e: WheelEvent) => {
            e.preventDefault();
            scale += e.deltaY > 0 ? -0.1 : 0.1;
            updateScale();
        });

        updateScale();
    }

    function setupPopupsAndMarkers() {
        const markers = document.querySelectorAll<SVGElement>('[id^="marker-"]');
        const popups = document.querySelectorAll<HTMLElement>('[id^="popup-"]');

        const isMobile = window.innerWidth <= 640;

        markers.forEach(marker => {
            const markerId = marker.id;
            const popupId = markerId.replace("marker", "popup");
            const popup = document.getElementById(popupId);

            if (popup) {
                let isHoveringPopup = false;
                let isHoveringMarker = false;
                let isPopupPositioned = false;

                if (!isMobile) {

                    marker.addEventListener("mouseenter", () => {
                        isHoveringMarker = true;
                        if (document.body.classList.contains("is-dragging")) return;

                        if (!isPopupPositioned) {
                            const markerRect = marker.getBoundingClientRect();
                            const contentWrapper = marker.closest<HTMLElement>(".parking-project__plan-card-content-wrapper");

                            if (contentWrapper) {
                                const wrapperRect = contentWrapper.getBoundingClientRect();
                                const popupWidth = popup.offsetWidth;
                                const popupHeight = popup.offsetHeight;

                                popup.style.left = `${markerRect.left - wrapperRect.left + markerRect.width / 2 - popupWidth / 2}px`;
                                popup.style.top = `${markerRect.top - wrapperRect.top - popupHeight - 10}px`;

                                isPopupPositioned = true;
                            }
                        }

                        popup.classList.add("active");
                        popup.style.position = "absolute";
                        popup.style.zIndex = "1000";
                    });

                    marker.addEventListener("mouseleave", () => {
                        isHoveringMarker = false;
                        setTimeout(() => {
                            if (!isHoveringPopup && !isHoveringMarker) {
                                popup.classList.remove("active");
                            }
                        }, 200);
                    });

                    popup.addEventListener("mouseenter", () => {
                        isHoveringPopup = true;
                        popup.classList.add("active");
                    });

                    popup.addEventListener("mouseleave", () => {
                        isHoveringPopup = false;
                        setTimeout(() => {
                            if (!isHoveringPopup && !isHoveringMarker) {
                                popup.classList.remove("active");
                            }
                        }, 200);
                    });
                }
            }
        });
    }
}
