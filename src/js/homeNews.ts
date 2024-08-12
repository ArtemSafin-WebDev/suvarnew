import Swiper from "swiper";
import "swiper/css";
import "swiper/css/effect-creative";
import { EffectCreative, Navigation } from "swiper/modules";
import Validator from "./classes/Validator";

export default function homeNews() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".home-news")
  );
  const mql = window.matchMedia("(max-width: 640px)");

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;

    let instance: Swiper | null = null;

    const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        if (instance) instance.destroy();
        instance = new Swiper(container, {
          slidesPerView: "auto",
          speed: 600,
        });
      } else {
        if (instance) instance.destroy();
        instance = new Swiper(container, {
          modules: [Navigation, EffectCreative],
          speed: 600,
          slidesPerView: "auto",
          effect: "creative",
          loop: true,
          navigation: {
            prevEl: element.querySelector<HTMLButtonElement>(
              ".home-news__arrow--prev"
            ),
            nextEl: element.querySelector<HTMLButtonElement>(
              ".home-news__arrow--next"
            ),
          },
          creativeEffect: {
            prev: {
              translate: [0, 0, -150],
              opacity: 0,
            },
            next: {
              translate: ["100%", 0, 0],
              opacity: 1,
            },
            limitProgress: 15,
          },
        });
      }
    };

    mql.addEventListener("change", handleWidthChange);

    handleWidthChange(mql);

    const showSubscribe = element.querySelector<HTMLLinkElement>(
      ".home-news__subscribe-link"
    );
    const subscribeModal =
      document.querySelector<HTMLElement>("#subscribe-modal");
    const subscribeClose = subscribeModal?.querySelector<HTMLButtonElement>(
      ".subscribe-modal__close"
    );
    showSubscribe?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.add("modal-open");
      subscribeModal?.classList.add("active");
    });
    subscribeClose?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.remove("modal-open");
      subscribeModal?.classList.remove("active");
    });

    const form = subscribeModal?.querySelector<HTMLFormElement>("form");
    if (form) {
      const formValidator = new Validator(form);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        event.stopPropagation();
        formValidator.validate();
        if (formValidator.valid) {
          const validSubmissionEvent = new CustomEvent("validsubmit");
          form.dispatchEvent(validSubmissionEvent);
        }
      });
    }
  });
}
