import {
  Button,
  Heading,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { ReactElement, useState } from "react";
import { FiChevronDown, FiEdit3, FiPlusSquare, FiTrash2 } from "react-icons/fi";

import { CreateSubpage } from "./CreateSubpage.tsx";
import { DeletePage } from "./DeletePage.tsx";
import { UpdatePage } from "./UpdatePage.tsx";

type Action = "create" | "update" | "delete";

interface MenuItemData {
  icon: ReactElement;
  action: Action;
  label: string;
}

const MENU_ITEMS: MenuItemData[] = [
  {
    icon: <FiPlusSquare />,
    action: "create",
    label: "Create subpage",
  },
  {
    icon: <FiEdit3 />,
    action: "update",
    label: "Update page",
  },
  {
    icon: <Icon as={FiTrash2} color="red.500" />,
    action: "delete",
    label: "Delete page",
  },
];

export const Actions = () => {
  const [action, setAction] = useState<Action>("create");

  return (
    <VStack spacing={2} width="100%" alignItems="stretch">
      <HStack>
        <Heading as="h2" fontSize="2xl">
          {action === "create" && "Create subpage"}
          {action === "update" && "Update page"}
          {action === "delete" && "Delete page"}
        </Heading>

        <Spacer />

        <Menu autoSelect={false} isLazy>
          <MenuButton as={Button} rightIcon={<FiChevronDown />}>
            Actions
          </MenuButton>

          <MenuList marginBottom={1} marginEnd={1}>
            {MENU_ITEMS.map(({ icon, action, label }) => (
              <MenuItem
                key={action}
                icon={icon}
                onClick={() => setAction(action)}
              >
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </HStack>

      {action === "create" && <CreateSubpage />}
      {action === "update" && <UpdatePage />}
      {action === "delete" && <DeletePage />}
    </VStack>
  );
};
