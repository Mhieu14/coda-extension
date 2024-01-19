import { Heading, HStack, Text } from "@chakra-ui/react";

import { usePage } from "../context.tsx";

export const PageInfo = () => {
  const { page } = usePage();

  return (
    <HStack width="100%">
      <Heading as="h3" fontSize="md" flexShrink={0}>
        Page name:
      </Heading>
      <Text noOfLines={1}>{page.name}</Text>
    </HStack>
  );
};
