initMap();

async function initMap() {
  const offices = document.querySelector(".offices");
  if (!offices) return;
  const mapElement = offices.querySelector(".offices__map-inner");
  if (!mapElement) return;

  const mapRoot = offices.querySelector(".offices__map");
  const officesList = offices.querySelector(".offices__list");
  const closeMobileMap = offices.querySelector(".offices__map-close");
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

  console.log("Theme url", themeUrl);
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
    position: "bottom left",
    orientation: "vertical",
  });
  controls.addChild(
    new YMapZoomControl({
      easing: "linear",
    })
  );
  map.addChild(controls);

  let addedMarkers = [];

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

  const closePopups = () => {
    const popups = Array.from(document.querySelectorAll(".offices__map-popup"));
    popups.forEach((popup) => popup.remove());
  };

  data.forEach((item) => {
    const li = document.createElement("li");
    li.className = "offices__list-item";
    const listViewCard = document.createElement("a");
    listViewCard.className = "offices__card";
    listViewCard.href = "#";
    listViewCard.innerHTML = `
      <div class="offices__card-image-container">
          <img src="${item.image}" alt="" class="offices__card-image">
      </div>
      <div class="offices__card-content">
          <h3 class="offices__card-title">
              ${item.title}
          </h3>
          <div class="offices__card-location">
              <svg width="14" height="14" aria-hidden="true">
                  <use xlink:href="#location"></use>
              </svg>
              ${item.location}
          </div>
      </div>
    `;

    const objectMarkerElement = document.createElement("div");
    objectMarkerElement.className = "offices__object-marker";
    objectMarkerElement.innerHTML = `
        <div class="offices__object-marker-image-container">
            <img src="${item.object.mapIcon}" class="offices__object-marker-image" />
        </div>
      `;

    const { lat: objectLat, lng: objectLng } = item.object.coords;

    const objectMarker = new YMapMarker(
      {
        coordinates: [objectLng, objectLat],
        draggable: false,
        mapFollowsOnDrag: false,
        onClick: () => {
          closePopups();
          insertPopup(item, false);
        },
      },
      objectMarkerElement
    );

    const { lat: officeLat, lng: officeLng } = item.office.coords;

    const officeMarkerElement = document.createElement("div");
    officeMarkerElement.className = "offices__office-marker";
    officeMarkerElement.innerHTML = `
        <div class="offices__office-marker-inner">
            <div class="offices__office-marker-inner-content">
              <img class="offices__office-marker-hash" src="/images/hash.svg" />
              <div class="offices__office-marker-text">
                Офис
              </div>
            </div>
        </div>
      `;

    const officeMarker = new YMapMarker(
      {
        coordinates: [officeLng, officeLat],
        draggable: false,
        mapFollowsOnDrag: false,
        onClick: () => {
          closePopups();
          insertPopup(item);
        },
      },
      officeMarkerElement
    );

    li.appendChild(listViewCard);
    officesList.append(li);

    function insertPopup(item, isOffice = true) {
      const card = document.createElement("div");

      const contacts = isOffice ? item.office.contacts : item.object.contacts;
      card.className = "offices__map-popup";
      card.innerHTML = `
        <div class="offices__map-popup-inner"> 
          <div class="offices__map-popup-btns"> 
            <button class="offices__map-popup-btn offices__map-popup-btn--object ${
              !isOffice ? "active" : ""
            }" type="button"> 
              Объект
            </button>
            <button class="offices__map-popup-btn offices__map-popup-btn--office ${
              isOffice ? "active" : ""
            }" type="button"> 
              Офис продаж
            </button>
          </div>
          <div class="offices__map-popup-content">
            <h3 class="offices__map-popup-title">
              ${item.title}
            </h3>
            <ul class="offices__map-contacts-list">
              ${contacts
                .map(
                  (contact) => `<li class="offices__map-contacts-list-item">
                  <div class="offices__map-contacts-card">
                    <div class="offices__map-contacts-card-icon">
                      <img class="offices__map-contacts-card-icon-image" src="${contact.icon}" />
                    </div>
                    <div class="offices__map-contacts-card-text">
                      ${contact.text}
                    </div>
                  </div>
                </li>`
                )
                .join("")}
            </ul>
            <a class="offices__map-contacts-link js-open-callback-modal" href="#">
              Заказать обратный звонок
            </a>
          </div>
        </div>
      
      `;
      const objectBtn = card.querySelector(".offices__map-popup-btn--object");
      const officeBtn = card.querySelector(".offices__map-popup-btn--office");
      if (isOffice) {
        officeMarkerElement.classList.add("scaled");
        objectMarkerElement.classList.remove("scaled");
        // map.setLocation({
        //   center: [officeLng, officeLat],
        //   margin: [200, 400, 200, 200],
        //   zoom: 12,
        // });

        const options = {
          location: {
            center: [officeLng, officeLat],
            duration: 1000,
            zoom: 16,
          },
        };
        if (!window.matchMedia("(max-width: 640px)").matches) {
          options.margin = [200, 400, 200, 200];
        }
        map.update(options);
      } else {
        officeMarkerElement.classList.remove("scaled");
        objectMarkerElement.classList.add("scaled");

        const options = {
          location: {
            center: [objectLng, objectLat],
            duration: 1000,
            zoom: 16,
          },
        };

        if (!window.matchMedia("(max-width: 640px)").matches) {
          options.margin = [200, 400, 200, 200];
        }
        map.update(options);
      }
      mapRoot.appendChild(card);

      objectBtn.addEventListener("click", (event) => {
        event.preventDefault();
        closePopups();
        insertPopup(item, false);
      });

      officeBtn.addEventListener("click", (event) => {
        event.preventDefault();
        closePopups();
        insertPopup(item, true);
      });
    }

    listViewCard.addEventListener("click", (event) => {
      event.preventDefault();
      const cards = Array.from(document.querySelectorAll(".offices__card"));
      cards.forEach((card) => card.classList.remove("active"));
      listViewCard.classList.add("active");
      addedMarkers.forEach((marker) => map.removeChild(marker));
      addedMarkers.push(objectMarker);
      addedMarkers.push(officeMarker);
      map.addChild(objectMarker);
      map.addChild(officeMarker);

      console.log("Office coords", officeLng, officeLat);
      console.log("Object bounds", objectLng, objectLat);

      // const boundOne = [
      //   Math.min(officeLng, objectLng),
      //   Math.min(officeLat, objectLat),
      // ];
      // const boundTwo = [
      //   Math.max(officeLng, objectLng),
      //   Math.max(officeLat, objectLat),
      // ];

      // const NEW_LOCATION_BOUNDS = {
      //   bounds: [boundOne, boundTwo],
      //   zoom: 16,
      // };

      // map.update({
      //   location: {
      //     ...NEW_LOCATION_BOUNDS,
      //     duration: 0,
      //   },
      //   margin: [200, 400, 200, 200],
      // });

      closePopups();
      insertPopup(item, true);
    });
  });

  const cards = Array.from(offices.querySelectorAll(".offices__card"));
  cards[0]?.click();

  cards.forEach((card) =>
    card.addEventListener("click", () => {
      document.body.classList.add("offices-mobile-map-shown");
    })
  );

  closeMobileMap.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.remove("offices-mobile-map-shown");
  });
}
