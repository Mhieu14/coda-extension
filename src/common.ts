import { extendTheme } from "@chakra-ui/react";

import { Request, Response } from "./schemas";

export const theme = extendTheme({
  styles: {
    global: {
      "*": {
        fontSize: "md",
      },
    },
  },
});

export const sendMessage = async <R extends Request>(
  tabId: number,
  request: R,
): Promise<Response<R>> => {
  return await chrome.tabs.sendMessage(tabId, request);
};
