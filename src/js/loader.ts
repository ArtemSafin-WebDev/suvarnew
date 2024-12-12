import gsap from "gsap";

export default function loader() {
  const loader = document.querySelector<HTMLElement>(".loader");

  if (!loader) return;
  const loaderLogo = loader?.querySelector<HTMLElement>(".loader__logo")!;
  const progressBar = loader.querySelector<HTMLElement>(
    ".loader__progress-bar span"
  )!;
  const percentage = loader.querySelector<HTMLElement>(
    ".loader__progress-percentage span"
  );
  const tl = gsap.timeline({});

  tl.addLabel("start")
    .to(loaderLogo, {
      duration: 1,
      ease: "power3.out",
      clipPath: "inset(0 0% 0 0)",
      translateX: 0,
      delay: 0.5,
    })
    .addLabel("afterLogo");

  tl.to(
    progressBar,
    {
      scaleX: 1,
      duration: 2,
      ease: "none",
    },
    "start"
  );

  tl.to(
    percentage,
    {
      innerText: 100,
      duration: 2,
      ease: "none",
      snap: {
        innerText: 1,
      },
    },
    "start"
  );

  tl.to(loader, {
    duration: 0.8,
    yPercent: -100,
    ease: "power2.in",
  }).add(() => {
    loader?.remove();
  });
}
