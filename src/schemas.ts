import { z } from "zod";

export const settingsDataSchema = z.object({
  token: z
    .string()
    .min(1, "API token must not be empty")
    .max(64, "API token must contain at most 64 characters"),
});

export type SettingsData = z.infer<typeof settingsDataSchema>;

export const pageSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const resolveBrowserLinkResponseSchema = z.object({
  resource: z
    .object({
      type: z.literal("page"),
    })
    .extend(pageSchema.shape),
});

export type Page = z.infer<typeof pageSchema>;

// Message passing

export enum RequestType {
  GET_CURRENT_PAGE,
}

export enum ResponseType {
  ERROR,
  PAGE,
}

export interface GetCurrentPageRequest {
  type: RequestType.GET_CURRENT_PAGE;
}

export interface GetCurrentPageResponse {
  type: ResponseType.PAGE;
  page: Page;
}

export interface ErrorResponse {
  type: ResponseType.ERROR;
  message: string;
}

export type Request = GetCurrentPageRequest;

export type Response<R extends Request> =
  | ErrorResponse
  | (R extends GetCurrentPageRequest ? GetCurrentPageResponse : never);
