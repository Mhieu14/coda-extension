import { Divider, VStack } from "@chakra-ui/react";

import { Actions } from "./Actions.tsx";
import { PageInfo } from "./PageInfo.tsx";

export const Main = () => {
  return (
    <VStack spacing={2} width="100%" alignItems="flex-start">
      <PageInfo />
      <Divider />
      <Actions />
    </VStack>
  );
};
