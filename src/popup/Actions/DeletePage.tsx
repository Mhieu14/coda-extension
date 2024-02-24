import {
  Button,
  FormLabel,
  useBoolean,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import { sendMessage } from "../../common.ts";
import { usePage } from "../../contexts/page.tsx";
import { useSettings } from "../../contexts/settings.tsx";
import { DeletePageRequest, RequestType, ResponseType } from "../../schemas.ts";

export const DeletePage = () => {
  const { page } = usePage();
  const { settings } = useSettings();
  const [shouldShowConfirmation, setShouldShowConfirmation] = useBoolean(false);

  const {
    handleSubmit,
    formState: { isSubmitting, submitCount },
  } = useForm();

  const toast = useToast();

  const onSubmit = async () => {
    if (!page || !settings) {
      return;
    }

    if (!shouldShowConfirmation) {
      setShouldShowConfirmation.on();
      return;
    }

    const response = await sendMessage<DeletePageRequest>(page.tabId, {
      type: RequestType.DELETE_PAGE,
      token: settings.token,
      docId: page.docId,
      pageId: page.id,
    });

    if (response.type === ResponseType.SUCCESS) {
      toast({
        title: "Deleted",
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
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="flex-start" spacing={4} marginTop={4}>
        <FormLabel>
          {shouldShowConfirmation
            ? "Are you sure you want to delete?"
            : "Delete this page?"}
        </FormLabel>

        <motion.div
          layout
          transition={{
            type: "spring",
            duration: 0.25,
          }}
          style={{
            alignSelf: shouldShowConfirmation ? "flex-start" : "flex-end",
          }}
        >
          <Button
            colorScheme="red"
            type="submit"
            isDisabled={submitCount >= 2}
            isLoading={isSubmitting}
          >
            {shouldShowConfirmation ? "Confirm" : "Delete"}
          </Button>
        </motion.div>
      </VStack>
    </form>
  );
};
