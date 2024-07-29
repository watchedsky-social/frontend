import { useState } from "react";
import {
  MapSearchResult,
  RenderableMapSearchResult,
  VisibleZone,
} from "../types";
import { LatLng, Map } from "leaflet";
import { GeoJSON } from "react-leaflet";
import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import SearchableMap from "../components/SearchableMap";

export default function FindMe() {
  const [visibleZones, setVisibleZones] = useState<VisibleZone[]>([]);
  const [selectedZones, setSelectedZones] = useState<VisibleZone[]>([]);

  const doTypeaheadSearch = async (
    prefix: string,
    map: Map | null
  ): Promise<RenderableMapSearchResult[]> => {
    let lng = "0";
    let lat = "0";
    if (map) {
      lng = `${map.getCenter().lng}`;
      lat = `${map.getCenter().lat}`;
    }
    const params = new URLSearchParams({
      prefix,
      lng,
      lat,
    });

    const response = await fetch(`/api/v1/typeahead?${params.toString()}`);
    const data = await response.json();

    return data.map((x: MapSearchResult) => new RenderableMapSearchResult(x));
  };

  const onLocationSelected = (
    val: RenderableMapSearchResult | null,
    map: Map | null
  ) => {
    if (val && map) {
      map.setView(
        new LatLng(
          val.result.centroid!.coordinates[1],
          val.result.centroid!.coordinates[0]
        ),
        9
      );
    }
  };

  const onMapChange = (map: Map) => {
    const se = map.getBounds().getSouthEast();
    const nw = map.getBounds().getNorthWest();

    const params = new URLSearchParams({
      boxse: `${se.lng},${se.lat}`,
      boxnw: `${nw.lng},${nw.lat}`,
    });

    fetch(`/api/v1/zones/visible?${params}`).then((response) => {
      response.json().then(setVisibleZones);
    });
  };

  const handleToggle = (v: VisibleZone) => () => {
    const currentIndex = selectedZones.indexOf(v);
    const newSelectedZones = [...selectedZones];

    if (currentIndex === -1) {
      newSelectedZones.push(v);
    } else {
      newSelectedZones.splice(currentIndex, 1);
    }

    setSelectedZones(newSelectedZones);
  };

  return (
    <>
      <Typography component="h1">Find my Zones</Typography>
      <SearchableMap
        getRemoteResults={doTypeaheadSearch}
        onSearchValueChange={onLocationSelected}
        onMapChange={onMapChange}
      >
        {visibleZones.map((z: VisibleZone) => (
          <GeoJSON data={z.border} />
        ))}
      </SearchableMap>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {visibleZones.map((z: VisibleZone) => (
          <ListItem key={z.id} disablePadding>
            <ListItemButton role={undefined} onClick={handleToggle(z)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedZones.indexOf(z) !== -1}
                  disableRipple
                  inputProps={{ "aria-labelledby": `${z.id}-select` }}
                />
              </ListItemIcon>
              <ListItemText id={`${z.id}-select`} primary={z.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
