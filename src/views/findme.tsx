import { Divider, List, Stack, Typography } from "@mui/material";
import { LatLng, Map } from "leaflet";
import { useState } from "react";
import {
  ErrorListItems,
  ForecastZone,
  ForecastZoneLayer,
  ForecastZoneListItem,
  ForecastZoneProps,
  MapSearchResult,
  RenderableMapSearchResult,
  SearchableMap,
  shortForecastID,
} from "../components/map";

export default function FindMe() {
  const [mapLayers, setMapLayers] = useState<JSX.Element[]>([]);
  const [listItems, setListItems] = useState<JSX.Element[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const doTypeaheadSearch = async (
    prefix: string,
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
          val.result.centroid.coordinates[0],
        ),
        10
      );
    }
  };

  const onMapChange = (map: Map) => {
    const se = map.getBounds().getSouthEast();
    const nw = map.getBounds().getNorthWest();

    setMapLayers([]);
    setListItems([]);

    const params = new URLSearchParams({
      boxse: `${se.lng},${se.lat}`,
      boxnw: `${nw.lng},${nw.lat}`,
    });

    fetch(`/api/v1/zones/visible?${params}`).then((response) => {
      switch (response.status) {
        case 200:
          response.json().then((data: ForecastZone[]) => {
            const layers = [];
            const listItems = [];
            for (const zone of data) {
              const id = shortForecastID(zone.id);
              layers.push(
                <ForecastZoneLayer
                  {...zone}
                  active={id === activeZone}
                  selected={selectedZones.includes(id)}
                />
              );

              listItems.push(
                <ForecastZoneListItem
                  {...zone}
                  active={id === activeZone}
                  selected={selectedZones.includes(id)}
                  onZoneStateChange={onZoneStateChange}
                />
              );
            }
            setMapLayers(layers);
            setListItems(listItems);
          });
          break;
        case 204:
          setListItems([ErrorListItems.none]);
          break;
        case 422:
          setListItems([ErrorListItems.toomany]);
          break;
      }
    });
  };

  const onZoneStateChange = (p: ForecastZoneProps) => {
    const idx = selectedZones.indexOf(p.id);
    if (p.selected) {
      if (idx === -1) {
        setSelectedZones([...selectedZones, p.id]);
        return;
      }
    }

    if (idx !== -1) {
      const newZones = [...selectedZones];
      newZones.splice(idx, 1);
      setSelectedZones(newZones);
    }

    setActiveZone(p.active ? p.id : null);
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      divider={<Divider orientation="horizontal" flexItem />}
      sx={{ padding: "10vh 10vw" }}
    >
      <Typography variant="h4" textAlign="center">Find my Zones</Typography>
      <SearchableMap
        getRemoteResults={doTypeaheadSearch}
        onSearchValueChange={onLocationSelected}
        onMapChange={onMapChange}
      >
        {mapLayers}
      </SearchableMap>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {listItems}
      </List>
    </Stack>
  );
}
