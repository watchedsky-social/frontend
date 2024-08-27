import ProductHeroLayout from "../components/ProductHeroLayout";
import heroImage from "../assets/hero.jpg";
import { Container, Typography } from "@mui/material";
import versionInfo from "../version.json";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Box } from "@mui/system";

export function AboutPage() {
  return (
    <>
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
          About Watchedsky
        </Typography>
      </ProductHeroLayout>
      <Container>
        <Typography variant="h5" paragraph gutterBottom>
          Acknowledgements
        </Typography>
        <Typography variant="body1" color="lightgray" paragraph gutterBottom>
          Watchedsky uses APIs provided by the National Oceanic and Atmospheric
          Institute (NOAA), but is in no way associated with NOAA or the
          National Weather Service. I believe that this is just an important
          service and am using tools at my disposal to provide it.
        </Typography>
        <Typography variant="body1" color="lightgray" paragraph gutterBottom>
          The "hero" image on this and other pages is the intellectual property
          of NOAA/NSSL/S. Waugh, &copy; 2009, and is made available via its{" "}
          <a href="https://www.nssl.noaa.gov/disclaimer.php" target="_blank">
            Intellectual Property Notice
          </a>
          .
        </Typography>
        <Typography variant="body1" color="lightgray" paragraph gutterBottom>
          I'd personally like to thank{" "}
          <a href="https://jtarchie.com">JT Archie</a>{" "}
          for putting up with many questions about Javascript, Golang, and GIS
          development throughout this project. JT is the best.
        </Typography>
        <Typography variant="body1" color="lightgray" paragraph gutterBottom>
          Additionally, the entire ATmosphere on Bluesky has been critical to
          the launch of this project. They really do have the juice.
        </Typography>
      </Container>
      <Container>
        <Typography variant="h5" paragraph gutterBottom>
          Tech Stuff
        </Typography>
        <Typography variant="body1" color="lightgray" paragraph gutterBottom>
          Watchedsky is &copy; 2024 Josh Ghiloni. The source code is available
          at{" "}
          <a href="https://github.com/watchedsky-social" target="_blank">
            github.com
          </a>
          , under{" "}
          <a
            href="https://www.gnu.org/licenses/agpl-3.0.en.html"
            target="_blank"
          >
            The GNU Affero General Public License, version 3
          </a>
        </Typography>
        <Typography variant="body1" color="lightgray" paragraph gutterBottom>
          You can see historical information about Watchedsky's deployments at
          its{" "}
          <a href="https://concourse-ci.org" target="_blank">
            Concourse CI
          </a>{" "}
          instance{" "}
          <a href="https://ci.watchedsky.social" target="_blank">
            here.
          </a>
        </Typography>
      </Container>
      <Container>
        <Typography variant="h5" paragraph gutterBottom>
          Build Information
        </Typography>
        <Grid2 container>
          <Grid2 xs={3}>Version:</Grid2>
          <Grid2 xs={9}>{versionInfo.version}</Grid2>
          <Grid2 xs={3}>Frontend Build ID:</Grid2>
          <Grid2 xs={9}>{versionInfo.build_id}</Grid2>
        </Grid2>
        <Box sx={{ height: "60px" }}></Box>
      </Container>
    </>
  );
}
