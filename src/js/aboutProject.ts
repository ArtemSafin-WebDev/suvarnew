import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function aboutProject() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".about-project")
  );

  elements.forEach((element) => {
    const toggle = element.querySelector(".about-project__text-toggle");

    toggle?.addEventListener("click", (event) => {
      event.preventDefault();
      toggle.parentElement?.classList.toggle("content-shown");
    });

    const modal = element.querySelector<HTMLElement>(".about-project__modal");

    const video = element.querySelector<HTMLVideoElement>("video");
    const videoLink = element.querySelector<HTMLLinkElement>(
      ".about-project__video-wrapper"
    );
    const closeModal = element.querySelector<HTMLElement>(
      ".about-project__modal-close"
    );

    let instance: Plyr | null = null;
    if (video) {
      instance = new Plyr(video);
    }

    videoLink?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.add("modal-open");
      modal?.classList.add("active");
      instance?.play();
    });
    closeModal?.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.remove("modal-open");
      modal?.classList.remove("active");
      instance?.stop();
      const iframe = modal?.querySelector("iframe");

      if (iframe) {
        let iframeSrc = iframe.src;
        iframe.src = iframeSrc;
      }
    });
    modal?.addEventListener("click", (event) => {
      if (event.target === modal) {
        document.body.classList.remove("modal-open");
        modal?.classList.remove("active");
        instance?.stop();
        const iframe = modal?.querySelector("iframe");
        if (iframe) {
          let iframeSrc = iframe.src;
          iframe.src = iframeSrc;
        }
      }
    });
  });
}
