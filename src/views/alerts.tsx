import { useEffect, useMemo, useState } from "react";
import { RecentAlert, shortHeadline } from "../components/alerts";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";
import { truncateDescription, relativeTime } from "../components/alerts";

export type AlertsProps = {
  pageSize?: number;
};

const defaultAlertProps: AlertsProps = {
  pageSize: 25,
};

export function Alerts(props: AlertsProps = defaultAlertProps) {
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
  const [pageSize, setPageSize] = useState(props.pageSize ?? 25);

  const getAlerts = useMemo(
    () => () => {
      fetch(`/api/v1/alerts/recent?lim=${pageSize}`).then((response) => {
        if (response.ok) {
          response.json().then(setRecentAlerts);
        }
      });
    },
    [pageSize]
  );

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRecentAlerts([]);
    setPageSize(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    getAlerts();
    const refreshInterval = setInterval(getAlerts, 300000);
    return () => clearInterval(refreshInterval);
  }, [getAlerts]);

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
            rowsPerPage={pageSize}
            count={recentAlerts.length}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onPageChange={() => {}}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
}
