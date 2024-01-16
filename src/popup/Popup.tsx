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
  useBoolean,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FiEdit3, FiPlusSquare, FiSettings } from "react-icons/fi";

import { fetchSettings } from "../common.ts";

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

const openSettings = () => chrome.runtime.openOptionsPage();

export const Popup = () => {
  const [isReady, setIsReady] = useBoolean(false);

  useEffect(() => {
    const validateSettings = async () => {
      const settings = await fetchSettings();
      if (settings === null) {
        openSettings();
        window.close();
      }

      setIsReady.on();
    };

    validateSettings().catch(console.error);
  }, [setIsReady]);

  return isReady ? (
    <Container width="sm" paddingX={0}>
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
              onClick={openSettings}
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
  ) : null;
};
