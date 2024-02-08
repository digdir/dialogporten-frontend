import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import "./i18n/";

import App from "./App.tsx";
async function enableMocking() {
  if (import.meta.env.MODE === "development") {
    const { worker } = await import("./mocks/browser");
    return worker.start();
  }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
const queryClient = new QueryClient();

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
