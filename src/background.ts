import { CodaSDK } from "./coda.ts";
import { fetchSettings } from "./common.ts";
import {
  ErrorResponse,
  Request,
  RequestType,
  Response,
  ResponseType,
} from "./schemas.ts";

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed");
  console.log(details);
});

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
): Promise<Response<R>> => {
  const settings = await fetchSettings();
  if (!settings) {
    throw new Error("Settings are not properly configured");
  }

  const codaSdk = new CodaSDK(settings.token);

  if (request.type === RequestType.GET_CURRENT_PAGE) {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    const tab = tabs[0];
    if (tab?.url === undefined) {
      throw new Error("Cannot get the currently active tab");
    }

    const tabUrl = tab.url;

    const page = await codaSdk.resolveBrowserLink(tabUrl);
    if (!page) {
      return {
        type: ResponseType.ERROR,
        message:
          "Cannot fetch page data from the current tab. Is it a Coda page?",
      };
    }

    return {
      type: ResponseType.PAGE,
      page,
    } as Response<typeof request>;
  }

  throw new Error(`Invalid request: ${JSON.stringify(request)}`);
};
