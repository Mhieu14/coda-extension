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
}

// Message passing

export enum RequestType {
  GET_CURRENT_PAGE,
  CREATE_SUBPAGE,
}

export enum ResponseType {
  ERROR,
  SUCCESS,
  PAGE,
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

export type Request = GetCurrentPageRequest | CreateSubpageRequest;

export type Response<R extends Request> =
  | ErrorResponse
  | (R extends GetCurrentPageRequest
      ? GetCurrentPageResponse
      : R extends CreateSubpageRequest
        ? CreateSubpageResponse
        : null);
