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
  HStack,
  Box,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash, FaTrash, FaPlus } from "react-icons/fa";

import { getRootPageUrl } from "@/common.ts";

import {
  SettingsData,
  settingsDataSchema,
  useSettings,
} from "@/contexts/settings.tsx";

export const Settings = () => {
  const { settings, isFetched } = useSettings();

  const [showDefaultToken, setShowDefaultToken] = useBoolean();
  const [showCustomTokens, setShowCustomTokens] = useState<boolean[]>([]);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isDirty, isSubmitted },
  } = useForm<SettingsData>({
    resolver: zodResolver(settingsDataSchema),
    defaultValues: {
      token: "",
      customTokens: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customTokens",
  });

  useEffect(() => {
    if (isFetched && settings) {
      reset(settings);

      // Initialize showCustomTokens when settings are fetched
      if (settings.customTokens?.length) {
        setShowCustomTokens(settings.customTokens.map(() => false));
      }
    }
  }, [isFetched, reset, settings, setShowCustomTokens]);

  const toast = useToast();

  const onSubmit = async (values: SettingsData) => {
    const transformedValues = {
      ...values,
      customTokens:
        values.customTokens?.map((custom) => ({
          ...custom,
          docUrl: getRootPageUrl(custom.docUrl) || custom.docUrl,
        })) || [],
    };
    await chrome.storage.local.set(transformedValues);

    toast({
      title: "Settings Saved",
      description: "Your API token settings have been updated.",
      status: "success",
      duration: 2000,
      position: "top-right",
    });

    reset(values);

    // Reload the page content to reflect the transformed settings
    window.location.reload();
  };

  return (
    <Container maxW="container.md" py={8}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={6} align="stretch">
          <Heading>Extension Settings</Heading>

          {!settings && !isSubmitted && (
            <Alert status="warning">
              <AlertIcon />
              Please configure before using the extension
            </Alert>
          )}

          {/* Default Token */}
          <FormControl isInvalid={!!errors.token}>
            <Heading size="md" mb={4}>
              Default API Key
            </Heading>
            <InputGroup>
              <Input
                {...register("token")}
                type={showDefaultToken ? "text" : "password"}
                placeholder="Enter your default API Key"
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  aria-label={showDefaultToken ? "Hide token" : "Show token"}
                  icon={showDefaultToken ? <FaRegEyeSlash /> : <FaRegEye />}
                  onClick={setShowDefaultToken.toggle}
                />
              </InputRightElement>
            </InputGroup>
            {errors.token && (
              <FormErrorMessage>{errors.token.message}</FormErrorMessage>
            )}
          </FormControl>

          {/* Custom Tokens */}
          <Box>
            <HStack justifyContent="space-between" mb={4}>
              <Heading size="md">Custom Document Keys</Heading>
              <Button
                leftIcon={<FaPlus />}
                onClick={() => {
                  setShowCustomTokens((prev) => [...prev, false]);
                  append({ docUrl: "", token: "" });
                }}
                colorScheme="blue"
                variant="outline"
              >
                Add Custom Key
              </Button>
            </HStack>

            {fields.map((field, index) => (
              <VStack
                key={field.id}
                spacing={4}
                align="stretch"
                borderWidth={1}
                p={4}
                borderRadius="md"
                mb={4}
              >
                <FormControl isInvalid={!!errors.customTokens?.[index]?.docUrl}>
                  <FormLabel>
                    Document URL (Any page URL within the document)
                  </FormLabel>
                  <Input
                    {...register(`customTokens.${index}.docUrl`)}
                    placeholder="https://example.com/docs"
                  />
                  {errors.customTokens?.[index]?.docUrl && (
                    <FormErrorMessage>
                      {errors.customTokens[index]?.docUrl?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.customTokens?.[index]?.token}>
                  <FormLabel>Document API Key</FormLabel>
                  <InputGroup>
                    <Input
                      {...register(`customTokens.${index}.token`)}
                      type={showCustomTokens[index] ? "text" : "password"}
                      placeholder="Enter document API Key"
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        aria-label={
                          showCustomTokens[index] ? "Hide token" : "Show token"
                        }
                        icon={
                          showCustomTokens[index] ? (
                            <FaRegEyeSlash />
                          ) : (
                            <FaRegEye />
                          )
                        }
                        onClick={() =>
                          setShowCustomTokens((prev) =>
                            prev.map((value, i) =>
                              i === index ? !value : value
                            )
                          )
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.customTokens?.[index]?.token && (
                    <FormErrorMessage>
                      {errors.customTokens[index]?.token?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <Button
                  leftIcon={<FaTrash />}
                  onClick={() => {
                    setShowCustomTokens((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                    remove(index);
                  }}
                  colorScheme="red"
                  variant="outline"
                  alignSelf="flex-start"
                  mb={4}
                >
                  Remove Custom Key
                </Button>
              </VStack>
            ))}
          </Box>

          <Button type="submit" colorScheme="green" isDisabled={!isDirty}>
            Save Settings
          </Button>
        </VStack>
      </form>
    </Container>
  );
};
