import { Autocomplete, debounce, TextField } from "@mui/material";
import { LatLng, Map } from "leaflet";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { MapContainer, TileLayer } from "react-leaflet";
import { Renderable, SearchableMapProps } from "./types";

const defaultCenter: LatLng = new LatLng(44.9, -103.77);
const defaultZoom: number = 4;

function SearchableMapSearchBox<Value extends Renderable>(
  props: SearchableMapProps<Value> & { map: Map | null }
) {
  const [value, setValue] = useState<Value | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly Value[]>([]);

  const { getRemoteResults, map, onSearchValueChange } = props;

  const fetch = useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly Value[]) => void
        ) => {
          Promise.resolve(getRemoteResults(request.input)).then(callback);
        },
        400
      ),
    [getRemoteResults]
  );

  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly Value[]) => {
      if (active) {
        setOptions(results ?? []);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <Autocomplete
          id={props.id ? `${props.id}-search` : undefined}
          sx={{ width: 200, backgroundColor: "rgba(40,40,40,0.5)" }}
          getOptionLabel={(o: Value) => o.toString()}
          filterOptions={(x) => x}
          options={options}
          autoComplete
          includeInputInList={false}
          filterSelectedOptions
          value={value}
          noOptionsText="Type at least 3 characters to search"
          onChange={(_: unknown, newValue: Value | null) => {
            setValue(newValue);
            onSearchValueChange(newValue, map);
          }}
          isOptionEqualToValue={(option: Value, value: Value) => {
            return option.toString() === value.toString()
          }}
          onInputChange={(_: unknown, iv: string) => {
            setInputValue(iv);
          }}
          renderInput={(params) => (
            <TextField {...params} />
          )}
          renderOption={(props, option) => option.toElement(props)}
        />
      </div>
    </div>
  );
}

export function SearchableMap<Value extends Renderable>(
  props: SearchableMapProps<Value>
) {
  const [map, setMap] = useState<Map | null>(null);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  let center = defaultCenter;
  let zoom = defaultZoom;

  if (isGeolocationAvailable && isGeolocationEnabled && coords) {
    center = new LatLng(coords!.latitude, coords!.longitude);

    zoom = 9;
  }

  const { onMapChange, children } = props;

  const mapCallback = useCallback(() => {
    if (!map) {
      return;
    }

    onMapChange(map);
  }, [onMapChange, map]);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.on("load", mapCallback);
    map.on("moveend", mapCallback);
    map.on("zoomend", mapCallback);
    return () => {
      map.off("moveend");
      map.off("zoomend");
    };
  }, [map, mapCallback]);

  return (
    <div>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        ref={setMap}
        style={{ width: "100%", height: "40vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchableMapSearchBox map={map} {...props} />
        {children}
      </MapContainer>
    </div>
  );
}
