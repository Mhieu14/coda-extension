import { extendTheme } from "@chakra-ui/react";

import { Request, Response, SettingsData, settingsDataSchema } from "./schemas";

export const theme = extendTheme({
  styles: {
    global: {
      "*": {
        fontSize: "md",
      },
    },
  },
});

export const fetchSettings = async (): Promise<SettingsData | null> => {
  const rawData = await chrome.storage.local.get(
    Object.keys(settingsDataSchema.shape),
  );
  const safeParseResult = settingsDataSchema.safeParse(rawData);
  if (!safeParseResult.success) {
    return null;
  }

  return safeParseResult.data;
};

export const sendMessage = async <R extends Request>(
  request: R,
): Promise<Response<R>> => {
  return await chrome.runtime.sendMessage(request);
};
