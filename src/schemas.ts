import { z } from "zod";

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
  CREATE_SUBPAGE = "CREATE_SUBPAGE",
  UPDATE_PAGE = "UPDATE_PAGE",
  SEARCH_ICONS = "SEARCH_ICONS",
}

export enum ResponseType {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  ICONS = "ICONS",
}

export interface ErrorResponse {
  type: ResponseType.ERROR;
  message: string;
}

export interface CreateSubpageRequest {
  type: RequestType.CREATE_SUBPAGE;
  token: string;
  name: string;
  icon?: Icon | null;
  docId: string;
  parentPageId: string;
}

export interface CreateSubpageResponse {
  type: ResponseType.SUCCESS;
}

export interface UpdatePageRequest {
  type: RequestType.UPDATE_PAGE;
  token: string;
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
  | CreateSubpageRequest
  | UpdatePageRequest
  | SearchIconsRequest;

export type Response<R extends Request> =
  | ErrorResponse
  | (R extends CreateSubpageRequest
      ? CreateSubpageResponse
      : R extends UpdatePageRequest
        ? UpdatePageResponse
        : R extends SearchIconsRequest
          ? SearchIconsResponse
          : null);
