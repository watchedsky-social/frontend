import { ListItem, ListItemText, Typography } from "@mui/material";
import { Map } from "leaflet";
import { HTMLAttributes, ReactNode } from "react";
import { MapContainerProps } from "react-leaflet";

export type Point = {
  latitude: number;
  longitude: number;
};

export interface MapSearchResult {
  name: string;
  county: string;
  state: string;
  centroid?: number[];
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type toElementProps = HTMLAttributes<HTMLLIElement> & { key: any; };

export interface Renderable {
  toString: () => string;
  toElement: (props: toElementProps) => ReactNode;
}

export class RenderableMapSearchResult implements Renderable {
  constructor(public readonly result: MapSearchResult) {}

  public toString(): string {
    return `${this.result.name}, ${this.result.state}`;
  }

  public toElement(props: toElementProps): ReactNode {
    const { key, ...optionProps } = props;
    return <li key={key} {...optionProps}>{this.toString()}</li>;
  }
}

export type SearchableMapAPIProps<Value> = {
  getRemoteResults: (prefix: string) => Value[] | Promise<Value[]>;
  onSearchValueChange: (value: Value | null, map: Map | null) => void;
  onMapChange: (map: Map) => void;
};

export type SearchableMapProps<Value> = MapContainerProps &
  SearchableMapAPIProps<Value> & {
    id?: string;
    children: JSX.Element[];
  };

  export interface ForecastZone {
    id: string;
    name: string;
    type: string;
    state: string;
    border: GeoJSON.GeoJSON;
  }

  export interface ForecastZoneProps extends ForecastZone {
    selected?: boolean;
    active?: boolean;
  }

  export const ErrorListItems: Record<"none" | "toomany", JSX.Element> = {
    "none": (<ListItem disablePadding><ListItemText><Typography variant="caption">No forecast zones are visible. Search again or move the map or zoom out. Watchedsky only has data for the US at this time.</Typography></ListItemText></ListItem>),
    "toomany": (<ListItem disablePadding><ListItemText><Typography variant="caption">Too many forecast zones are visible in this map. Search again or move the map or zoom in.</Typography></ListItemText></ListItem>),
  }
