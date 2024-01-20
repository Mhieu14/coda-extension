import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";

export const settingsDataSchema = z.object({
  token: z
    .string()
    .min(1, "API token must not be empty")
    .max(64, "API token must contain at most 64 characters"),
});

export type SettingsData = z.infer<typeof settingsDataSchema>;

interface SettingsContextValue {
  settings?: SettingsData;
  isFetched: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
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
        Object.keys(settingsDataSchema.shape),
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
