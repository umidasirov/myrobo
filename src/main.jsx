import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import root from "./router/index.jsx";
import { DataProvider } from "./datacontect/index.jsx";
createRoot(document.getElementById("root")).render(
    <DataProvider>
      <HelmetProvider>
        <RouterProvider router={root} />
      </HelmetProvider>
    </DataProvider>
);
