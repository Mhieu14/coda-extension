import { createContext, ReactNode, useContext } from "react";

import { Page } from "./schemas";

interface PageContextValue {
  page: Page;
}

const PageContext = createContext<PageContextValue | undefined>(undefined);

interface PageProviderProps {
  page: Page;
  children: ReactNode;
}

export const PageProvider = ({ page, children }: PageProviderProps) => {
  return (
    <PageContext.Provider
      value={{
        page,
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
