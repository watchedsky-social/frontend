import { Button, Typography } from "@mui/material";
import ProductHeroLayout from "./ProductHeroLayout";
import heroImage from "../assets/hero.jpg";
import { useEffect, useMemo, useState } from "react";
import { RecentAlert } from "./alerts";
import { AlertCard } from "./alerts/AlertCard";
import Grid from "@mui/material/Unstable_Grid2";

export default function ProductHero() {
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
  const getAlerts = useMemo(
    () => () => {
      fetch(`/api/v1/alerts/recent?lim=12`).then((response) => {
        if (response.ok) {
          response.json().then(setRecentAlerts);
        }
      });
    },
    []
  );

  useEffect(() => {
    getAlerts();
    const refreshInterval = setInterval(getAlerts, 300000);
    return () => clearInterval(refreshInterval);
  }, [getAlerts]);

  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${heroImage})`,
        backgroundColor: "#7a686f", // Average color of the background image.
        backgroundPosition: "center",
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: "none" }}
        src={heroImage}
        alt="increase priority"
      />
      <Typography
        color="inherit"
        align="center"
        variant="h2"
        fontFamily="monospace"
        letterSpacing="0.3rem"
        fontWeight={700}
      >
        Watchedsky
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}
      >
        Severe Weather Alerts for the US on Bluesky
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        component="a"
        href="/app/findme"
        sx={{ minWidth: 200 }}
      >
        Customize My Alert Feed
      </Button>
      <Typography variant="h6" color="inherit" sx={{ mt: 2 }}>
        Recent Alerts
      </Typography>
      <Grid container spacing={1}>
        {recentAlerts.map((alert: RecentAlert) => (
          <Grid xs={3}>
            <AlertCard alert={alert} key={alert.id} />
          </Grid>
        ))}
      </Grid>
    </ProductHeroLayout>
  );
}
