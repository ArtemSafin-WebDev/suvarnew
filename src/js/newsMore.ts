import Swiper from "swiper";
import "swiper/css";
import { EffectFade, Pagination, Navigation } from "swiper/modules";

import {gsap} from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default function newsMore() {
    const elements = Array.from(
        document.querySelectorAll<HTMLElement>(".news-more")
    );
    elements.forEach((element) => {

    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;

        let swiperInstance: Swiper | null = null;

    const mql = window.matchMedia("(max-width: 640px)");

        const initSwiper = (isSmallScreen: boolean) => {
        if (swiperInstance) swiperInstance.destroy(true, true);

        swiperInstance = new Swiper(container, {
            speed: 600,
            modules: [Navigation],
            slidesPerView: "auto",
            navigation: {
                prevEl: element.querySelector<HTMLButtonElement>(
                    ".news-more__arrow--prev"
                ),
                nextEl: element.querySelector<HTMLButtonElement>(
                    ".news-more__arrow--next"
                ),
            },
            slidesOffsetBefore: isSmallScreen ? 16 : 0,
            slidesOffsetAfter: isSmallScreen ? 16 : 0,

        });
    };
        initSwiper(mql.matches);

        mql.addEventListener("change", (e) => {
            initSwiper(e.matches);
        });

    });

    const topUpButtons = document.querySelectorAll<HTMLElement>(".news-detail__bottom-up-link");

    topUpButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: 0 },
                ease: "power2.inOut",
            });
        });
    });
}
