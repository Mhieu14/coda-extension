import {
  Button,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiChevronDown, FiEdit3, FiPlusSquare } from "react-icons/fi";

import { CreateSubpage } from "./CreateSubpage.tsx";
import { UpdatePage } from "./UpdatePage.tsx";

type Action = "create" | "update";

export const Actions = () => {
  const [action, setAction] = useState<Action>("create");

  return (
    <VStack spacing={2} width="100%" alignItems="stretch">
      <HStack>
        <Heading as="h2" fontSize="2xl">
          {action === "create" && "Create subpage"}
          {action === "update" && "Update page"}
        </Heading>

        <Spacer />

        <Menu autoSelect={false}>
          <MenuButton as={Button} rightIcon={<FiChevronDown />}>
            Actions
          </MenuButton>

          <MenuList>
            <MenuItem
              icon={<FiPlusSquare />}
              onClick={() => setAction("create")}
            >
              Create subpage
            </MenuItem>

            <MenuItem icon={<FiEdit3 />} onClick={() => setAction("update")}>
              Update page
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {action === "create" && <CreateSubpage />}
      {action === "update" && <UpdatePage />}
    </VStack>
  );
};
