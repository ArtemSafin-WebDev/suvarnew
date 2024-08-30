initMap();
async function initMap() {
  const ourProjects = document.querySelector(".cm-projects");
  if (!ourProjects) return;
  const mapElement = ourProjects.querySelector(".cm-projects__map-inner");
  if (!mapElement) return;
  const mapRoot = ourProjects.querySelector(".cm-projects__map");

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
    position: "right",
    orientation: "vertical",
  });
  controls.addChild(
      new YMapZoomControl({
        easing: "linear",
        className: "test-id",
      }),

  );
  map.addChild(controls);

  let markers = [];
  let activeMarker = null;

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
      data.forEach((item, index) => {
        const { lat, lng } = item.coords;

        const markerElement = document.createElement("div");
        markerElement.className = "cm-projects__map-marker";
        markerElement.innerHTML = `
          <div class="cm-projects__map-marker-image-container">
            <img src="${item.image.src}" class="cm-projects__map-marker-image" />
          </div>
          <div class="cm-projects__map-marker-price-label" style="display: none;">
            <div class="cm-projects__map-marker-title">${item.title}</div>
            <div class="cm-projects__map-marker-price">${item.price}</div>
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

        markerElement.addEventListener("click", (event) => {
          event.stopPropagation(); // Останавливаем всплытие события

          if (activeMarker && activeMarker !== markerElement) {
            const prevLabel = activeMarker.querySelector(
                ".cm-projects__map-marker-price-label"
            );
            if (prevLabel) {
              prevLabel.style.display = "none";
            }
          }

          const currentLabel = markerElement.querySelector(
              ".cm-projects__map-marker-price-label"
          );
          if (currentLabel) {
            const isVisible = currentLabel.style.display === "block";
            currentLabel.style.display = isVisible ? "none" : "block";
            activeMarker = markerElement;
          }
        });

        markers.push({ marker, data: item });
        map.addChild(marker);
      });
    }
  };

  placeMarkers();

  document.addEventListener("click", (event) => {
    if (activeMarker) {
      if (!activeMarker.contains(event.target)) {
        const currentLabel = activeMarker.querySelector(
            ".cm-projects__map-marker-price-label"
        );
        if (currentLabel) {
          currentLabel.style.display = "none";
          activeMarker = null;
        }
      }
    }
  });
}
