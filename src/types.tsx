import { Map } from "leaflet";
import { HTMLAttributes, ReactNode } from "react";
import { MapContainerProps } from "react-leaflet";

export type Point = {
  latitude: number;
  longitude: number;
};

export type VisibleZone = {
  id: string;
  name: string;
  type: string;
  state: string;
  border: GeoJSON.GeoJSON;
};

export interface MapSearchResult {
  name: string;
  county: string;
  state: string;
  centroid?: GeoJSON.Point;
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
  getRemoteResults: (prefix: string, map: Map | null) => Value[] | Promise<Value[]>;
  onSearchValueChange: (value: Value | null, map: Map | null) => void;
  onMapChange: (map: Map) => void;
};

export type SearchableMapProps<Value> = MapContainerProps &
  SearchableMapAPIProps<Value> & {
    id?: string;
    children: JSX.Element[];
  };
