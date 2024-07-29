import { LatLng } from "leaflet";
import { MapSearchResult } from "../types";

export default class APIService {
  private constructor() {}

  public static Instance(): APIService {
    return new APIService();
  }

  public async search(
    prefix: string,
    center: LatLng
  ): Promise<MapSearchResult[]> {
    const query = new URLSearchParams({
      prefix: prefix,
      lat: `${center.lat}`,
      lon: `${center.lng}`,
    });

    const response = await fetch(`/api/v1/typeahead?${query.toString()}`);
    if (!response.ok) {
      return [{ name: "Could not load search results", county: "", state: "" }];
    }

    const json = await response.json();
    return json as MapSearchResult[];
  }
}
