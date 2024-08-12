initMap();

async function initMap() {
  const ourProjects = document.querySelector(".our-projects");
  if (!ourProjects) return;
  const mapElement = ourProjects.querySelector(".our-projects__map-inner");
  if (!mapElement) return;
  const mapRoot = ourProjects.querySelector(".our-projects__map");
  await ymaps3.ready;
  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapControls,
    YMapMarker,
    YMapDefaultFeaturesLayer,
  } = ymaps3;

  const { YMapZoomControl } = await ymaps3.import(
    "@yandex/ymaps3-controls@0.0.1"
  );
  const lat = Number(mapElement.parentElement.getAttribute("data-lat"));
  const lng = Number(mapElement.parentElement.getAttribute("data-lng"));
  const dataUrl = mapElement.parentElement.getAttribute("data-points-url");
  const themeUrl = mapElement.parentElement.getAttribute("data-theme-url");
  const zoom = mapElement.parentElement.hasAttribute("data-zoom")
    ? Number(mapElement.parentElement.getAttribute("data-zoom"))
    : 14;

  let theme = null;
  try {
    theme = await fetch(themeUrl).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    });
  } catch (err) {
    console.error(err);
  }

  const map = new YMap(mapElement, {
    location: {
      center: [lng, lat],
      zoom: zoom,
    },
    behaviors: ["drag", "pinchZoom"],
  });

  if (theme) {
    map.addChild(
      new YMapDefaultSchemeLayer({
        customization: theme,
      })
    );
  } else {
    map.addChild(new YMapDefaultSchemeLayer());
  }
  map.addChild(new YMapDefaultFeaturesLayer({ zIndex: 1800 }));

  const controls = new YMapControls({
    position: "bottom right",
    orientation: "vertical",
  });
  controls.addChild(
    new YMapZoomControl({
      easing: "linear",
    })
  );
  map.addChild(controls);

  let markers = [];

  // Поместить метки
  const placeMarkers = async () => {
    let data = [];
    try {
      data = await fetch(dataUrl).then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      });
    } catch (err) {
      console.error(err);
    }
    if (data.length) {
      data.forEach((item) => {
        const { lat, lng } = item.coords;

        console.log("Coords", lat, lng);
        const markerElement = document.createElement("div");
        markerElement.className = "our-projects__map-marker";
        markerElement.innerHTML = `
            <div class="our-projects__map-marker-image-container">
                <img src="${item.image.src}" class="our-projects__map-marker-image" />
            </div>
            <div class="our-projects__map-marker-price-label">
                <div class="our-projects__map-marker-title">${item.title}</div>
                <div class="our-projects__map-marker-price">${item.price}</div>
            </div>
          `;

        console.log("Marker element", markerElement);

        const marker = new YMapMarker(
          {
            coordinates: [lng, lat],
            draggable: false,
            mapFollowsOnDrag: false,
            onClick: () => {
              console.log("Clicked on marker");
              Array.from(
                document.querySelectorAll(".our-projects__map-card")
              ).forEach((card) => card.remove());
              const card = document.createElement("div");
              card.className = "our-projects__map-card";
              card.innerHTML = `
              <div class="our-projects__map-card-mobile-wrapper">
              <button class="our-projects__map-card-close">
                <svg width="14" height="14" aria-hidden="true">
                    <use xlink:href="#modal-close"></use>
                </svg>
              </button>
              <div class="our-projects__map-card-inner">
                <div class="our-projects__map-card-image-container">
                    <img src="${item.balloon.image.src}" alt=""
                        class="our-projects__map-card-image">
                        ${
                          item.balloon.tags
                            ? `
                            <ul class="our-projects__map-card-tags-list">
                            ${item.balloon.tags
                              .map(
                                (tag) => `
                                <li class="our-projects__map-card-tags-list-item">
                                    <div class="our-projects__map-card-tag ${
                                      tag.dark
                                        ? `our-projects__map-card-tag--dark`
                                        : ""
                                    }">
                                    ${
                                      tag.icon
                                        ? `<img src="${tag.icon}" alt=""
                                            class="our-projects__map-card-tag-icon">`
                                        : ""
                                    }
                                        ${tag.text}
                                    </div>
                                </li>`
                              )
                              .join("")}
                            </ul>
                          `
                            : ""
                        }
                </div>
                <div class="our-projects__map-card-content">
                    <h3 class="our-projects__map-card-title">
                        ${item.balloon.title}
                    </h3>
                    <div class="our-projects__map-card-location">
                        <svg width="14" height="14" aria-hidden="true">
                            <use xlink:href="#location"></use>
                        </svg>
                        ${item.balloon.location}
                    </div>
                    ${
                      item.balloon.specs
                        ? `
                       <ul class="our-projects__map-card-specs-list">
                        ${item.balloon.specs
                          .map(
                            (spec) => `
                          <li class="our-projects__map-card-specs-list-item">
                            <div class="our-projects__map-card-specs-card">
                                <div class="our-projects__map-card-specs-card-key">
                                   ${spec.key}
                                </div>
                                <div class="our-projects__map-card-specs-card-value">
                                    ${spec.value}
                                </div>
                            </div>
                          </li>
                        `
                          )
                          .join("")}
                          
                      </ul>
                    `
                        : ""
                    }
                   
                    <a href="${
                      item.balloon.detailUrl
                    }" class="our-projects__map-card-link">
                        О проекте
                    </a>
                </div>
            </div>
            </div>
              
              `;

              mapRoot.appendChild(card);
              document.body.classList.add("map-card-shown");
            },
          },
          markerElement
        );
        markers.push(marker);
        map.addChild(marker);
      });
    }
  };

  document.addEventListener("click", (event) => {
    if (
      event.target.matches(".our-projects__map-card-close") ||
      event.target.closest(".our-projects__map-card-close")
    ) {
      event.preventDefault();
      Array.from(document.querySelectorAll(".our-projects__map-card")).forEach(
        (card) => card.remove()
      );
      document.body.classList.remove("map-card-shown");
    }
  });

  // Очистить все метки
  const clearMarkers = () => {
    Array.from(document.querySelectorAll(".our-projects__map-card")).forEach(
      (card) => card.remove()
    );
    markers.forEach((marker) => map.removeChild(marker));
    document.body.classList.remove("map-card-shown");
  };

  placeMarkers();
}
