import Swiper from "swiper";
import "swiper/css";
import { Controller, Thumbs } from "swiper/modules";

export default function gallery() {
    const mql = window.matchMedia("(max-width: 640px)");
    let buttonsSwiper: Swiper | null = null;

    function initializeSwiperForTab(tabNumber: string, isSmallScreen: boolean) {
        const mainSliderElement = document.querySelector<HTMLElement>(`.gallery-tabs__swiper--${tabNumber}`);
        const navSliderElement = document.querySelector<HTMLElement>(`.gallery-tabs__nav-swiper--${tabNumber}`);

        if (!mainSliderElement) return;

        const mainSlider = mainSliderElement as unknown as { swiper: Swiper };
        const navSlider = navSliderElement as unknown as { swiper: Swiper };

        if (mainSlider?.swiper) {
            mainSlider.swiper.destroy(true, true);
        }
        if (navSlider?.swiper) {
            navSlider.swiper.destroy(true, true);
        }

        let thumbsSwiper: Swiper | null = null;

        if (!isSmallScreen && navSliderElement) {
            thumbsSwiper = new Swiper(navSliderElement, {
                modules: [Controller, Thumbs],
                direction: 'vertical',
                slidesPerView: 'auto',
                spaceBetween: 10,
                freeMode: true,
                watchOverflow: true,
                slideToClickedSlide: true,
            });
        }

        new Swiper(mainSliderElement, {
            modules: [Controller, Thumbs],
            slidesPerView: "auto",
            freeMode: true,
            spaceBetween: isSmallScreen ? 16 : 0,
            loop: !isSmallScreen,
            thumbs: isSmallScreen ? undefined : { swiper: thumbsSwiper! },
            slidesOffsetBefore: isSmallScreen ? 16 : 0,
            slidesOffsetAfter: isSmallScreen ? 16 : 0,
        });
    }

    function initializeAllSwipers(isSmallScreen: boolean) {
        initializeSwiperForTab("1", isSmallScreen);
        initializeSwiperForTab("2", isSmallScreen);
        initializeSwiperForTab("3", isSmallScreen);
        initializeSwiperForTab("4", isSmallScreen);
    }

    function handleTabs() {
        const tabsButtons = Array.from(document.querySelectorAll<HTMLElement>('.gallery-tabs__button'));
        const tabsContent = Array.from(document.querySelectorAll<HTMLElement>('.gallery-tabs__slider'));

        tabsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tabLink;

                tabsButtons.forEach(btn => btn.classList.remove('gallery-tabs__button--active'));
                tabsContent.forEach(content => {
                    content.classList.remove('gallery-tabs__slider--active');
                    content.style.opacity = '0';
                });

                button.classList.add('gallery-tabs__button--active');
                const activeContent = document.querySelector<HTMLElement>(`[data-tab-content="${targetTab}"]`);
                if (activeContent) {
                    activeContent.classList.add('gallery-tabs__slider--active');
                    activeContent.style.opacity = '1';
                    initializeSwiperForTab(targetTab!, mql.matches);
                }
            });
        });

        const initialTab = document.querySelector<HTMLElement>('.gallery-tabs__button--active');
        if (initialTab) {
            initializeSwiperForTab(initialTab.dataset.tabLink!, mql.matches);
        }
    }

    function initButtonsSwiper(isSmallScreen: boolean) {
        const buttonsSwiperContainer = document.querySelector<HTMLElement>('.gallery-tabs__buttons');

        if (!buttonsSwiperContainer) return;

        if (isSmallScreen && !buttonsSwiper) {
            buttonsSwiper = new Swiper(buttonsSwiperContainer, {
                slidesPerView: 'auto',
                spaceBetween: 0,
                freeMode: true,
                slidesOffsetBefore: 16,
                slidesOffsetAfter: 16,
            });
        } else if (!isSmallScreen && buttonsSwiper) {
            buttonsSwiper.destroy(true, true);
            buttonsSwiper = null;
        }
    }

    window.addEventListener('load', () => {
        initializeAllSwipers(mql.matches);
        handleTabs();
        initButtonsSwiper(mql.matches);
    });

    mql.addEventListener('change', (e) => {
        initializeAllSwipers(e.matches);
        initButtonsSwiper(e.matches);
    });
}
