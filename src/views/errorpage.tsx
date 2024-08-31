import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Collapse,
  CssBaseline,
  Typography,
} from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Header from "../components/Header";
import ProductHeroLayout from "../components/ProductHeroLayout";
import heroImage from "../assets/hero.jpg";
import { useState } from "react";

const errorMap: Map<number, string> = new Map<number, string>([
  [
    404,
    "You were looking for something that's not here (anymore)! Alerts are only kept around for two weeks.",
  ],
  [405, "You're not allowed to do that. Whatcha thinkin there bud?"],
  [500, "We screwed up."],
  [502, "The backend is NOT happy right now."],
  [503, "The backend is REALLY not happy right now."],
]);

const defaultErrorMessage =
  "SOMETHING went wrong. Not quite sure what. Hopefully the error message here helps figure that out.";

export function ErrorPage() {
  const error = useRouteError();
  let message = defaultErrorMessage;
  if (isRouteErrorResponse(error)) {
    if (errorMap.has(error.status)) {
      message = errorMap.get(error.status) ?? "";
    }
  }

  const [cardOpen, setCardOpen] = useState(false);

  return (
    <>
      <CssBaseline />
      <Header />
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
          paragraph
          gutterBottom
          fontFamily="monospace"
          letterSpacing="0.3rem"
          fontWeight={700}
        >
          Aw, beans.
        </Typography>
        <Typography
          color="inherit"
          align="center"
          variant="body1"
          paragraph
          gutterBottom
          fontWeight={500}
        >
          {message}
        </Typography>
        <Card sx={{ maxWidth: 350 }}>
          <CardActionArea onClick={() => setCardOpen((prev) => !prev)}>
            <CardHeader>
              {error instanceof Error ? error.message : error}
            </CardHeader>
            <Collapse in={cardOpen}>
              <CardContent>
                {error instanceof Error && (
                  <Typography variant="code" component="pre">
                    {error.stack}
                  </Typography>
                )}
              </CardContent>
            </Collapse>
          </CardActionArea>
        </Card>
      </ProductHeroLayout>
    </>
  );
}
