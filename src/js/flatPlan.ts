import Swiper from 'swiper';
import 'swiper/css';
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function flatPlan(): void {
    const tabNavItems = document.querySelectorAll<HTMLLIElement>(".flat-plan-tabs__nav-item");
    const tabContents = document.querySelectorAll<HTMLDivElement>(".flat-plan-tabs__content");

    const decreaseButton = document.querySelector<HTMLButtonElement>(".flat-plan-tabs__decrease");
    const increaseButton = document.querySelector<HTMLButtonElement>(".flat-plan-tabs__increase");
    const contentContainer = document.querySelector<HTMLDivElement>(".flat-plan-tabs__image-draggable");

    const accordionTitle = document.querySelector<HTMLDivElement>(".flat-plan__accordion-title");
    const accordionContent = document.querySelector<HTMLDivElement>(".flat-plan__accordion-content");

    const flatPlanTabs = document.querySelector(".flat-plan-tabs") as HTMLElement;
    const flatPlanLeft = document.querySelector(".flat-plan__left") as HTMLElement;

    if (!contentContainer || !decreaseButton || !increaseButton || !accordionTitle || !accordionContent || !flatPlanTabs || !flatPlanLeft) {
        return;
    }

    gsap.registerPlugin(Draggable, ScrollTrigger);

    let swiperInstance: Swiper | null = null;

    const parentElement = contentContainer.parentElement;
    if (!parentElement) {
        return;
    }

    let scale = parseFloat(parentElement.dataset.defaultScale || "1.7");
    const minScale = parseFloat(parentElement.dataset.minScale || "1.2");
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

    increaseButton.addEventListener("click", increaseScale);
    decreaseButton.addEventListener("click", decreaseScale);

    contentContainer.addEventListener("wheel", (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;

        scale += delta;
        updateScale();
    });

    const activateTab = (tabIndex: number): void => {
        tabNavItems.forEach((item, index) => {
            item.classList.toggle("active", index === tabIndex);
        });

        tabContents.forEach((content, index) => {
            content.classList.toggle("active", index === tabIndex);
        });
    };

    tabNavItems.forEach((tabNavItem, index) => {
        tabNavItem.addEventListener("click", () => {
            activateTab(index);
        });
    });

    activateTab(0);
    updateScale();
    toggleButtons();

    accordionTitle.addEventListener("click", () => {
        const isActive = accordionContent.classList.contains("active");

        if (isActive) {
            gsap.to(accordionContent, {
                height: 0,
                duration: 0.5,
                ease: "power1.inOut",
                onComplete: () => {
                    accordionContent.classList.remove("active");
                    accordionTitle.textContent = "Все параметры";
                },
            });
        } else {
            accordionContent.classList.add("active");
            const contentHeight = accordionContent.scrollHeight;

            gsap.fromTo(
                accordionContent,
                { height: 0 },
                {
                    height: contentHeight,
                    duration: 0.5,
                    ease: "power1.inOut",
                    onComplete: () => {
                        accordionTitle.textContent = accordionTitle.dataset.text || "Свернуть";
                    },
                }
            );
        }
    });

    gsap.set(accordionContent, { height: 0 });

    const mql = window.matchMedia("(min-width: 641px)");

    const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
            const tabsHeight = flatPlanTabs.offsetHeight;

            ScrollTrigger.create({
                trigger: flatPlanLeft,
                start: `top top`,
                end: () => `bottom-=${tabsHeight}px top`,
                pin: flatPlanTabs,
                pinSpacing: false,
                pinReparent: true,
                markers: false,
                onEnter: () => {
                    gsap.set(flatPlanTabs, { top: "80px" });
                },
                onEnterBack: () => {
                    gsap.set(flatPlanTabs, { top: "80px" });
                },
                onLeave: () => {
                    gsap.set(flatPlanTabs, { top: "0px" });
                },
            });
        } else {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        }
    };

    mql.addEventListener("change", handleWidthChange);

    handleWidthChange(mql);

    const initializeSwiper = () => {
        if (swiperInstance) swiperInstance.destroy();
        swiperInstance = new Swiper('.flat-plan-tabs-nav', {
            slidesPerView: 'auto',
            spaceBetween: 0,
            freeMode: true,
            slidesOffsetBefore: 16,
            slidesOffsetAfter: 16,
        });
    };

    const destroySwiper = () => {
        if (swiperInstance) {
            swiperInstance.destroy();
            swiperInstance = null;
        }
    };

    const handleSwiperInit = () => {
        const swiperMql = window.matchMedia("(max-width: 640px)");
        const handleSwiperChange = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                initializeSwiper();
            } else {
                destroySwiper();
            }
        };

        swiperMql.addEventListener("change", handleSwiperChange);
        handleSwiperChange(swiperMql);
    };

    handleSwiperInit();

    const button = document.querySelector<HTMLButtonElement>(".flat-plan__button--border");

    if (!button) return;

    const updateButtonText = (e: MediaQueryListEvent | MediaQueryList) => {
        const currentText = button.textContent?.trim();
        const dataText = button.getAttribute("data-button-text");

        if (!currentText || !dataText) return;

        if (e.matches) {
            button.setAttribute("data-button-text", currentText);
            button.textContent = dataText;
        } else {
            button.textContent = button.getAttribute("data-button-text") || "";
            button.setAttribute("data-button-text", currentText);
        }
    };

    mql.addEventListener("change", updateButtonText);
    updateButtonText(mql);
}
