import { z } from "zod";

export const settingsDataSchema = z.object({
  token: z
    .string()
    .min(1, "API token must not be empty")
    .max(64, "API token must contain at most 64 characters"),
});

export type SettingsData = z.infer<typeof settingsDataSchema>;

export const resolveBrowserLinkResponseSchema = z.object({
  resource: z.object({
    type: z.literal("page"),
    id: z.string(),
    name: z.string(),
    href: z.string().url(),
  }),
});

export interface Page {
  id: string;
  name: string;
  docId: string;
  tabId: number;
}

export const iconSchema = z.object({
  name: z.string(),
  label: z.string(),
});

export type Icon = z.infer<typeof iconSchema>;

// Message passing

export enum RequestType {
  GET_CURRENT_PAGE = "GET_CURRENT_PAGE",
  CREATE_SUBPAGE = "CREATE_SUBPAGE",
  UPDATE_PAGE = "UPDATE_PAGE",
  SEARCH_ICONS = "SEARCH_ICONS",
}

export enum ResponseType {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  PAGE = "PAGE",
  ICONS = "ICONS",
}

export interface ErrorResponse {
  type: ResponseType.ERROR;
  message: string;
}

export interface GetCurrentPageRequest {
  type: RequestType.GET_CURRENT_PAGE;
}

export interface GetCurrentPageResponse {
  type: ResponseType.PAGE;
  page: Page;
}

export interface CreateSubpageRequest {
  type: RequestType.CREATE_SUBPAGE;
  name: string;
  docId: string;
  parentPageId: string;
}

export interface CreateSubpageResponse {
  type: ResponseType.SUCCESS;
}

export interface UpdatePageRequest {
  type: RequestType.UPDATE_PAGE;
  name?: string;
  icon?: Icon | null;
  docId: string;
  pageId: string;
}

export interface UpdatePageResponse {
  type: ResponseType.SUCCESS;
}

export interface SearchIconsRequest {
  type: RequestType.SEARCH_ICONS;
  term: string;
}

export interface SearchIconsResponse {
  type: ResponseType.ICONS;
  icons: Icon[];
}

export type Request =
  | GetCurrentPageRequest
  | CreateSubpageRequest
  | UpdatePageRequest
  | SearchIconsRequest;

export type Response<R extends Request> =
  | ErrorResponse
  | (R extends GetCurrentPageRequest
      ? GetCurrentPageResponse
      : R extends CreateSubpageRequest
        ? CreateSubpageResponse
        : R extends UpdatePageRequest
          ? UpdatePageResponse
          : R extends SearchIconsRequest
            ? SearchIconsResponse
            : null);
