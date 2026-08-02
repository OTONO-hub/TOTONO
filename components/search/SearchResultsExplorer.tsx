"use client";

import {
  Children,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ComparisonTray } from "@/components/search/ComparisonTray";
import { MobileSearchSwitcher } from "@/components/search/MobileSearchSwitcher";
import { SearchMapPanel } from "@/components/search/SearchMapPanel";
import { SearchResultsList } from "@/components/search/SearchResultsList";
import { SelectedSaunaPanel } from "@/components/search/SelectedSaunaPanel";
import { SelectedSaunaRecommendation } from "@/components/search/SelectedSaunaRecommendation";
import { TodayPlanCard } from "@/components/search/TodayPlanCard";
import { TodaySaunaBanner } from "@/components/search/TodaySaunaBanner";
import type {
  MobileSearchView,
  SearchCurrentLocation,
  SearchSauna,
} from "@/components/search/search-results-explorer.types";
import { usePersistedActiveSauna } from "@/components/search/use-persisted-active-sauna";
import { usePersistedComparisonSaunas } from "@/components/search/use-persisted-comparison-saunas";
import { useTodaySauna } from "@/components/search/use-today-sauna";

type SearchResultsExplorerProps = {
  saunas: SearchSauna[];
  currentLocation: SearchCurrentLocation;
  children: ReactNode;
};

type SaunaMapSelectEventDetail = {
  saunaId: string;
};

type SaunaCardSelectEventDetail = {
  saunaId: string;
};

const SAUNA_MAP_SELECT_EVENT =
  "totono:select-sauna-on-map";

const SAUNA_CARD_SELECT_EVENT =
  "totono:select-sauna-card";

const MAX_COMPARISON_SAUNAS = 3;

function dispatchSaunaMapSelection(
  saunaId: string
): void {
  window.dispatchEvent(
    new CustomEvent<SaunaMapSelectEventDetail>(
      SAUNA_MAP_SELECT_EVENT,
      {
        detail: {
          saunaId,
        },
      }
    )
  );
}

function scrollToSaunaCard(
  saunaId: string
): void {
  const selectedCard =
    document.getElementById(
      `sauna-card-${saunaId}`
    );

  if (!selectedCard) {
    return;
  }

  selectedCard.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
}

