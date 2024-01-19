import {
  CreateSubpageRequest,
  Page,
  resolveBrowserLinkResponseSchema,
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

  resolveBrowserLink = async (url: string): Promise<Page | null> => {
    console.info(`Resolving ${url}`);

    // Remove hash and query params
    const strippedUrl = url.split(/[?#]/)[0];

    const hostName = new URL(strippedUrl).hostname;
    if (hostName !== "coda.io") {
      return null;
    }

    const response = await fetch(
      `${BASE_URL}/resolveBrowserLink?url=${strippedUrl}`,
      {
        method: "GET",
        headers: this.headers,
      },
    );

    if (!response.ok) {
      console.error(response);
      return null;
    }

    const {
      resource: { id, name, href },
    } = resolveBrowserLinkResponseSchema.parse(await response.json());

    const match = href.match(/\/docs\/(\w+)\//);
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
  }: CreateSubpageRequest) => {
    const body = JSON.stringify({
      name,
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
}
