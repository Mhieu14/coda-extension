import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { theme } from "../common.ts";
import { Settings } from "./Settings.tsx";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Settings />
    </ChakraProvider>
  </React.StrictMode>,
);
