import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { theme } from "@/common.ts";
import { PageProvider } from "@/contexts/page.tsx";
import { SettingsProvider } from "@/contexts/settings.tsx";

import { Popup } from "./Popup";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <SettingsProvider>
        <PageProvider>
          <Popup />
        </PageProvider>
      </SettingsProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
