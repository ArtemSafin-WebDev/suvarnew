initMap();
async function initMap() {
  const ourProjects = document.querySelector(".cm-projects");
  if (!ourProjects) return;
  const listElement = ourProjects.querySelector(".cm-projects__list");
  if (!listElement) {
    return;
  }
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
      })
  );
  map.addChild(controls);

  let markers = [];
  let activeMarker = null;

  const showMarkerLabel = (markerElement) => {
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
      currentLabel.style.display = "block";
      activeMarker = markerElement;
    }
  };

  const createProjectListItem = (item, markerElement) => {
    const listItem = document.createElement("li");
    listItem.className = "cm-projects__list-item";
    listItem.setAttribute("data-title", item.title);

    let tagsHTML = "";
    item.tags.forEach((tag) => {
      tagsHTML += `
        <li class="cm-projects__card-tags-list-item">
          <div class="cm-projects__card-tag ${
          tag.dark ? "cm-projects__card-tag--dark" : ""
      }">
            ${
          tag.icon
              ? `<svg width="15" height="16" aria-hidden="true" class="cm-projects__card-tag-icon">
                            <use xlink:href="#${tag.icon}"></use>
                          </svg>`
              : ""
      }
            ${tag.text}
          </div>
        </li>
      `;
    });

    let actionsHTML = "";
    item.actions.forEach((action) => {
      actionsHTML += `
        <li class="cm-projects__card-options-item card-options-item">
          <svg width="15" height="16" aria-hidden="true" class="card-options-item__image">
            <use xlink:href="#${action.icon}"></use>
          </svg>
          <span class="card-options-item__text">
            ${action.type}
          </span>
          <a href="${action.link}" class="card-options-item__link">${action.count.number} ${action.count.text}</a>
        </li>
      `;
    });

    listItem.innerHTML = `
      <div class="cm-projects__card">
        <div class="cm-projects__card-image-container">
          <div class="cm-projects__card-image">
              <img src="${item.image.src}" alt="" class="cm-projects__card-image-src">
          </div>
          <div class="cm-projects__card-tags">
            <ul class="cm-projects__card-tags-list">
              ${tagsHTML}
            </ul>
          </div>
        </div>
        <div class="cm-projects__card-content">
          <div class="cm-projects__card-row">
            <h3 class="cm-projects__card-title">
              ${item.title}
            </h3>
          </div>
          <div class="cm-projects__card-location">
            <svg width="14" height="14" aria-hidden="true">
              <use xlink:href="#location"></use>
            </svg>
            ${item.location}
          </div>
          <div class="cm-projects__card-description">
            ${item.description}
          </div>
          <div class="cm-projects__card-options">
            <ul class="cm-projects__card-options-items">
              ${actionsHTML}
            </ul>
          </div>
        </div>
      </div>
    `;

    listItem.addEventListener("click", (event) => {
      event.stopPropagation();

      map.update({
        location: {
          center: [item.coords.lng, item.coords.lat],
          zoom: 16,
          duration: 1000,
        },
      });

      showMarkerLabel(markerElement);
    });

    return listItem;
  };

  const createProjectList = async () => {
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

    data.forEach((item) => {
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
            coordinates: [item.coords.lng, item.coords.lat],
            draggable: false,
            mapFollowsOnDrag: false,
          },
          markerElement
      );

      markerElement.addEventListener("click", (event) => {
        event.stopPropagation();
        showMarkerLabel(markerElement);
      });

      markers.push({ marker, data: item });
      map.addChild(marker);

      const listItem = createProjectListItem(item, markerElement);
      listElement.appendChild(listItem);
    });
  };

  await createProjectList();

  document.addEventListener("click", (event) => {
    if (
        activeMarker &&
        !activeMarker.contains(event.target) &&
        !event.target.closest(".cm-projects__list-item")
    ) {
      const currentLabel = activeMarker.querySelector(
          ".cm-projects__map-marker-price-label"
      );
      if (currentLabel) {
        currentLabel.style.display = "none";
        activeMarker = null;
      }
    }
  });
}
