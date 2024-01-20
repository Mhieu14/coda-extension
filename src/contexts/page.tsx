import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { CodaSDK } from "../coda.ts";
import { Page } from "../schemas.ts";
import { useSettings } from "./settings.tsx";

interface PageContextValue {
  page?: Page;
  isFetched: boolean;
}

const PageContext = createContext<PageContextValue | undefined>(undefined);

interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider = ({ children }: PageProviderProps) => {
  const { settings, isFetched: isSettingsFetched } = useSettings();
  const [isFetched, setIsFetched] = useState(false);
  const [page, setPage] = useState<Page>();

  useEffect(() => {
    const fetchPage = async () => {
      if (!isSettingsFetched) {
        return;
      }

      if (!settings) {
        chrome.runtime.openOptionsPage();
        window.close();
        return;
      }

      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const tab = tabs[0];
      if (tab?.url === undefined || tab?.id === undefined) {
        throw new Error("Cannot get the currently active tab");
      }

      const tabUrl = tab.url;
      const tabId = tab.id;

      const codaSdk = new CodaSDK(settings.token);
      const page = await codaSdk.resolveBrowserLink(tabUrl);

      setIsFetched(true);

      if (!page) {
        return;
      }

      setPage({
        ...page,
        tabId,
      });
    };

    fetchPage().catch(console.error);
  }, [isSettingsFetched, settings]);

  return (
    <PageContext.Provider
      value={{
        page,
        isFetched,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePage = (): PageContextValue => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("Missing PageProvider");
  }

  return context;
};
