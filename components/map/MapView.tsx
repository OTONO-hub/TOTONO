"use client";

import {
  useEffect,
  useRef,
} from "react";
import maplibregl, {
  type Map as MapLibreMap,
  type Marker,
} from "maplibre-gl";
import type {
  Feature,
  Polygon,
} from "geojson";

import type {
  Sauna,
  SaunaLocationSearch,
} from "@/services/saunas";

type MapViewProps = {
  saunas: Sauna[];
  currentLocation?:
    | SaunaLocationSearch
    | null;
};

type SaunaMapSelectEventDetail = {
  saunaId: string;
};

type SaunaCardSelectEventDetail = {
  saunaId: string;
};

const DEFAULT_CENTER: [
  number,
  number,
] = [
  139.7671,
  35.6812,
];

const DEFAULT_ZOOM = 10;
const SINGLE_POINT_ZOOM = 13;
const SELECTED_SAUNA_ZOOM = 14;
const MAX_FIT_BOUNDS_ZOOM = 14;
const EARTH_RADIUS_KM = 6371;

const SAUNA_MAP_SELECT_EVENT =
  "totono:select-sauna-on-map";

const SAUNA_CARD_SELECT_EVENT =
  "totono:select-sauna-card";

const SEARCH_RADIUS_SOURCE_ID =
  "search-radius-source";

const SEARCH_RADIUS_FILL_LAYER_ID =
  "search-radius-fill";

const SEARCH_RADIUS_LINE_LAYER_ID =
  "search-radius-line";

const SELECTED_CARD_CLASSES = [
  "ring-2",
  "ring-[#fdd000]",
  "ring-offset-4",
  "ring-offset-[#e6e5ef]",
  "shadow-[0_24px_60px_rgba(253,208,0,0.18)]",
] as const;

let highlightTimeoutId:
  | number
  | null = null;

function hasValidCoordinates(
  sauna: Sauna
): sauna is Sauna & {
  latitude: number;
  longitude: number;
} {
  return (
    typeof sauna.latitude ===
      "number" &&
    Number.isFinite(
      sauna.latitude
    ) &&
    sauna.latitude >= -90 &&
    sauna.latitude <= 90 &&
    typeof sauna.longitude ===
      "number" &&
    Number.isFinite(
      sauna.longitude
    ) &&
    sauna.longitude >= -180 &&
    sauna.longitude <= 180
  );
}

function hasValidCurrentLocation(
  location?:
    | SaunaLocationSearch
    | null
): location is SaunaLocationSearch {
  if (!location) {
    return false;
  }

  return (
    Number.isFinite(
      location.latitude
    ) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    Number.isFinite(
      location.longitude
    ) &&
    location.longitude >= -180 &&
    location.longitude <= 180
  );
}

function hasValidSearchRadius(
  location?:
    | SaunaLocationSearch
    | null
): location is SaunaLocationSearch {
  return (
    hasValidCurrentLocation(
      location
    ) &&
    Number.isFinite(
      location.radiusKm
    ) &&
    location.radiusKm > 0
  );
}

function degreesToRadians(
  degrees: number
): number {
  return (
    (degrees * Math.PI) /
    180
  );
}

function radiansToDegrees(
  radians: number
): number {
  return (
    (radians * 180) /
    Math.PI
  );
}

function normalizeLongitude(
  longitude: number
): number {
  return (
    ((longitude + 540) %
      360) -
    180
  );
}

function calculateDistanceKm(
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number
): number {
  const latitudeDifference =
    degreesToRadians(
      endLatitude -
        startLatitude
    );

  const longitudeDifference =
    degreesToRadians(
      endLongitude -
        startLongitude
    );

  const startLatitudeRadians =
    degreesToRadians(
      startLatitude
    );

  const endLatitudeRadians =
    degreesToRadians(
      endLatitude
    );

  const haversine =
    Math.sin(
      latitudeDifference / 2
    ) ** 2 +
    Math.cos(
      startLatitudeRadians
    ) *
      Math.cos(
        endLatitudeRadians
      ) *
      Math.sin(
        longitudeDifference / 2
      ) **
        2;

  const angularDistance =
    2 *
    Math.atan2(
      Math.sqrt(haversine),
      Math.sqrt(
        1 - haversine
      )
    );

  return (
    EARTH_RADIUS_KM *
    angularDistance
  );
}

