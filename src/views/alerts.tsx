import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Link, useLoaderData } from "react-router-dom";
import {
  RecentAlert,
  relativeTime,
  shortHeadline,
  truncateDescription,
} from "../components/alerts";

export type AlertsProps = {
  pageSize?: number;
};

export function Alerts() {
  const recentAlerts = useLoaderData() as RecentAlert[];

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Alert</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Sent</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {recentAlerts.map((alert: RecentAlert) => (
          <TableRow>
            <TableCell>
              <Link to={`/app/alerts/${alert.id}`}>{shortHeadline(alert)}</Link>
            </TableCell>
            <TableCell>{truncateDescription(alert)}</TableCell>
            <TableCell>{relativeTime(alert)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            colSpan={3}
            rowsPerPageOptions={[10, 25, 50, 100]}
            slotProps={{
              select: {
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              },
            }}
            page={1}
            rowsPerPage={25}
            count={recentAlerts.length}
            onPageChange={() => {}}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
}
