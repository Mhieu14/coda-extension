import { z } from "zod";

import type { CreateSubpageRequest, Page, UpdatePageRequest } from "./schemas";

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
  ): Promise<Omit<Page, "tabId"> | null> => {
    console.log(`Resolving ${url}`);

    // Remove hash and query params
    const strippedUrl = url.split(/[?#]/)[0];

    const hostName = new URL(strippedUrl).hostname;
    if (hostName !== "coda.io") {
      return null;
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
      return null;
    }

    const {
      resource: { id, name, href },
    } = resolveBrowserLinkSchema.parse(await response.json());

    const match = href.match(/\/docs\/([^/]+)\//);
    if (match === null) {
      return null;
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
}

export const resolveBrowserLinkSchema = z.object({
  resource: z.object({
    type: z.literal("page"),
    id: z.string(),
    name: z.string(),
    href: z.string().url(),
  }),
});
