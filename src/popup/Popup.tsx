import {
  Container,
  Heading,
  HStack,
  Icon,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
} from "@chakra-ui/react";
import { FiEdit3, FiPlusSquare, FiSettings } from "react-icons/fi";

const TABS = [
  {
    icon: FiPlusSquare,
    name: "Add page",
    panel: Container,
  },
  {
    icon: FiEdit3,
    name: "Edit page",
    panel: Container,
  },
];

export const Popup = () => {
  return (
    <Container width="md" paddingX={0}>
      <Tabs isFitted variant="enclosed-colored">
        <TabList mb="1em">
          {TABS.map(({ icon, name }) => (
            <Tab key={name}>
              <HStack>
                <Icon as={icon} />
                <Heading as="h1" size="md">
                  {name}
                </Heading>
              </HStack>
            </Tab>
          ))}
          <Tooltip hasArrow label="Open settings page" margin={1}>
            <IconButton
              icon={<FiSettings />}
              isRound
              variant="ghost"
              aria-label="Settings"
              onClick={() => chrome.runtime.openOptionsPage()}
            />
          </Tooltip>
        </TabList>
        <TabPanels>
          {TABS.map((tab) => (
            <TabPanel key={tab.name}>
              <tab.panel />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
};
