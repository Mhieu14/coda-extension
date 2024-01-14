import { ChakraProvider } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

import { Popup } from "./Popup";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <Popup />
    </ChakraProvider>
  </React.StrictMode>,
);
