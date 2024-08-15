initMap();

async function initMap() {
  const infra = document.querySelector(".infra");
  if (!infra) return;
  const mapElement = infra.querySelector(".infra__map-inner");
  if (!mapElement) return;
  await ymaps3.ready;

  const mobileShowBtn = infra.querySelector(".infra__map-filters-mobile-btn");
  const closeBtn = infra.querySelector(".infra__map-filters-modal-close");

  // const showBtn = infra.querySelector(".infra__map-filters-show-btn");
  const form = infra.querySelector("form");
  const showMobileFilters = () => {
    document.body.classList.add("infra-filters-shown");
  };
  const hideMobileFilters = () => {
    document.body.classList.remove("infra-filters-shown");
  };

  mobileShowBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    showMobileFilters();
  });
  closeBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    hideMobileFilters();
  });

  // showBtn?.addEventListener("click", (event) => {
  //   event.preventDefault();
  //   hideMobileFilters();
  // });

  console.log("Infra map ready");
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
  const checkboxes = Array.from(
    document.querySelectorAll(".infra__map-filters-radio-input")
  );
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

  console.log("Data", data);

  const { lat: objectLat, lng: objectLng } = data.object.coords;
  const objectImageSrc = data.object.image;
  const markerElement = document.createElement("div");
  markerElement.className = "infra__map-marker";
  markerElement.innerHTML = `
    <div class="infra__map-marker-image-container">
        <img src="${objectImageSrc}" class="infra__map-marker-image" alt="" />
    </div>
    `;
  const marker = new YMapMarker(
    {
      coordinates: [objectLng, objectLat],
      draggable: false,
      mapFollowsOnDrag: false,
    },
    markerElement
  );

  map.addChild(marker);

  const options = {
    location: {
      center: [objectLng, objectLat],
      duration: 1000,
      zoom: zoom,
    },
  };
  if (!window.matchMedia("(max-width: 640px)").matches) {
    options.margin = [0, 0, 0, 400];
  }
  map.update(options);

  const points = data.poi;
  let poiMarkers = [];

  const clearMarkers = () => {
    if (poiMarkers.length) {
      poiMarkers.forEach((marker) => map.removeChild(marker));
      poiMarkers = [];
    }
  };
  const placeMarkers = (category = "") => {
    let filteredPoints = [];
    if (category === "all" || !category.trim()) {
      filteredPoints = [...points];
    } else {
      filteredPoints = points.filter(
        (point) =>
          point.category.trim().toLowerCase() === category.trim().toLowerCase()
      );
    }
    filteredPoints.forEach((point) => {
      const { lat, lng } = point.coords;
      const { title, desc, category } = point;
      const markerElement = document.createElement("div");
      markerElement.className = "infra__poe-marker";
      markerElement.innerHTML = `
        <div class="infra__poe-marker-inner">
            <svg width="14" height="14" aria-hidden="true">
                <use xlink:href="#${category}"></use>
            </svg>
        </div>
        <div class="infra__poe-marker-label">
            <div class="infra__poe-marker-title">
                ${title}
            </div>
            ${desc ? `<div class="infra__poe-marker-desc">${desc}</div>` : ""}
        </div>
        `;
      const marker = new YMapMarker(
        {
          coordinates: [lng, lat],
          draggable: false,
          mapFollowsOnDrag: false,
        },
        markerElement
      );
      map.addChild(marker);
      poiMarkers.push(marker);
    });
  };

  placeMarkers();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    hideMobileFilters();
  });
  form.addEventListener("reset", (event) => {
    hideMobileFilters();
    placeMarkers();
  });

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const checkedValue = checkboxes.find((item) => item.checked)?.value;
      console.log("checked value");
      clearMarkers();
      placeMarkers(checkedValue);
    });
  });
}
