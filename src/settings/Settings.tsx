import {
  Alert,
  AlertIcon,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useBoolean,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import {
  SettingsData,
  settingsDataSchema,
  useSettings,
} from "@/contexts/settings.tsx";

export const Settings = () => {
  const { settings, isFetched } = useSettings();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty, isSubmitted },
  } = useForm<SettingsData>({
    resolver: zodResolver(settingsDataSchema),
  });

  useEffect(() => {
    if (isFetched && settings) {
      reset(settings);
    }
  }, [isFetched, reset, settings]);

  const toast = useToast();

  const onSubmit = async (values: SettingsData) => {
    await chrome.storage.local.set(values);

    toast({
      title: "Saved",
      status: "success",
      duration: 2000,
      position: "top-right",
    });

    reset(values);
  };

  const [show, setShow] = useBoolean(false);

  if (!isFetched) {
    return null;
  }

  return (
    <Container width="md" padding={4}>
      <VStack alignItems="stretch" spacing={4}>
        <Heading as="h1">Settings</Heading>

        {!settings && !isSubmitted && (
          <Alert status="warning">
            <AlertIcon />
            Please configure before using the extension
          </Alert>
        )}

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack alignItems="flex-start" spacing={4}>
            <FormControl
              isInvalid={Boolean(errors.token)}
              isRequired={!settingsDataSchema.shape.token.isOptional()}
            >
              <FormLabel fontSize="lg">API token</FormLabel>

              <InputGroup>
                <Input
                  autoComplete="off"
                  type={show ? "text" : "password"}
                  {...register("token")}
                />

                <InputRightElement>
                  <IconButton
                    icon={show ? <FaRegEyeSlash /> : <FaRegEye />}
                    isRound
                    variant="ghost"
                    size="sm"
                    aria-label={show ? "Hide API token" : "Show API token"}
                    onClick={setShow.toggle}
                  />
                </InputRightElement>
              </InputGroup>

              <FormErrorMessage>{errors.token?.message}</FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="teal"
              type="submit"
              isDisabled={!isDirty}
              alignSelf="flex-end"
            >
              Submit
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};
