import { Card, CardContent, CardHeader, Tooltip, Typography } from "@mui/material";
import { RecentAlert } from "./models";
import { relativeTime, shortHeadline, truncateDescription } from "./fns";
import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Info } from "@mui/icons-material";

export function AlertCard(props: { alert: RecentAlert }) {
  const { alert } = props;

  return (
    <Link sx={{textDecoration: "none"}} component={RouterLink} to={`/app/alerts/${alert.id}`} target="_blank" >
      <Card sx={{height: "100%", opacity: 0.7}}>
        <CardHeader
          titleTypographyProps={{ variant: "subtitle2" }}
          title={shortHeadline(alert)}
          subheader={relativeTime(alert)}
          subheaderTypographyProps={{
            variant: "caption",
            sx: { fontStyle: "italic" },
          }}
          avatar={<Tooltip title={`Areas Affected: ${alert.area_desc}`}><Info /></Tooltip>}
          sx={{ paddingBottom: "2px" }}
        />
        <CardContent sx={{ paddingTop: "2px" }}>
          <Typography variant="caption" color="text.secondary">
            {truncateDescription(alert)}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