export function SearchResultsExplorer({
  saunas,
  currentLocation,
  children,
}: SearchResultsExplorerProps) {
  const [
    mobileView,
    setMobileView,
  ] = useState<MobileSearchView>(
    "list"
  );

  const [
    activeSaunaId,
    setActiveSaunaId,
  ] =
    usePersistedActiveSauna();

  const [
    comparisonSaunaIds,
    setComparisonSaunaIds,
  ] =
    usePersistedComparisonSaunas();

  const [
    todaySauna,
    setTodaySauna,
  ] = useTodaySauna();

  const saunaCards =
    Children.toArray(children);

  const availableSaunaIdSet =
    useMemo(
      () =>
        new Set(
          saunas.map(
            (sauna) =>
              sauna.id
          )
        ),
      [saunas]
    );

  const resolvedActiveSaunaId =
    activeSaunaId &&
    availableSaunaIdSet.has(
      activeSaunaId
    )
      ? activeSaunaId
      : null;

  const validComparisonSaunaIds =
    useMemo(
      () =>
        comparisonSaunaIds.filter(
          (saunaId) =>
            availableSaunaIdSet.has(
              saunaId
            )
        ),
      [
        comparisonSaunaIds,
        availableSaunaIdSet,
      ]
    );

  const activeSauna =
    useMemo(
      () =>
        saunas.find(
          (sauna) =>
            sauna.id ===
            resolvedActiveSaunaId
        ) ?? null,
      [
        resolvedActiveSaunaId,
        saunas,
      ]
    );

  const activeSaunaRanking =
    useMemo(() => {
      if (
        !resolvedActiveSaunaId
      ) {
        return null;
      }

      const index =
        saunas.findIndex(
          (sauna) =>
            sauna.id ===
            resolvedActiveSaunaId
        );

      return index >= 0
        ? index + 1
        : null;
    }, [
      resolvedActiveSaunaId,
      saunas,
    ]);

  const activeSaunaLocation =
    useMemo(() => {
      if (!activeSauna) {
        return "";
      }

      return [
        activeSauna.prefecture,
        activeSauna.city,
      ]
        .filter(Boolean)
        .join(" ");
    }, [activeSauna]);

  const comparisonSaunas =
    useMemo(
      () =>
        validComparisonSaunaIds
          .map((saunaId) =>
            saunas.find(
              (sauna) =>
                sauna.id ===
                saunaId
            )
          )
          .filter(
            (
              sauna
            ): sauna is SearchSauna =>
              Boolean(sauna)
          ),
      [
        validComparisonSaunaIds,
        saunas,
      ]
    );

  const selectSaunaFromCard = (
    saunaId: string
  ): void => {
    setActiveSaunaId(
      saunaId
    );

    dispatchSaunaMapSelection(
      saunaId
    );
  };

  const showSaunaOnMap = (
    saunaId: string
  ): void => {
    setActiveSaunaId(
      saunaId
    );

    setMobileView("map");

    window.requestAnimationFrame(
      () => {
        window.requestAnimationFrame(
          () => {
            dispatchSaunaMapSelection(
              saunaId
            );
          }
        );
      }
    );
  };

  const showActiveSaunaOnMap =
    (): void => {
      if (
        !resolvedActiveSaunaId
      ) {
        return;
      }

      showSaunaOnMap(
        resolvedActiveSaunaId
      );
    };

  const toggleComparisonSauna = (
    saunaId: string
  ): void => {
    setComparisonSaunaIds(
      (currentIds) => {
        const validCurrentIds =
          currentIds.filter(
            (currentId) =>
              availableSaunaIdSet.has(
                currentId
              )
          );

        if (
          validCurrentIds.includes(
            saunaId
          )
        ) {
          return validCurrentIds.filter(
            (currentId) =>
              currentId !==
              saunaId
          );
        }

        if (
          validCurrentIds.length >=
          MAX_COMPARISON_SAUNAS
        ) {
          return validCurrentIds;
        }

        return [
          ...validCurrentIds,
          saunaId,
        ];
      }
    );
  };

  const removeComparisonSauna = (
    saunaId: string
  ): void => {
    setComparisonSaunaIds(
      (currentIds) =>
        currentIds.filter(
          (currentId) =>
            currentId !==
            saunaId
        )
    );
  };

  const clearComparisonSaunas =
    (): void => {
      setComparisonSaunaIds(
        []
      );
    };

  const setActiveSaunaAsToday =
    (): void => {
      if (!activeSauna) {
        return;
      }

      setTodaySauna({
        id: activeSauna.id,
        name: activeSauna.name,
        prefecture:
          activeSauna.prefecture ??
          null,
        city:
          activeSauna.city ??
          null,
        latitude:
          typeof activeSauna.latitude ===
          "number"
            ? activeSauna.latitude
            : null,
        longitude:
          typeof activeSauna.longitude ===
          "number"
            ? activeSauna.longitude
            : null,
        selectedAt:
          new Date().toISOString(),
      });
    };

  const clearTodaySauna =
    (): void => {
      setTodaySauna(null);
    };

  useEffect(() => {
    const handleSaunaCardSelection = (
      event: Event
    ): void => {
      const customEvent =
        event as CustomEvent<SaunaCardSelectEventDetail>;

      const saunaId =
        customEvent.detail
          ?.saunaId;

      if (
        !saunaId ||
        !availableSaunaIdSet.has(
          saunaId
        )
      ) {
        return;
      }

      setActiveSaunaId(
        saunaId
      );

      setMobileView("list");

      window.requestAnimationFrame(
        () => {
          window.requestAnimationFrame(
            () => {
              scrollToSaunaCard(
                saunaId
              );
            }
          );
        }
      );
    };

    window.addEventListener(
      SAUNA_CARD_SELECT_EVENT,
      handleSaunaCardSelection
    );

    return () => {
      window.removeEventListener(
        SAUNA_CARD_SELECT_EVENT,
        handleSaunaCardSelection
      );
    };
  }, [
    availableSaunaIdSet,
    setActiveSaunaId,
  ]);

  useEffect(() => {
    if (
      !resolvedActiveSaunaId
    ) {
      return;
    }

    window.requestAnimationFrame(
      () => {
        dispatchSaunaMapSelection(
          resolvedActiveSaunaId
        );
      }
    );
  }, [
    resolvedActiveSaunaId,
  ]);

  return (
    <div className="mt-8">
      <MobileSearchSwitcher
        activeView={
          mobileView
        }
        resultCount={
          saunas.length
        }
        onChange={
          setMobileView
        }
      />

      <SelectedSaunaPanel
        sauna={
          activeSauna
        }
        ranking={
          activeSaunaRanking
        }
        location={
          activeSaunaLocation
        }
        resultCount={
          saunas.length
        }
        isComparisonSauna={
          Boolean(
            activeSauna &&
              validComparisonSaunaIds.includes(
                activeSauna.id
              )
          )
        }
        comparisonIsFull={
          validComparisonSaunaIds.length >=
          MAX_COMPARISON_SAUNAS
        }
        onToggleComparison={
          toggleComparisonSauna
        }
        onShowMap={
          showActiveSaunaOnMap
        }
      />

      <TodaySaunaBanner
        activeSauna={
          activeSauna
        }
        todaySauna={
          todaySauna
        }
        onSetTodaySauna={
          setActiveSaunaAsToday
        }
        onClearTodaySauna={
          clearTodaySauna
        }
      />

      {activeSauna &&
      activeSaunaRanking !== null ? (
        <div className="mb-8">
          <SelectedSaunaRecommendation
            saunaName={
              activeSauna.name
            }
            prefecture={
              activeSauna.prefecture
            }
            city={
              activeSauna.city
            }
            latitude={
              activeSauna.latitude
            }
            longitude={
              activeSauna.longitude
            }
            ranking={
              activeSaunaRanking
            }
            currentLocation={
              currentLocation
                ? {
                    latitude:
                      currentLocation.latitude,
                    longitude:
                      currentLocation.longitude,
                  }
                : null
            }
            isComparisonSauna={
              validComparisonSaunaIds.includes(
                activeSauna.id
              )
            }
          />
        </div>
      ) : null}

      {activeSauna &&
      activeSaunaRanking !== null ? (
        <div className="mb-8">
          <TodayPlanCard
            key={
              activeSauna.id
            }
            saunaId={
              activeSauna.id
            }
            saunaName={
              activeSauna.name
            }
            prefecture={
              activeSauna.prefecture
            }
            city={
              activeSauna.city
            }
            latitude={
              activeSauna.latitude
            }
            longitude={
              activeSauna.longitude
            }
            ranking={
              activeSaunaRanking
            }
          />
        </div>
      ) : null}

      <ComparisonTray
        saunas={
          saunas
        }
        comparisonSaunas={
          comparisonSaunas
        }
        maximumCount={
          MAX_COMPARISON_SAUNAS
        }
        onShowMap={
          showSaunaOnMap
        }
        onRemove={
          removeComparisonSauna
        }
        onClear={
          clearComparisonSaunas
        }
      />

      <div
        className="
          grid
          gap-8
          xl:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.95fr)]
          xl:items-start
        "
      >
        <SearchResultsList
          saunas={
            saunas
          }
          cards={
            saunaCards
          }
          activeSaunaId={
            resolvedActiveSaunaId
          }
          comparisonSaunaIds={
            validComparisonSaunaIds
          }
          maximumComparisonCount={
            MAX_COMPARISON_SAUNAS
          }
          isVisibleOnMobile={
            mobileView ===
            "list"
          }
          onSelectSauna={
            selectSaunaFromCard
          }
          onToggleComparison={
            toggleComparisonSauna
          }
        />

        <SearchMapPanel
          saunas={
            saunas
          }
          currentLocation={
            currentLocation
          }
          activeSauna={
            activeSauna
          }
          isVisibleOnMobile={
            mobileView ===
            "map"
          }
          onShowList={() =>
            setMobileView(
              "list"
            )
          }
        />
      </div>
    </div>
  );
}
