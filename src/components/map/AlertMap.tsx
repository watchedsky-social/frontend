import { LatLngBounds, Map } from "leaflet";
import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { Alert } from "../alerts";
import { getBounds } from "./bounds";

export function AlertMap(props: { alert: Alert }) {
  const [layer, setLayer] = useState<JSX.Element | null>(null);
  const [viewport, setViewport] = useState<LatLngBounds | undefined>(undefined);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (props.alert.border) {
      setLayer(
        <GeoJSON
          data={props.alert.border}
          key={props.alert.id}
          style={{ color: "red" }}
        />
      );

      const bounds = getBounds(props.alert.border);
      const paddedBounds = bounds.pad(0.25);

      setViewport(paddedBounds);
    }
  }, [props]);

  return (
    viewport && (
      <MapContainer
        bounds={viewport}
        center={viewport.getCenter()}
        ref={setMap}
        zoom={map?.getBoundsZoom(viewport)}
        style={{ width: 320, height: 240 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {layer && layer}
      </MapContainer>
    )
  );
}
