import { Divider, Stack, Typography } from "@mui/material";
import { LatLng, Map } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { Color } from "../components/colors";
import {
  ErrorListItems,
  ForecastZone,
  ForecastZoneChip,
  ForecastZoneLayer,
  ForecastZoneProps,
  MapSearchResult,
  RenderableMapSearchResult,
  SearchableMap,
  shortForecastID,
} from "../components/map";
import { SaveDialog } from "../components/SaveDialog";

export default function FindMe() {
  const [renderedLayers, setRenderedLayers] = useState<
    Record<string, JSX.Element>
  >({});
  const [viewportLayers, setViewportLayers] = useState<JSX.Element[]>([]);
  const [viewportChips, setViewportChips] = useState<JSX.Element[]>([]);
  const [viewportIDs, setViewportIDs] = useState<string[]>([]);

  const [selectedZoneIDs, setSelectedZoneIDs] = useState<string[]>([]);
  const [highlightedZone, setHighlightedZone] = useState<string | null>(null);
  const [fetchedZones, setFetchedZones] = useState<
    Record<string, ForecastZone>
  >({});

  const doTypeaheadSearch = async (
    prefix: string
  ): Promise<RenderableMapSearchResult[]> => {
    const params = new URLSearchParams({
      prefix,
    });

    const response = await fetch(`/api/v1/typeahead?${params.toString()}`);
    const data = await response.json();

    return data.map((x: MapSearchResult) => new RenderableMapSearchResult(x));
  };

  const onLocationSelected = (
    val: RenderableMapSearchResult | null,
    map: Map | null
  ) => {
    if (val && map && val.result.centroid && val.result.centroid.coordinates) {
      map.setView(
        new LatLng(
          val.result.centroid.coordinates[1],
          val.result.centroid.coordinates[0]
        ),
        10
      );
    }
  };

  const onZoneStateChange = useCallback((p: ForecastZoneProps) => {
    const id = shortForecastID(p.id);
    if (p.selected) {
      setSelectedZoneIDs((ids: string[]) => {
        if (ids.indexOf(id) === -1) {
          ids.push(id);
        }
        return [...ids];
      });
      return;
    }

    setSelectedZoneIDs((ids: string[]) => {
      const idx = ids.indexOf(id);
      if (idx !== -1) {
        ids.splice(idx, 1);
      }
      return [...ids];
    });

    setHighlightedZone(p.active ? id : null);
  }, []);

  const onMapChange = (map: Map) => {
    const se = map.getBounds().getSouthEast();
    const nw = map.getBounds().getNorthWest();

    setViewportChips([]);
    setViewportLayers([]);
    setViewportIDs([]);

    const params = new URLSearchParams({
      boxse: `${se.lng},${se.lat}`,
      boxnw: `${nw.lng},${nw.lat}`,
    });

    fetch(`/api/v1/zones/visible?${params}`).then((response) => {
      switch (response.status) {
        case 200:
          response.json().then((data: ForecastZone[]) => {
            const allLayers = { ...renderedLayers };
            const allZones = { ...fetchedZones };
            const vpIDs = [];
            for (const zone of data) {
              const id = shortForecastID(zone.id);
              vpIDs.push(id);
              if (!(id in allLayers)) {
                allLayers[id] = (
                  <ForecastZoneLayer
                    key={`${id}-layer`}
                    {...zone}
                    color={Color.randomXTermColor()}
                  />
                );
              }

              if (!(id in allZones)) {
                allZones[id] = zone;
              }
            }

            setRenderedLayers(allLayers);
            setViewportIDs(vpIDs);
            setFetchedZones(allZones);
          });
          break;
        case 204:
          setViewportChips([ErrorListItems.none]);
          break;
        case 422:
          setViewportChips([ErrorListItems.toomany]);
          break;
      }
    });
  };

  useEffect(() => {
    const visibleLayers = selectedZoneIDs.map(
      (id: string) => renderedLayers[id]
    );

    const sortedVPIDs = viewportIDs.filter(
      (id) => selectedZoneIDs.indexOf(id) === -1
    );
    sortedVPIDs.sort((a: string, b: string) => {
      const dispA =
        `${fetchedZones[a].name} county, ${fetchedZones[a].state}`.toLowerCase();
      const dispB =
        `${fetchedZones[b].name} county, ${fetchedZones[b].state}`.toLowerCase();

      return dispA.localeCompare(dispB);
    });

    const visibleChips = selectedZoneIDs.map((id) => (
      <ForecastZoneChip
        key={`${id}-chip`}
        onZoneStateChange={onZoneStateChange}
        {...fetchedZones[id]}
        selected={true}
      />
    ));

    visibleChips.push(
      ...sortedVPIDs.map((id) => (
        <ForecastZoneChip
          key={`${id}-chip`}
          onZoneStateChange={onZoneStateChange}
          {...fetchedZones[id]}
          selected={false}
        />
      ))
    );

    if (highlightedZone && selectedZoneIDs.indexOf(highlightedZone) === -1) {
      visibleLayers.push(renderedLayers[highlightedZone]);
    }

    console.log(visibleChips);

    setViewportChips(visibleChips);
    setViewportLayers(visibleLayers);
  }, [
    selectedZoneIDs,
    viewportIDs,
    highlightedZone,
    renderedLayers,
    fetchedZones,
    onZoneStateChange,
  ]);

  return (
    <Stack
      direction="column"
      spacing={2}
      divider={<Divider orientation="horizontal" flexItem />}
      sx={{ padding: "10vh 10vw" }}
    >
      <Typography variant="h4" textAlign="center">
        Find my Zones
      </Typography>
      <SearchableMap
        getRemoteResults={doTypeaheadSearch}
        onSearchValueChange={onLocationSelected}
        onMapChange={onMapChange}
      >
        {viewportLayers}
      </SearchableMap>
      <Typography>
        To use the Watchedsky feed in Bluesky, you have to tell the feed which
        areas you want to watch. To do that, search the map above -- enter the
        city name or ZIP code you want to search for and zoom in until results
        appear (for performance reasons, only 20 results are returned at a
        time). Once you select all the areas, click the <strong>Save</strong>{" "}
        button. It will present a code to copy to your Bluesky profile.
      </Typography>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
      >
        <SaveDialog selectedZoneIDs={selectedZoneIDs} />
      </Stack>
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        direction="row"
        useFlexGap
        flexWrap="wrap"
      >
        {viewportChips.length === 0 ? (
          <Typography variant="caption">
            To get started, search on the map above, and zoom in until results
            appear
          </Typography>
        ) : (
          viewportChips
        )}
      </Stack>
    </Stack>
  );
}
