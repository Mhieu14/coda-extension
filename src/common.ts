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
  request: R,
): Promise<Response<R>> => {
  return await chrome.tabs.sendMessage(tabId, request);
};

export const getRootPageUrl = (url: string) => {
  // URL constructor is used to easily parse the URL components
  // Example URL: https://coda.io/d/Filum-Task-Management_dwiwr75F9kd/Releases_suPXJ-wx#_lu4J7HAD
  try {
    const parsedUrl = new URL(url);
    // Use a regular expression to extract the root URL part, capturing only the base path up to the unique document identifier.
    // This stops at the first occurrence of any subdirectory or section (like "Releases_suPXJ-wx") that comes after "/d/<document_id>".
    const regex = /^(.+?\/d\/[^\/]+)/;
    const match = parsedUrl.href.match(regex);
    if (match) {
      return match[1];
    }
    // If no match is found, return null or an empty string
    return null;
  } catch (error) {
    console.error('Invalid URL provided:', error);
    return null;
  }
}