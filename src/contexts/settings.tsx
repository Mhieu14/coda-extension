import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";
import { getRootPageUrl } from "@/common.ts";

export const settingsDataSchema = z.object({
  token: z
    .string()
    .min(1, "Default API token must not be empty")
    .max(64, "Default API token must contain at most 64 characters"),
  customTokens: z
    .array(
      z.object({
        docUrl: z.string().url("Must be a valid URL"),
        token: z
          .string()
          .min(1, "Custom API token must not be empty")
          .max(64, "Custom API token must contain at most 64 characters"),
      })
    )
    .optional()
    .default([]),
});

export type SettingsData = z.infer<typeof settingsDataSchema>;

interface SettingsContextValue {
  settings?: SettingsData;
  isFetched: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [isFetched, setIsFetched] = useState(false);
  const [settings, setSettings] = useState<SettingsData | undefined>();

  useEffect(() => {
    const fetchSettings = async () => {
      const rawData = await chrome.storage.local.get(
        Object.keys(settingsDataSchema.shape)
      );
      const safeParseResult = settingsDataSchema.safeParse(rawData);

      setIsFetched(true);

      if (!safeParseResult.success) {
        return;
      }

      setSettings(safeParseResult.data);
    };

    fetchSettings().catch(console.error);
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isFetched,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("Missing SettingsProvider");
  }

  return context;
};

export const getTokenForUrl = (settings: SettingsData, url: string): string => {
  console.log("Calling getTokenForUrl:", settings, url);
  if (!settings || !url) return settings.token;

  const rootPageUrl = getRootPageUrl(url);
  if (!rootPageUrl) return settings.token;

  console.log("Root page URL:", rootPageUrl);

  // First, check if there's a custom token for the exact URL
  const customToken = settings.customTokens?.find(
    (custom) => new URL(custom.docUrl).origin === new URL(rootPageUrl).origin
  );
  console.log("Found custom token:", customToken);

  // If custom token found, return it
  if (customToken) return customToken.token;

  // Otherwise, return the default token
  return settings.token;
};
