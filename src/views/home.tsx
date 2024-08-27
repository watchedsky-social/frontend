import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import ProductHero from "../components/ProductHero";

export default function Home() {
  return (
    <>
      <ProductHero />
      <Container>
        <Typography paragraph gutterBottom variant="h4">What is Watchedsky?</Typography>
        <Typography color="lightgray" variant="body1" paragraph gutterBottom>
          A common complaint I've heard from folks who want to move completely
          to Bluesky from{" "}
          <span style={{ textDecorationLine: "line-through" }}>Twitter</span>𝕏
          is that they can't because they use it for severe weather alerts.
        </Typography>
        <Typography color="lightgray" variant="body1" paragraph gutterBottom>
          We all know how hard it is to effect change in a giant bureaucracy
          like the US Federal Government, even without certain people&nbsp;
          <a href="https://www.verifythis.com/article/news/verify/project-2025-verify/project-2025-proposes-dismantling-national-oceanic-and-atmospheric-association-noaa/536-2bd4bc29-1454-4305-9036-e026e665dbf6">
            trying to make it worse.
          </a>
          &nbsp; In the spirit of that, I decided to use the following facts to
          my advantage:
          <List
            sx={{
              listStyleType: "disc",
              pl: 2,
              "& .MuiListItem-root": {
                display: "list-item",
              },
            }}
          >
            <ListItem disableGutters>
              <ListItemText>
                The National Weather Service has a publicly consumable&nbsp;
                <a href="https://www.weather.gov/documentation/services-web-api">
                  API
                </a>
                &nbsp;to read Severe Weather Alerts as they come in
              </ListItemText>
            </ListItem>
            <ListItem disableGutters>
              <ListItemText>
                Bluesky has explicitly developed the idea of&nbsp;
                <a href="https://docs.bsky.app/docs/starter-templates/custom-feeds">
                  Custom Feed Algorithms
                </a>
              </ListItemText>
            </ListItem>
            <ListItem disableGutters>
              <ListItemText>
                I like to build software, from time to time (objective)
              </ListItemText>
            </ListItem>
            <ListItem disableGutters>
              <ListItemText>
                I'm even good at it every once in a while (subjective)
              </ListItemText>
            </ListItem>
          </List>
        </Typography>
        <Typography color="lightgray" variant="body1" paragraph gutterBottom>
          To get started, <Link to="/app/findme">find the areas</Link> of the
          country you want to be alerted on. Once you do that, you will be
          presented a code that you need to paste <em>somewhere</em> in your
          profile. The Bluesky feed generator gets a record of who you are when
          you request data from it, and it will use that profile data to look up
          alerts relevant to your area.
        </Typography>
        <Typography variant="h4" sx={{ paddingTop: 6 }}>
          Need help?
        </Typography>
        <Typography color="lightgray" variant="body1" paragraph gutterBottom>
          You can try a number of different methods:
          <List
            sx={{
              listStyleType: "disc",
              pl: 2,
              "& .MuiListItem-root": {
                display: "list-item",
              },
            }}
          >
            <ListItem disableGutters>
              <ListItemText>
                The official Watchedsky&nbsp;
                <a href="https://bsky.app/profile/did:plc:hvjfuy2w6zqu6abmpkwcpulc">
                  Bluesky Account
                </a>
              </ListItemText>
            </ListItem>
            <ListItem disableGutters>
              <ListItemText>
                My&nbsp;
                <a href="https://bsky.app/profile/did:plc:e2fun4xcfwtcrqfdwhfnghxk">
                  Bluesky Account (DMs open!)
                </a>
              </ListItemText>
            </ListItem>
            <ListItem disableGutters>
              <ListItemText>
                I also am reachable by email and lurk in various and sundry
                Slack channels. Use one of the above methods to get access to
                these if you need them.
              </ListItemText>
            </ListItem>
          </List>
        </Typography>
      </Container>
      <Box sx={{height: "60px"}}/>
    </>
  );
}
