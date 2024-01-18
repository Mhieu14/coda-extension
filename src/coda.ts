import { Page, resolveBrowserLinkResponseSchema } from "./schemas.ts";

const BASE_URL = "https://coda.io/apis/v1";

export class CodaSDK {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  resolveBrowserLink = async (url: string): Promise<Page | null> => {
    // Remove hash and query params
    const strippedUrl = url.split(/[?#]/)[0];

    const response = await fetch(
      `${BASE_URL}/resolveBrowserLink?url=${strippedUrl}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );

    if (!response.ok) {
      console.error(response);
      return null;
    }

    const parsedResponse = resolveBrowserLinkResponseSchema.parse(
      await response.json(),
    );
    return parsedResponse.resource;
  };
}
