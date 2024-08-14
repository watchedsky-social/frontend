export type RecentAlert = {
  id: string;
  headline: string;
  description: string;
  sent: number;
};

export type Alert = Omit<RecentAlert, "sent"> & {
  area_desc: string;
  severity?: string;
  certainty?: string;
  event?: string;
  sent: string;
  effective: string;
  onset?: string;
  expires?: string;
  ends?: string;
  reference_ids?: string[];
  border?: GeoJSON.Geometry;
};

export const displayNames: Record<DisplayableAlertProperties, string> = {
  area_desc: "Area Description",
  severity: "Severity",
  certainty: "Certainty",
  event: "Event",
  sent: "Sent",
  effective: "Effective",
  onset: "Onset",
  expires: "Expires",
  ends: "Ends",
};

export type DisplayableAlertProperties = keyof Alert &
  Exclude<
    keyof Alert,
    "border" | "reference_ids" | "id" | "headline" | "description"
  >;

export type DataRowProps = {
  alert: Alert;
  property: DisplayableAlertProperties;
};

export const timeProps = ["sent", "effective", "onset", "expires", "ends"];
export const allProps: DisplayableAlertProperties[] = [
  "area_desc",
  "severity",
  "certainty",
  "event",
  "sent",
  "effective",
  "onset",
  "expires",
  "ends",
];
