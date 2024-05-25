import React from "react";
import ReactDOM from "react-dom/client";
import Option from "./Option.tsx";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider>
      <Option />
    </MantineProvider>
  </React.StrictMode>,
);
