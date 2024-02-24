import { z } from "zod";

import { CodaSDK } from "./coda.ts";
import {
  CreateSubpageRequest,
  DeletePageRequest,
  ErrorResponse,
  iconSchema,
  Request,
  RequestType,
  Response,
  ResponseType,
  SearchIconsRequest,
  UpdatePageRequest,
} from "./schemas.ts";

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
  type _Response = Response<R>;

  switch (request.type) {
    case RequestType.CREATE_SUBPAGE:
      return (await handleCreateSubpageRequest(request)) as _Response;

    case RequestType.UPDATE_PAGE:
      return (await handleUpdatePageRequest(request)) as _Response;

    case RequestType.DELETE_PAGE:
      return (await handleDeletePageRequest(request)) as _Response;

    case RequestType.SEARCH_ICONS:
      return (await handleSearchIconsRequest(request)) as _Response;
  }
};

type RequestHandler<R extends Request> = (request: R) => Promise<Response<R>>;

const handleCreateSubpageRequest: RequestHandler<CreateSubpageRequest> = async (
  request,
) => {
  const codaSdk = new CodaSDK(request.token);

  await codaSdk.createSubpage(request);

  return {
    type: ResponseType.SUCCESS,
  };
};

const handleUpdatePageRequest: RequestHandler<UpdatePageRequest> = async (
  request,
) => {
  const codaSdk = new CodaSDK(request.token);

  await codaSdk.updatePage(request);

  return {
    type: ResponseType.SUCCESS,
  };
};

const handleDeletePageRequest: RequestHandler<DeletePageRequest> = async (
  request,
) => {
  const codaSdk = new CodaSDK(request.token);

  await codaSdk.deletePage(request);

  return {
    type: ResponseType.SUCCESS,
  };
};

const handleSearchIconsRequest: RequestHandler<SearchIconsRequest> = async (
  request,
) => {
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
