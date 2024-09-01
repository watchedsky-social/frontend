import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useLoaderData } from "react-router-dom";
import {
  Alert,
  allProps,
  DataRow,
  DisplayableAlertProperties,
  shortHeadline,
} from "../components/alerts";
import { AlertMap } from "../components/map/AlertMap";

export function AlertDetail() {
  const alert = useLoaderData() as Alert;

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid xs={12}>&nbsp;</Grid>
        <Grid xs={8}>
          <Typography variant="h4">{shortHeadline(alert)}</Typography>
        </Grid>
        <Grid xs={4}>
          <AlertMap alert={alert} />
        </Grid>
        <Grid xs={3}>
          <Typography variant="th">Description</Typography>
        </Grid>
        <Grid xs={9}>
          <Typography variant="code">{alert.description}</Typography>
        </Grid>
        {alert &&
          allProps.map((property: DisplayableAlertProperties) => (
            <DataRow
              alert={alert}
              property={property}
              key={`display-${property}`}
            />
          ))}
      </Grid>
    </Container>
  );
}
