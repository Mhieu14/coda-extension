import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { sendMessage } from "../../common.ts";
import { usePage } from "../../contexts/page.tsx";
import { useSettings } from "../../contexts/settings.tsx";
import {
  iconSchema,
  RequestType,
  ResponseType,
  UpdatePageRequest,
} from "../../schemas";
import { SearchIcons } from "./SearchIcons.tsx";

const updatePageDataSchema = z
  .object({
    name: z
      .string()
      .max(256, "Page name must contain at most 256 characters")
      .optional()
      .transform((name) => name || undefined),

    icon: iconSchema
      .nullable()
      .optional()
      .transform((icon) => icon || undefined),
  })
  .refine(({ name, icon }) => name !== undefined || icon !== undefined, {
    message: "At least one field must be provided",
  });

type UpdatePageData = z.infer<typeof updatePageDataSchema>;

export const UpdatePage = () => {
  const { page } = usePage();
  const { settings } = useSettings();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<UpdatePageData>({
    resolver: zodResolver(updatePageDataSchema),
  });

  const toast = useToast();

  const onSubmit = async (values: UpdatePageData) => {
    if (!page || !settings) {
      return;
    }

    const response = await sendMessage<UpdatePageRequest>(page.tabId, {
      type: RequestType.UPDATE_PAGE,
      token: settings.token,
      docId: page.docId,
      pageId: page.id,
      ...values,
    });

    if (response.type === ResponseType.SUCCESS) {
      toast({
        title: "Updated",
        status: "success",
        duration: 2000,
        position: "top-right",
      });
    } else {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 2000,
        position: "top-right",
      });
    }

    reset(values);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="flex-start" spacing={4}>
        <FormControl isInvalid={Boolean(errors.name)}>
          <FormLabel>Page name</FormLabel>

          <Input autoComplete="off" {...register("name")} />

          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <SearchIcons<UpdatePageData>
          name="icon"
          control={control}
          placeholder="Type to search for icons"
        />

        <Button
          colorScheme="teal"
          type="submit"
          isDisabled={!isDirty}
          isLoading={isSubmitting}
          alignSelf="flex-end"
        >
          Submit
        </Button>
      </VStack>
    </form>
  );
};
