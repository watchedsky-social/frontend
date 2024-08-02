import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { PathOptions } from "leaflet";
import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import Color from "../colors";
import { ForecastZoneProps } from "./types";

// eslint-disable-next-line react-refresh/only-export-components
export const shortForecastID = (id: string): string => {
  const idx = id.lastIndexOf("/");
  if (idx === id.length - 1) {
    return "";
  }

  return id.substring(idx + 1);
};

// const longID = (shortID: string): string => {
//   const typeID = shortID.charAt(2).toUpperCase();
//   const type = typeID === "C" ? "county" : "forecast";

//   return `https://api.weather.gov/zones/${type}/${shortID}`;
// }

export function ForecastZoneLayer(props: ForecastZoneProps) {
  const [pathOptions, setPathOptions] = useState<PathOptions>({
    color: Color.randomXTermColor().toHex(),
  });

  useEffect(() => {
    setPathOptions((currentValue: PathOptions) => {
      currentValue.fill = props.active;
      currentValue.stroke = props.selected;

      return currentValue;
    });
  }, [props.selected, props.active, pathOptions]);

  return (
    <GeoJSON
      key={`${shortForecastID(props.id)}-geojson`}
      data={props.border}
      style={pathOptions}
    />
  );
}

export function ForecastZoneListItem(
  props: ForecastZoneProps & {
    onZoneStateChange?: (newZone: ForecastZoneProps) => void;
  }
) {
  const id = `${shortForecastID(props.id)}-listitem`;

  const onItemHover = () => {
    if (props.onZoneStateChange) {
      props.onZoneStateChange({
        ...props,
        active: true,
      });
    }
  };

  const onItemLeave = () => {
    if (props.onZoneStateChange) {
      props.onZoneStateChange({
        ...props,
        active: false,
      });
    }
  };

  const onItemClick = () => {
    if (props.onZoneStateChange) {
      props.onZoneStateChange({
        ...props,
        selected: !props.selected,
      });
    }
  };

  return (
    <ListItem
      key={id}
      disablePadding
      onMouseOver={onItemHover}
      onMouseLeave={onItemLeave}
      onClick={onItemClick}
    >
      <ListItemButton role={undefined} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={props.selected}
            inputProps={{ "aria-labelledby": `${id}-name` }}
          />
        </ListItemIcon>
        <ListItemText id={`${id}-name`} primary={props.name} />
      </ListItemButton>
    </ListItem>
  );
}
