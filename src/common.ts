import { extendTheme } from "@chakra-ui/react";

import { Request, Response } from "./schemas.ts";

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
  request: R
): Promise<Response<R>> => {
  return await chrome.tabs.sendMessage(tabId, request);
};

export const getRootPageUrl = (url: string) => {
  // Parse URL components using URL constructor
  // Example: converts "https://coda.io/d/document-name_Random-Doc-String/page-name_Random-Page-String"
  // to "https://coda.io/d/document-name_Random-Doc-String"
  try {
    const parsedUrl = new URL(url);
    // Use a regular expression to extract the root URL part, capturing only the base path up to the unique document identifier.
    // This stops at the first occurrence of any subdirectory or section (like "document-name_Random-Doc-String") that comes after "/d/".
    const regex = /^(.+?\/d\/[^\/]+)/;
    const match = parsedUrl.href.match(regex);
    if (match) {
      return match[1];
    }
    // If no match is found, return null or an empty string
    return null;
  } catch (error) {
    console.error("Invalid URL provided:", error);
    return null;
  }
};
