import { Chip } from "@mui/material";
import { GeoJSON } from "react-leaflet";
import { Color } from "../colors";
import { ForecastZoneProps } from "./types";

// eslint-disable-next-line react-refresh/only-export-components
export const shortForecastID = (id: string): string => {
  const idx = id.lastIndexOf("/");
  if (idx === id.length - 1) {
    return "";
  }

  return id.substring(idx + 1);
};

export function ForecastZoneLayer(props: ForecastZoneProps & { color?: Color }) {
  const color = props.color ?? Color.randomXTermColor();

  return <GeoJSON data={props.border} style={{ color: color.toHex() }} />;
}

type MutableZoneStateManager = {
  onZoneStateChange?: (newZone: ForecastZoneProps) => void | Promise<void>;
};

export function ForecastZoneChip(
  props: ForecastZoneProps & MutableZoneStateManager
) {
  const id = `${shortForecastID(props.id)}-chip`;

  const changeZoneState =
    (state: { active?: boolean; selected?: boolean }) => () => {
      if (props.onZoneStateChange) {
        props.onZoneStateChange({
          ...props,
          ...state,
        });
      }
    };

  const onItemHover = changeZoneState({ active: true });
  const onItemLeave = changeZoneState({ active: false });
  const onItemSelect = changeZoneState({ selected: true });
  const onItemDeselect = changeZoneState({ selected: false });

  return (
    <Chip
      label={`${props.name} County, ${props.state}`}
      key={id}
      variant={props.selected ? "filled" : "outlined"}
      onDelete={props.selected ? onItemDeselect : undefined}
      onClick={props.selected ? undefined : onItemSelect}
      onMouseOver={onItemHover}
      onMouseLeave={onItemLeave}
    />
  );
}
