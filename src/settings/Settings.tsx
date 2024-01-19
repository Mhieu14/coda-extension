import {
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
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { fetchSettings } from "../common.ts";
import { SettingsData, settingsDataSchema } from "../schemas.ts";

const fetchData = async (): Promise<SettingsData> => {
  const settings = await fetchSettings();
  if (!settings) {
    return {
      token: "",
    };
  }

  return settings;
};

export const Settings = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsData>({
    defaultValues: fetchData,
    resolver: zodResolver(settingsDataSchema),
  });

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

  return (
    <Container width="md" padding={4}>
      <VStack alignItems="stretch" spacing={4}>
        <Heading as="h1">Settings</Heading>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack alignItems="flex-start" spacing={4}>
            <FormControl isInvalid={Boolean(errors.token)}>
              <FormLabel htmlFor="token" fontSize="lg">
                API token
              </FormLabel>

              <InputGroup>
                <Input
                  id="token"
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
