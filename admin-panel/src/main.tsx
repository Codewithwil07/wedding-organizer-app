import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications"; // <-- Notifikasi
import App from "./App";

// Import SEMUA CSS Wajib
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 1. Provider Mantine (buat UI) */}
    <MantineProvider defaultColorScheme="dark">
      <BrowserRouter>
        {/* 2. Provider Notifikasi (buat popup) */}
        <Notifications position="top-right" />
        {/* 3. App Utama Lo */}
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
