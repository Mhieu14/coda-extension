import { Center, Container, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { fetchSettings, sendMessage } from "../common";
import { PageProvider } from "../context.tsx";
import {
  GetCurrentPageRequest,
  Page,
  RequestType,
  ResponseType,
} from "../schemas";
import { Actions } from "./Actions";

export const Popup = () => {
  const [isReady, setIsReady] = useState(false);
  const [isPageFetched, setIsPageFetched] = useState(false);

  const [page, setPage] = useState<Page | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const validateSettings = async () => {
      const settings = await fetchSettings();
      if (!settings) {
        chrome.runtime.openOptionsPage();
        window.close();
      }

      setIsReady(true);
    };

    validateSettings().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchPage = async () => {
      if (!isReady) {
        return;
      }

      const settings = await fetchSettings();
      if (!settings) {
        return;
      }

      const response = await sendMessage<GetCurrentPageRequest>({
        type: RequestType.GET_CURRENT_PAGE,
      });

      setIsPageFetched(true);

      if (response.type === ResponseType.ERROR) {
        setErrorMessage(response.message);
        return;
      }

      setPage(response.page);
    };

    fetchPage().catch(console.error);
  }, [isReady]);

  const getChildren = () => {
    if (!isReady) {
      return null;
    }

    if (!isPageFetched) {
      return (
        <Center flexGrow={1}>
          <VStack spacing={4}>
            <Text>Fetching page data</Text>
            <Spinner size="xl" />
          </VStack>
        </Center>
      );
    }

    if (page) {
      return (
        <PageProvider page={page}>
          <Actions />
        </PageProvider>
      );
    }

    if (errorMessage) {
      return (
        <Center flexGrow={1}>
          <Text width="75%" align="center">
            {errorMessage}
          </Text>
        </Center>
      );
    }

    return null;
  };

  return (
    <Container
      width="sm"
      minH={40}
      paddingX={3}
      paddingY={2}
      centerContent
      justifyContent="stretch"
    >
      {getChildren()}
    </Container>
  );
};
