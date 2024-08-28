import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function aboutIntro() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".about-intro")
  );

  elements.forEach((element) => {
    const modal = element.querySelector<HTMLElement>(".about-intro__modal");
    const video = element.querySelector<HTMLVideoElement>("video");
    const videoLink = element.querySelector<HTMLLinkElement>(
      ".about-intro__video-link"
    );
    const closeModal = element.querySelector<HTMLElement>(
      ".about-intro__modal-close"
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
