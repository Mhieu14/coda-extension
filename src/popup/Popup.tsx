import { Center, Container, Spinner, Text, VStack } from "@chakra-ui/react";

import { usePage } from "../contexts/page.tsx";
import { Actions } from "./Actions";

export const Popup = () => {
  const { error, isFetched } = usePage();

  const getChildren = () => {
    if (!isFetched) {
      return (
        <Center flexGrow={1}>
          <VStack spacing={4}>
            <Text>Fetching page data</Text>
            <Spinner size="xl" />
          </VStack>
        </Center>
      );
    }

    if (error) {
      return (
        <Center flexGrow={1}>
          <Text width="75%" align="center">
            {`Cannot fetch page data from the current tab. ${error.message}`}
          </Text>
        </Center>
      );
    }

    return <Actions />;
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
