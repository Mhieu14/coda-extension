import { z } from "zod";

export const settingsDataSchema = z.object({
  token: z
    .string()
    .min(1, "API token must not be empty")
    .max(64, "API token must contain at most 64 characters"),
});

export type SettingsData = z.infer<typeof settingsDataSchema>;

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
