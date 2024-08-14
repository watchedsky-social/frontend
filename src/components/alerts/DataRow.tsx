import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { formatRFC7231, parse } from "date-fns";
import { useEffect, useState } from "react";
import { allProps, DataRowProps, displayNames, timeProps } from "./models";

console.log(allProps);

const valueOf = (props: DataRowProps): string | null => {
  const { alert, property } = props;

  if (!alert[property]) {
    return null;
  }

  if (timeProps.includes(property)) {
    const date = parse(alert[property], "yyyy-MM-dd'T'HH:mm:ssXXX", new Date());
    return formatRFC7231(date);
  }

  return alert[property];
};

export function DataRow(props: DataRowProps) {
  const [displayName, setDisplayName] = useState<string>("");
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (props.property in displayNames) {
      setDisplayName(displayNames[props.property]);
      setValue(valueOf(props));
    }
  }, [props]);

  return (
    <>
      <Grid xs={3}>
        <Typography variant="th">{displayName}</Typography>
      </Grid>
      <Grid xs={9}>
        <Typography variant={value ? "inherit" : "placeholder"}>
          {value ? value : "Unknown"}
        </Typography>
      </Grid>
    </>
  );
}
