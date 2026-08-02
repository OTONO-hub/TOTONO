import type { ComponentProps } from "react";

import { MapView } from "@/components/map/MapView";

type MapViewProps =
  ComponentProps<typeof MapView>;

export type SearchSauna =
  MapViewProps["saunas"][number];

export type SearchCurrentLocation =
  MapViewProps["currentLocation"];

export type MobileSearchView =
  | "list"
  | "map";