function formatDistance(
  distanceKm: number
): string {
  if (distanceKm < 1) {
    return `${Math.round(
      distanceKm * 1000
    )}m`;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(
      1
    )}km`;
  }

  return `${Math.round(
    distanceKm
  )}km`;
}

function createSearchRadiusGeoJson(
  location: SaunaLocationSearch,
  steps = 96
): Feature<Polygon> {
  const centerLatitudeRadians =
    degreesToRadians(
      location.latitude
    );

  const centerLongitudeRadians =
    degreesToRadians(
      location.longitude
    );

  const angularDistance =
    location.radiusKm /
    EARTH_RADIUS_KM;

  const coordinates: [
    number,
    number,
  ][] = [];

  for (
    let index = 0;
    index <= steps;
    index += 1
  ) {
    const bearing =
      (index / steps) *
      Math.PI *
      2;

    const latitudeRadians =
      Math.asin(
        Math.sin(
          centerLatitudeRadians
        ) *
          Math.cos(
            angularDistance
          ) +
          Math.cos(
            centerLatitudeRadians
          ) *
            Math.sin(
              angularDistance
            ) *
            Math.cos(bearing)
      );

    const longitudeRadians =
      centerLongitudeRadians +
      Math.atan2(
        Math.sin(bearing) *
          Math.sin(
            angularDistance
          ) *
          Math.cos(
            centerLatitudeRadians
          ),
        Math.cos(
          angularDistance
        ) -
          Math.sin(
            centerLatitudeRadians
          ) *
            Math.sin(
              latitudeRadians
            )
      );

    coordinates.push([
      normalizeLongitude(
        radiansToDegrees(
          longitudeRadians
        )
      ),
      radiansToDegrees(
        latitudeRadians
      ),
    ]);
  }

  return {
    type: "Feature",
    properties: {
      radiusKm:
        location.radiusKm,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        coordinates,
      ],
    },
  };
}

function extendBoundsWithPolygon(
  bounds:
    maplibregl.LngLatBounds,
  polygon: Feature<Polygon>
): void {
  for (const coordinate of polygon
    .geometry.coordinates[0]) {
    const [
      longitude,
      latitude,
    ] = coordinate;

    if (
      !Number.isFinite(
        longitude
      ) ||
      !Number.isFinite(
        latitude
      )
    ) {
      continue;
    }

    bounds.extend([
      longitude,
      latitude,
    ]);
  }
}

function createSaunaMarkerElement(
  sauna: Sauna,
  ranking: number
): HTMLButtonElement {
  const marker =
    document.createElement(
      "button"
    );

  marker.type = "button";

  marker.setAttribute(
    "aria-label",
    `${ranking}番目の施設、${sauna.name}を選択`
  );

  marker.dataset.saunaMarker =
    "true";

  marker.dataset.selected =
    "false";

  marker.style.position =
    "relative";

  marker.style.display =
    "flex";

  marker.style.alignItems =
    "center";

  marker.style.justifyContent =
    "center";

  marker.style.width =
    "38px";

  marker.style.height =
    "38px";

  marker.style.padding = "0";

  marker.style.border =
    "3px solid white";

  marker.style.borderRadius =
    "9999px";

  marker.style.background =
    "#3e3a3a";

  marker.style.color =
    "white";

  marker.style.fontSize =
    "13px";

  marker.style.fontWeight =
    "800";

  marker.style.fontFamily =
    "inherit";

  marker.style.lineHeight =
    "1";

  marker.style.cursor =
    "pointer";

  marker.style.boxShadow =
    "0 8px 20px rgba(62, 58, 58, 0.28)";

  marker.style.transform =
    "translateY(-2px)";

  marker.style.transition =
    [
      "background-color 200ms ease",
      "color 200ms ease",
      "box-shadow 200ms ease",
      "transform 200ms ease",
    ].join(", ");

  marker.textContent =
    String(ranking);

  const pointer =
    document.createElement(
      "span"
    );

  pointer.setAttribute(
    "aria-hidden",
    "true"
  );

  pointer.style.position =
    "absolute";

  pointer.style.left = "50%";
  pointer.style.bottom =
    "-7px";

  pointer.style.width =
    "12px";

  pointer.style.height =
    "12px";

  pointer.style.borderRight =
    "3px solid white";

  pointer.style.borderBottom =
    "3px solid white";

  pointer.style.background =
    "#3e3a3a";

  pointer.style.transform =
    "translateX(-50%) rotate(45deg)";

  pointer.style.transition =
    "background-color 200ms ease";

  marker.appendChild(
    pointer
  );

  marker.addEventListener(
    "mouseenter",
    () => {
      if (
        marker.dataset
          .selected === "true"
      ) {
        return;
      }

      marker.style.transform =
        "translateY(-5px) scale(1.06)";

      marker.style.boxShadow =
        "0 12px 26px rgba(62, 58, 58, 0.34)";
    }
  );

  marker.addEventListener(
    "mouseleave",
    () => {
      if (
        marker.dataset
          .selected === "true"
      ) {
        return;
      }

      marker.style.transform =
        "translateY(-2px) scale(1)";

      marker.style.boxShadow =
        "0 8px 20px rgba(62, 58, 58, 0.28)";
    }
  );

  return marker;
}

function createSaunaPopupContent(
  sauna: Sauna,
  ranking: number,
  distanceKm: number | null
): HTMLDivElement {
  const container =
    document.createElement("div");

  container.style.minWidth =
    "210px";

  container.style.padding =
    "5px 3px";

  const eyebrowRow =
    document.createElement(
      "div"
    );

  eyebrowRow.style.display =
    "flex";

  eyebrowRow.style.alignItems =
    "center";

  eyebrowRow.style.flexWrap =
    "wrap";

  eyebrowRow.style.gap =
    "6px";

  const rankingLabel =
    document.createElement(
      "span"
    );

  rankingLabel.textContent =
    `検索結果 ${ranking}`;

  rankingLabel.style.display =
    "inline-flex";

  rankingLabel.style.alignItems =
    "center";

  rankingLabel.style.minHeight =
    "22px";

  rankingLabel.style.padding =
    "3px 8px";

  rankingLabel.style.borderRadius =
    "9999px";

  rankingLabel.style.background =
    "rgba(253, 208, 0, 0.22)";

  rankingLabel.style.color =
    "#3e3a3a";

  rankingLabel.style.fontSize =
    "10px";

  rankingLabel.style.fontWeight =
    "800";

  rankingLabel.style.lineHeight =
    "1";

  eyebrowRow.appendChild(
    rankingLabel
  );

  if (distanceKm !== null) {
    const distanceLabel =
      document.createElement(
        "span"
      );

    distanceLabel.textContent =
      `現在地から ${formatDistance(
        distanceKm
      )}`;

    distanceLabel.style.display =
      "inline-flex";

    distanceLabel.style.alignItems =
      "center";

    distanceLabel.style.minHeight =
      "22px";

    distanceLabel.style.padding =
      "3px 8px";

    distanceLabel.style.borderRadius =
      "9999px";

    distanceLabel.style.background =
      "rgba(0, 180, 182, 0.12)";

    distanceLabel.style.color =
      "#007f81";

    distanceLabel.style.fontSize =
      "10px";

    distanceLabel.style.fontWeight =
      "800";

    distanceLabel.style.lineHeight =
      "1";

    eyebrowRow.appendChild(
      distanceLabel
    );
  }

  container.appendChild(
    eyebrowRow
  );

  const name =
    document.createElement("p");

  name.textContent =
    sauna.name;

  name.style.margin =
    "10px 0 0";

  name.style.fontSize =
    "15px";

  name.style.fontWeight =
    "800";

  name.style.lineHeight =
    "1.5";

  name.style.color =
    "#3e3a3a";

  container.appendChild(name);

  const locationText = [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(Boolean)
    .join(" ");

  if (locationText) {
    const location =
      document.createElement("p");

    location.textContent =
      locationText;

    location.style.margin =
      "4px 0 0";

    location.style.fontSize =
      "12px";

    location.style.lineHeight =
      "1.5";

    location.style.color =
      "rgba(62, 58, 58, 0.58)";

    container.appendChild(
      location
    );
  }

  const link =
    document.createElement("a");

  link.href =
    `/saunas/${sauna.id}`;

  link.textContent =
    "施設詳細を見る";

  link.style.display =
    "flex";

  link.style.alignItems =
    "center";

  link.style.justifyContent =
    "center";

  link.style.minHeight =
    "38px";

  link.style.marginTop =
    "12px";

  link.style.padding =
    "8px 14px";

  link.style.borderRadius =
    "9999px";

  link.style.background =
    "#3e3a3a";

  link.style.color =
    "white";

  link.style.fontSize =
    "12px";

  link.style.fontWeight =
    "700";

  link.style.textDecoration =
    "none";

  container.appendChild(link);

  return container;
}

function createCurrentLocationPopupContent():
  HTMLDivElement {
  const container =
    document.createElement("div");

  container.style.minWidth =
    "170px";

  container.style.padding =
    "5px 3px";

  const label =
    document.createElement(
      "span"
    );

  label.textContent =
    "CURRENT LOCATION";

  label.style.display =
    "inline-flex";

  label.style.padding =
    "4px 8px";

  label.style.borderRadius =
    "9999px";

  label.style.background =
    "rgba(37, 99, 235, 0.10)";

  label.style.color =
    "#2563eb";

  label.style.fontSize =
    "9px";

  label.style.fontWeight =
    "800";

  label.style.letterSpacing =
    "0.08em";

  container.appendChild(label);

  const title =
    document.createElement("p");

  title.textContent =
    "あなたの現在地";

  title.style.margin =
    "9px 0 0";

  title.style.fontSize =
    "14px";

  title.style.fontWeight =
    "800";

  title.style.lineHeight =
    "1.5";

  title.style.color =
    "#3e3a3a";

  container.appendChild(title);

  const description =
    document.createElement("p");

  description.textContent =
    "この地点を基準に周辺施設を検索しています。";

  description.style.margin =
    "4px 0 0";

  description.style.fontSize =
    "12px";

  description.style.lineHeight =
    "1.6";

  description.style.color =
    "rgba(62, 58, 58, 0.58)";

  container.appendChild(
    description
  );

  return container;
}

function createCurrentLocationMarkerElement():
  HTMLButtonElement {
  const marker =
    document.createElement(
      "button"
    );

  marker.type = "button";

  marker.setAttribute(
    "aria-label",
    "あなたの現在地"
  );

  marker.style.position =
    "relative";

  marker.style.width =
    "28px";

  marker.style.height =
    "28px";

  marker.style.padding = "0";
  marker.style.border = "0";

  marker.style.borderRadius =
    "9999px";

  marker.style.background =
    "transparent";

  marker.style.cursor =
    "pointer";

  const pulse =
    document.createElement("span");

  pulse.setAttribute(
    "aria-hidden",
    "true"
  );

  pulse.style.position =
    "absolute";

  pulse.style.inset = "0";

  pulse.style.borderRadius =
    "9999px";

  pulse.style.background =
    "rgba(37, 99, 235, 0.22)";

  pulse.style.boxShadow =
    "0 0 0 10px rgba(37, 99, 235, 0.10)";

  const center =
    document.createElement("span");

  center.setAttribute(
    "aria-hidden",
    "true"
  );

  center.style.position =
    "absolute";

  center.style.inset =
    "6px";

  center.style.border =
    "3px solid white";

  center.style.borderRadius =
    "9999px";

  center.style.background =
    "#2563eb";

  center.style.boxShadow =
    "0 3px 10px rgba(37, 99, 235, 0.38)";

  marker.appendChild(pulse);
  marker.appendChild(center);

  return marker;
}

function clearSelectedCards():
  void {
  document
    .querySelectorAll<HTMLElement>(
      '[data-sauna-result-card="true"]'
    )
    .forEach((card) => {
      card.classList.remove(
        ...SELECTED_CARD_CLASSES
      );

      card.removeAttribute(
        "aria-current"
      );
    });
}

function selectSaunaCard(
  saunaId: string
): void {
  const selectedCard =
    document.getElementById(
      `sauna-card-${saunaId}`
    );

  clearSelectedCards();

  if (selectedCard) {
    selectedCard.classList.add(
      ...SELECTED_CARD_CLASSES
    );

    selectedCard.setAttribute(
      "aria-current",
      "true"
    );

    if (
      highlightTimeoutId !== null
    ) {
      window.clearTimeout(
        highlightTimeoutId
      );
    }

    highlightTimeoutId =
      window.setTimeout(() => {
        selectedCard.classList.remove(
          ...SELECTED_CARD_CLASSES
        );

        selectedCard.removeAttribute(
          "aria-current"
        );

        highlightTimeoutId =
          null;
      }, 2600);
  }

  window.dispatchEvent(
    new CustomEvent<SaunaCardSelectEventDetail>(
      SAUNA_CARD_SELECT_EVENT,
      {
        detail: {
          saunaId,
        },
      }
    )
  );
}

function resetMarkerAppearance(
  marker: Marker
): void {
  const markerElement =
    marker.getElement();

  markerElement.dataset.selected =
    "false";

  markerElement.style.zIndex =
    "";

  markerElement.style.background =
    "#3e3a3a";

  markerElement.style.color =
    "white";

  markerElement.style.transform =
    "translateY(-2px) scale(1)";

  markerElement.style.boxShadow =
    "0 8px 20px rgba(62, 58, 58, 0.28)";

  const pointer =
    markerElement.querySelector(
      "span"
    );

  if (
    pointer instanceof
    HTMLElement
  ) {
    pointer.style.background =
      "#3e3a3a";
  }
}

function selectMarkerAppearance(
  marker: Marker
): void {
  const markerElement =
    marker.getElement();

  markerElement.dataset.selected =
    "true";

  markerElement.style.zIndex =
    "10";

  markerElement.style.background =
    "#fdd000";

  markerElement.style.color =
    "#3e3a3a";

  markerElement.style.transform =
    "translateY(-7px) scale(1.16)";

  markerElement.style.boxShadow =
    [
      "0 14px 30px rgba(253, 208, 0, 0.34)",
      "0 0 0 6px rgba(253, 208, 0, 0.18)",
    ].join(", ");

  const pointer =
    markerElement.querySelector(
      "span"
    );

  if (
    pointer instanceof
    HTMLElement
  ) {
    pointer.style.background =
      "#fdd000";
  }
}

export function MapView({
  saunas,
  currentLocation = null,
}: MapViewProps) {
  const mapContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const mapRef =
    useRef<MapLibreMap | null>(
      null
    );

  const markersRef =
    useRef<Marker[]>([]);

  const saunaMarkersRef =
    useRef<
      Map<string, Marker>
    >(new Map());

  const selectedMarkerRef =
    useRef<Marker | null>(
      null
    );

  useEffect(() => {
    const mapContainer =
      mapContainerRef.current;

    if (!mapContainer) {
      return;
    }

    const saunaMarkersById =
      saunaMarkersRef.current;

    const validSaunas =
      saunas.filter(
        hasValidCoordinates
      );

    const validSaunasById =
      new Map(
        validSaunas.map(
          (sauna) => [
            sauna.id,
            sauna,
          ]
        )
      );

    const validCurrentLocation =
      hasValidCurrentLocation(
        currentLocation
      )
        ? currentLocation
        : null;

    const searchRadiusGeoJson =
      hasValidSearchRadius(
        currentLocation
      )
        ? createSearchRadiusGeoJson(
            currentLocation
          )
        : null;

    const mapPoints: [
      number,
      number,
    ][] = validSaunas.map(
      (sauna) => [
        sauna.longitude,
        sauna.latitude,
      ]
    );

    if (validCurrentLocation) {
      mapPoints.push([
        validCurrentLocation.longitude,
        validCurrentLocation.latitude,
      ]);
    }

    const initialCenter =
      mapPoints.length === 1
        ? mapPoints[0]
        : DEFAULT_CENTER;

    const initialZoom =
      mapPoints.length === 1
        ? SINGLE_POINT_ZOOM
        : DEFAULT_ZOOM;

    const map =
      new maplibregl.Map({
        container:
          mapContainer,
        style:
          "https://demotiles.maplibre.org/style.json",
        center:
          initialCenter,
        zoom:
          initialZoom,
      });

    map.addControl(
      new maplibregl.NavigationControl(
        {
          showCompass: true,
          showZoom: true,
          visualizePitch: true,
        }
      ),
      "top-right"
    );

    mapRef.current = map;

    const selectSaunaOnMap = (
      saunaId: string
    ): void => {
      const sauna =
        validSaunasById.get(
          saunaId
        );

      const marker =
        saunaMarkersById.get(
          saunaId
        );

      if (!sauna || !marker) {
        return;
      }

      if (
        selectedMarkerRef.current &&
        selectedMarkerRef.current !==
          marker
      ) {
        resetMarkerAppearance(
          selectedMarkerRef.current
        );

        const previousPopup =
          selectedMarkerRef.current.getPopup();

        if (
          previousPopup?.isOpen()
        ) {
          previousPopup.remove();
        }
      }

      selectMarkerAppearance(
        marker
      );

      selectedMarkerRef.current =
        marker;

      map.easeTo({
        center: [
          sauna.longitude,
          sauna.latitude,
        ],
        zoom: Math.max(
          map.getZoom(),
          SELECTED_SAUNA_ZOOM
        ),
        duration: 650,
        essential: true,
      });

      const popup =
        marker.getPopup();

      if (
        popup &&
        !popup.isOpen()
      ) {
        marker.togglePopup();
      }
    };

    const handleCardSelection = (
      event: Event
    ): void => {
      const customEvent =
        event as CustomEvent<SaunaMapSelectEventDetail>;

      const saunaId =
        customEvent.detail
          ?.saunaId;

      if (!saunaId) {
        return;
      }

      selectSaunaOnMap(
        saunaId
      );
    };

    window.addEventListener(
      SAUNA_MAP_SELECT_EVENT,
      handleCardSelection
    );

    map.on("load", () => {
      if (
        searchRadiusGeoJson
      ) {
        map.addSource(
          SEARCH_RADIUS_SOURCE_ID,
          {
            type: "geojson",
            data:
              searchRadiusGeoJson,
          }
        );

        map.addLayer({
          id:
            SEARCH_RADIUS_FILL_LAYER_ID,
          type: "fill",
          source:
            SEARCH_RADIUS_SOURCE_ID,
          paint: {
            "fill-color":
              "#00b4b6",
            "fill-opacity":
              0.12,
          },
        });

        map.addLayer({
          id:
            SEARCH_RADIUS_LINE_LAYER_ID,
          type: "line",
          source:
            SEARCH_RADIUS_SOURCE_ID,
          paint: {
            "line-color":
              "#00b4b6",
            "line-opacity":
              0.85,
            "line-width":
              2,
          },
        });
      }

      const saunaMarkers =
        validSaunas.map(
          (sauna) => {
            const ranking =
              saunas.findIndex(
                (item) =>
                  item.id ===
                  sauna.id
              ) + 1;

            const distanceKm =
              validCurrentLocation
                ? calculateDistanceKm(
                    validCurrentLocation.latitude,
                    validCurrentLocation.longitude,
                    sauna.latitude,
                    sauna.longitude
                  )
                : null;

            const markerElement =
              createSaunaMarkerElement(
                sauna,
                ranking
              );

            const popup =
              new maplibregl.Popup(
                {
                  offset: 28,
                  closeButton:
                    true,
                  closeOnClick:
                    true,
                }
              ).setDOMContent(
                createSaunaPopupContent(
                  sauna,
                  ranking,
                  distanceKm
                )
              );

            const marker =
              new maplibregl.Marker(
                {
                  element:
                    markerElement,
                  anchor:
                    "bottom",
                }
              )
                .setLngLat([
                  sauna.longitude,
                  sauna.latitude,
                ])
                .setPopup(
                  popup
                )
                .addTo(map);

            saunaMarkersById.set(
              sauna.id,
              marker
            );

            const handleSelectSauna =
              () => {
                selectSaunaOnMap(
                  sauna.id
                );

                selectSaunaCard(
                  sauna.id
                );
              };

            markerElement.addEventListener(
              "click",
              handleSelectSauna
            );

            markerElement.addEventListener(
              "keydown",
              (event) => {
                if (
                  event.key ===
                    "Enter" ||
                  event.key ===
                    " "
                ) {
                  event.preventDefault();

                  handleSelectSauna();
                }
              }
            );

            popup.on(
              "close",
              () => {
                if (
                  selectedMarkerRef.current ===
                  marker
                ) {
                  resetMarkerAppearance(
                    marker
                  );

                  selectedMarkerRef.current =
                    null;
                }
              }
            );

            return marker;
          }
        );

      const currentLocationMarker =
        validCurrentLocation
          ? new maplibregl.Marker(
              {
                element:
                  createCurrentLocationMarkerElement(),
                anchor:
                  "center",
              }
            )
              .setLngLat([
                validCurrentLocation.longitude,
                validCurrentLocation.latitude,
              ])
              .setPopup(
                new maplibregl.Popup(
                  {
                    offset: 18,
                    closeButton:
                      true,
                    closeOnClick:
                      true,
                  }
                ).setDOMContent(
                  createCurrentLocationPopupContent()
                )
              )
              .addTo(map)
          : null;

      markersRef.current =
        currentLocationMarker
          ? [
              ...saunaMarkers,
              currentLocationMarker,
            ]
          : saunaMarkers;

      if (
        mapPoints.length >= 2 ||
        searchRadiusGeoJson
      ) {
        const bounds =
          new maplibregl.LngLatBounds();

        for (
          const point of mapPoints
        ) {
          bounds.extend(point);
        }

        if (
          searchRadiusGeoJson
        ) {
          extendBoundsWithPolygon(
            bounds,
            searchRadiusGeoJson
          );
        }

        map.fitBounds(bounds, {
          padding: {
            top: 72,
            right: 72,
            bottom: 72,
            left: 72,
          },
          maxZoom:
            MAX_FIT_BOUNDS_ZOOM,
          duration: 0,
        });
      }
    });

    return () => {
      window.removeEventListener(
        SAUNA_MAP_SELECT_EVENT,
        handleCardSelection
      );

      if (
        selectedMarkerRef.current
      ) {
        resetMarkerAppearance(
          selectedMarkerRef.current
        );

        selectedMarkerRef.current =
          null;
      }

      saunaMarkersById.clear();

      for (
        const marker of markersRef.current
      ) {
        marker.remove();
      }

      markersRef.current = [];

      map.remove();

      mapRef.current = null;

      if (
        highlightTimeoutId !==
        null
      ) {
        window.clearTimeout(
          highlightTimeoutId
        );

        highlightTimeoutId =
          null;
      }

      clearSelectedCards();
    };
  }, [
    saunas,
    currentLocation,
  ]);

  const validSaunaCount =
    saunas.filter(
      hasValidCoordinates
    ).length;

  const isCurrentLocationVisible =
    hasValidCurrentLocation(
      currentLocation
    );

  return (
    <div
      className="
        relative
        min-h-[24rem]
        w-full
        bg-[#e6e5ef]
        sm:min-h-[30rem]
        xl:h-[calc(100vh-12rem)]
        xl:max-h-[46rem]
        xl:min-h-[36rem]
      "
    >
      <div
        ref={mapContainerRef}
        className="
          absolute
          inset-0
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-3
          left-3
          z-10
          flex
          max-w-[calc(100%-1.5rem)]
          flex-wrap
          items-center
          gap-2
        "
      >
        <span
          className="
            rounded-full
            border
            border-white/70
            bg-white/90
            px-3
            py-1.5
            text-[0.6875rem]
            font-semibold
            text-[#3e3a3a]/65
            shadow-sm
            backdrop-blur-md
          "
        >
          {validSaunaCount}
          件を表示
        </span>

        {isCurrentLocationVisible ? (
          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/70
              bg-white/90
              px-3
              py-1.5
              text-[0.6875rem]
              font-semibold
              text-[#3e3a3a]/65
              shadow-sm
              backdrop-blur-md
            "
          >
            <span
              aria-hidden="true"
              className="
                size-2
                rounded-full
                bg-blue-600
                ring-4
                ring-blue-600/15
              "
            />

            現在地
          </span>
        ) : null}

        {hasValidSearchRadius(
          currentLocation
        ) ? (
          <span
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/70
              bg-white/90
              px-3
              py-1.5
              text-[0.6875rem]
              font-semibold
              text-[#3e3a3a]/65
              shadow-sm
              backdrop-blur-md
            "
          >
            <span
              aria-hidden="true"
              className="
                size-2.5
                rounded-full
                border-2
                border-[#00b4b6]
                bg-[#00b4b6]/15
              "
            />

            半径
            {
              currentLocation.radiusKm
            }
            km
          </span>
        ) : null}
      </div>
    </div>
  );
}
