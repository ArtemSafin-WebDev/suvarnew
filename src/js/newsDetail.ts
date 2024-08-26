import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function newsDetail() {
    const elements = Array.from(
        document.querySelectorAll<HTMLElement>(".news-detail")
    );

    const shareButtons = document.querySelectorAll<HTMLElement>(".news-detail__share");

    const closeAllShareContents = () => {
        const openContents = document.querySelectorAll<HTMLElement>(".share-content.active");
        openContents.forEach((content) => {
            content.classList.remove("active");
        });
    };

    shareButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            closeAllShareContents();
            const shareContent = button.closest<HTMLElement>(".news-detail")?.querySelector<HTMLElement>(".share-content");
            if (shareContent) {
                shareContent.classList.toggle("active");
            }
        });
    });

    document.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const isInsideShareContent = target.closest(".share-content");
        const isInsideShareButton = target.closest(".news-detail__share");

        if (!isInsideShareContent && !isInsideShareButton) {
            closeAllShareContents();
        }
    });


    elements.forEach((element) => {
        let autoplayDisabled = window.matchMedia("(max-width: 640px)").matches;
        const AUTOPLAY_DURATION = 15;
        const container = element.querySelector<HTMLElement>(".swiper");
        if (!container) return;

        const paginationElement = element.querySelector<HTMLElement>(
            ".news-detail__slider-pagination"
        );
        const fractionTextElement = element.querySelector(
            ".news-detail__slider-fraction-pagination-inner"
        );
        const slides = Array.from(element.querySelectorAll(".swiper-slide"));

        const setFraction = (swiper: Swiper) => {
            if (!fractionTextElement) return;
            fractionTextElement.textContent = `${swiper.realIndex + 1} / ${
                swiper.slides.length
            }`;
        };

        function autoplay(swiper: Swiper) {
            gsap.killTweensOf(container);
            if (autoplayDisabled) return;
            gsap.fromTo(
                container,
                { "--p": 0 },
                {
                    "--p": 100,
                    ease: "none",
                    duration: AUTOPLAY_DURATION,
                    onComplete: () => {
                        swiper.slideNext();
                    },
                }
            );
        }

        const instance = new Swiper(container, {
            slidesPerView: 1,
            speed: 600,
            loop: true,
            effect: "fade",
            modules: [Navigation],
            pagination: {
                el: paginationElement,
                clickable: true,
            },
            navigation: {
                prevEl: element.querySelector<HTMLButtonElement>(
                    ".news-detail__slider__arrow--prev"
                ),
                nextEl: element.querySelector<HTMLButtonElement>(
                    ".news-detail__slider__arrow--next"
                ),
            },
            on: {
                init: (swiper) => {
                    setFraction(swiper);
                    autoplay(swiper);
                },
                slideChange: (swiper) => {
                    setFraction(swiper);
                    autoplay(swiper);
                },
            },
        });

        instance.init();
    });
}
