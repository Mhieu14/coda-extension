import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { AsyncSelect, Props as SelectProps } from "chakra-react-select";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";

import { usePage } from "../../contexts/page.tsx";
import {
  Icon,
  RequestType,
  Response,
  ResponseType,
  SearchIconsRequest,
} from "../../schemas.ts";
import { FormatIcon } from "./FormatIcon.tsx";

interface SearchIconsProps<FormValues extends FieldValues = FieldValues>
  extends Omit<SelectProps<Icon>, "name" | "defaultValue">,
    UseControllerProps<FormValues> {}

const searchIcons = async (tabId: number, term: string): Promise<Icon[]> => {
  const response: Response<SearchIconsRequest> = await chrome.tabs.sendMessage(
    tabId,
    {
      type: RequestType.SEARCH_ICONS,
      term,
    },
  );

  if (response.type === ResponseType.ERROR) {
    throw new Error(response.message);
  }

  return response.icons;
};

export const SearchIcons = <FormValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  shouldUnregister,
  ...selectProps
}: SearchIconsProps<FormValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController<FormValues>({
    name,
    control,
    rules,
    shouldUnregister,
  });

  const { page } = usePage();

  return (
    <FormControl isInvalid={!!error} id={name}>
      <FormLabel>Icon</FormLabel>

      <AsyncSelect
        loadOptions={(term) => searchIcons(page.tabId, term)}
        isMulti={false}
        isClearable
        cacheOptions
        {...selectProps}
        {...field}
        formatOptionLabel={(icon) => <FormatIcon icon={icon} />}
        getOptionValue={(icon) => icon.name}
      />

      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};
