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

import { sendMessage } from "@/common.ts";
import { usePage } from "@/contexts/page.tsx";
import { useSettings, getTokenForUrl } from "@/contexts/settings.tsx";
import {
  CreateSubpageRequest,
  iconSchema,
  RequestType,
  ResponseType,
} from "@/schemas.ts";

import { SearchIcons } from "./SearchIcons.tsx";

const createSubpageDataSchema = z.object({
  name: z
    .string()
    .min(1, "Page name must not be empty")
    .max(256, "Page name must contain at most 256 characters"),

  icon: iconSchema
    .nullable()
    .optional()
    .transform((icon) => icon || undefined),
});

type CreateSubpageData = z.infer<typeof createSubpageDataSchema>;

export const CreateSubpage = () => {
  const { page } = usePage();
  const { settings } = useSettings();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CreateSubpageData>({
    resolver: zodResolver(createSubpageDataSchema),
  });

  const toast = useToast();

  const onSubmit = async (values: CreateSubpageData) => {
    if (!page || !settings) {
      return;
    }

    const response = await sendMessage<CreateSubpageRequest>(page.tabId, {
      type: RequestType.CREATE_SUBPAGE,
      token: getTokenForUrl(settings, page.url),
      docId: page.docId,
      parentPageId: page.id,
      ...values,
    });

    if (response.type === ResponseType.SUCCESS) {
      toast({
        title: "Created",
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
        <FormControl
          isInvalid={Boolean(errors.name)}
          isRequired={!createSubpageDataSchema.shape.name.isOptional()}
        >
          <FormLabel>Page name</FormLabel>

          <Input autoFocus autoComplete="off" {...register("name")} />

          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <SearchIcons<CreateSubpageData>
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
