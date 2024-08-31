import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, ThemeProvider } from "@mui/material";
import "leaflet/dist/leaflet.css";
import "./main.css";
import { AboutPage } from "./views/about";
import { AlertDetail } from "./views/alertdetail";
import { Alerts } from "./views/alerts";
import { ErrorPage } from "./views/errorpage";
import FindMe from "./views/findme";
import Home from "./views/home";
import Root from "./views/root";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    code: React.CSSProperties;
    th: React.CSSProperties;
    placeholder: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    code?: React.CSSProperties;
    th?: React.CSSProperties;
    placeholder?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    code: true;
    th: true;
    placeholder: true;
  }
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    ...{
      background: {
        default: "#0A0B0F",
      },
    },
  },
  typography: {
    code: {
      fontFamily: "monospace",
    },
    th: {
      fontWeight: 900,
    },
    placeholder: {
      fontStyle: "italic",
      color: "GrayText",
    }
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          code: "pre",
          th: "span",
          placeholder: "span",
        },
      },
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/app",
        children: [
          {
            path: "findme",
            element: <FindMe />,
          },
          {
            path: "alerts",
            element: <Alerts />,
            loader: async () => {
              const response = await fetch(`/api/v1/alerts/recent?lim=25`);
              if (response.status !== 200) {
                throw new Response(response.statusText, { status: response.status });
              }
              return response.json();
            }
          },
          {
            path: "alerts/:id",
            element: <AlertDetail />,
            loader: async ({ params }) => {
              const response = await fetch(`/api/v1/alerts/${params.id}`);
              if (response.status !== 200) {
                throw new Response(response.statusText, { status: response.status });
              }
              return response.json();
            }
          },
          {
            path: "about",
            element: <AboutPage />
          }
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
