import { Geometry, Position } from "geojson";
import { latLng, LatLng, LatLngBounds, latLngBounds } from "leaflet";

export function getBounds(geo: Geometry): LatLngBounds {
  const polyBounds: LatLngBounds[] = [];

  if (!geo) {
    return latLngBounds(latLng(0, 0), latLng(0, 0));
  }

  switch (geo.type) {
    case "Polygon":
      return getPolygonBounds(geo.coordinates);
    case "MultiPolygon":
      polyBounds.push(...geo.coordinates.map((poly) => getPolygonBounds(poly)));

      return mergeBounds(polyBounds);
    case "GeometryCollection":
      polyBounds.push(...geo.geometries.map((g) => getBounds(g)));

      return mergeBounds(polyBounds);
    default:
      throw new Error("unsupported GeoJSON type");
  }
}

const getPolygonBounds = (poly: Position[][]): LatLngBounds => {
  let minLng = 180;
  let maxLng = -180;
  let minLat = 90;
  let maxLat = -90;

  for (const line of poly) {
    for (const point of line) {
      const lng = point[0];
      const lat = point[1];

      if (lng < minLng) {
        minLng = lng;
      }

      if (lng > maxLng) {
        maxLng = lng;
      }

      if (lat < minLat) {
        minLat = lat;
      }

      if (lat > maxLat) {
        maxLat = lat;
      }
    }
  }

  return latLngBounds(latLng(minLat, minLng), latLng(maxLat, maxLng));
};

const mergeBounds = (bounds: LatLngBounds[]): LatLngBounds => {
  const southWests: LatLng[] = bounds.map((bound: LatLngBounds) => {
    return bound.getSouthWest();
  });

  const northEasts: LatLng[] = bounds.map((bound) => {
    return bound.getNorthEast();
  });

  const minLat = southWests.reduce(
    (currentMin: number, currentPoint: LatLng) => {
      return currentPoint.lat < currentMin ? currentPoint.lat : currentMin;
    },
    180
  );

  const minLng = southWests.reduce(
    (currentMin: number, currentPoint: LatLng) => {
      return currentPoint.lng < currentMin ? currentPoint.lng : currentMin;
    },
    180
  );

  const maxLat = northEasts.reduce(
    (currentMax: number, currentPoint: LatLng) => {
      return currentPoint.lat > currentMax ? currentPoint.lat : currentMax;
    },
    -180
  );

  const maxLng = northEasts.reduce(
    (currentMax: number, currentPoint: LatLng) => {
      return currentPoint.lng > currentMax ? currentPoint.lng : currentMax;
    },
    -180
  );

  return latLngBounds(latLng(minLat, minLng), latLng(maxLat, maxLng));
};
