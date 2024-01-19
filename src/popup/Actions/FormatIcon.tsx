import { HStack, Image, Text } from "@chakra-ui/react";

import { Icon } from "../../schemas.ts";

interface FormatIconProps {
  icon: Icon;
}

export const FormatIcon = ({ icon: { name, label } }: FormatIconProps) => {
  return (
    <HStack>
      <Image
        src={`https://cdn.coda.io/icons/svg/color/${name}.svg`}
        boxSize="24px"
        alt={label}
      />

      <Text>{label}</Text>
    </HStack>
  );
};
