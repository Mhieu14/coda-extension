import { z } from "zod";

import {
  ErrorResponse,
  iconSchema,
  Request,
  RequestType,
  Response,
  ResponseType,
  SearchIconsRequest,
} from "./schemas";

chrome.runtime.onMessage.addListener((request: Request, _, sendResponse) => {
  handleRequest(request)
    .then(sendResponse)
    .catch((error: Error) => handleError(error, sendResponse));

  // Important! Return true to indicate we want to send a response asynchronously
  return true;
});

const handleError = (
  error: Error,
  sendResponse: (response: ErrorResponse) => void,
) => {
  console.error(error);

  sendResponse({
    type: ResponseType.ERROR,
    message: error.message,
  });
};

const handleRequest = async <R extends Request>(
  request: R,
): Promise<Response<SearchIconsRequest>> => {
  if (request.type !== RequestType.SEARCH_ICONS) {
    throw new Error(
      `Content script does not handle request type of ${request.type}`,
    );
  }

  const term = request.term;

  const params = new URLSearchParams({
    term,
    limit: "10",
  }).toString();

  const response = await fetch(`https://coda.io/api/icons?${params}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Request error");
  }

  const { icons } = searchIconsResultSchema.parse(await response.json());

  return {
    type: ResponseType.ICONS,
    icons: icons,
  };
};

const searchIconsResultSchema = z.object({
  icons: z.array(iconSchema),
});
