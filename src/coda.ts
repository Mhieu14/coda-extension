import { z } from "zod";

import type {
  CreateSubpageRequest,
  DeletePageRequest,
  Page,
  UpdatePageRequest,
} from "./schemas.ts";

const BASE_URL = "https://coda.io/apis/v1";

export class CodaSDK {
  private readonly headers: Record<string, string>;

  constructor(token: string) {
    this.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  resolveBrowserLink = async (
    url: string,
  ): Promise<Omit<Page, "tabId"> | ResolveBrowserLinkError> => {
    console.log(`Resolving ${url}`);

    // Remove hash and query params
    const strippedUrl = url.split(/[?#]/)[0];

    const hostName = new URL(strippedUrl).hostname;
    if (hostName !== "coda.io") {
      return {
        message: "The extension only works in a Coda page tab.",
      };
    }

    const params = new URLSearchParams({
      url: strippedUrl,
      degradeGracefully: "true",
    }).toString();

    const response = await fetch(`${BASE_URL}/resolveBrowserLink?${params}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      const payload = (await response.json()) as ResolveBrowserLinkErrorPayload;
      return {
        message: payload?.message ?? "Request error.",
      };
    }

    const {
      resource: { id, name, href },
    } = resolveBrowserLinkSchema.parse(await response.json());

    const match = href.match(/\/docs\/([^/]+)\//);
    if (match === null) {
      return {
        message: "Invalid response from Coda API.",
      };
    }

    const docId = match[1];

    return {
      id,
      name,
      docId,
    };
  };

  createSubpage = async ({
    docId,
    parentPageId,
    name,
    icon,
  }: CreateSubpageRequest) => {
    const body = JSON.stringify({
      name,
      iconName: icon?.name,
      parentPageId,
    });

    const response = await fetch(`${BASE_URL}/docs/${docId}/pages`, {
      method: "POST",
      headers: this.headers,
      body,
    });

    if (!response.ok) {
      throw new Error("Request error");
    }
  };

  updatePage = async ({ docId, pageId, name, icon }: UpdatePageRequest) => {
    const body = JSON.stringify({
      name,
      iconName: icon?.name,
    });

    const response = await fetch(`${BASE_URL}/docs/${docId}/pages/${pageId}`, {
      method: "PUT",
      headers: this.headers,
      body,
    });

    if (!response.ok) {
      throw new Error("Request error");
    }
  };

  deletePage = async ({ docId, pageId }: DeletePageRequest) => {
    const response = await fetch(`${BASE_URL}/docs/${docId}/pages/${pageId}`, {
      method: "DELETE",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error("Request error");
    }
  };
}

export const resolveBrowserLinkSchema = z.object({
  resource: z.object({
    type: z.literal("page"),
    id: z.string(),
    name: z.string(),
    href: z.string().url(),
  }),
});

interface ResolveBrowserLinkError {
  message: string;
}

interface ResolveBrowserLinkErrorPayload {
  message?: string;
}
