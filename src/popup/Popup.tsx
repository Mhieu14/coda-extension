import {
  Container,
  Heading,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { BsFillGearFill } from "react-icons/bs";

import { Settings } from "./Settings.tsx";

export const Popup = () => {
  return (
    <Container width="sm" paddingX={0}>
      <Tabs isFitted variant="enclosed-colored" defaultIndex={1}>
        <TabList mb="1em">
          <Tab>One</Tab>
          <Tab>
            <VStack>
              <Icon as={BsFillGearFill} boxSize={6} />
              <Heading as="h1" size="md">
                Settings
              </Heading>
            </VStack>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <Settings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};
