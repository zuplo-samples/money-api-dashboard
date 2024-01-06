import { Icons } from "../../components/ui/icons";
import { useCreateAPIKeyModal } from "./create-key-modal";
import ApiKeyManager, {
  Consumer,
  DefaultApiKeyManagerProvider,
} from "@zuplo/react-api-key-manager";
import { useTheme } from "next-themes";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Props {
  apiUrl: string;
  accessToken: string;
}

export function KeyManagerCard({ apiUrl, accessToken }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [showIsLoading, setShowIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { theme } = useTheme();

  const { CreateAPIKeyModal, setShowCreateAPIKeyModal } =
    useCreateAPIKeyModal();

  const provider = useMemo(() => {
    return new DefaultApiKeyManagerProvider(apiUrl, accessToken);
  }, [apiUrl, accessToken]);

  const createConsumer = useCallback(
    async (description: string) => {
      try {
        setIsCreating(true);

        const response = await fetch(`${apiUrl}/consumers/my`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            description,
          }),
        });

        if (response.status !== 200) {
          const text = await response.text();
          setErrorMessage(text);
        }

        provider.refresh();
      } catch (e) {
        console.error(e);
        setErrorMessage(
          "An error occurred while creating the API key. Check the console for more details."
        );
      } finally {
        setIsCreating(false);
        setShowCreateAPIKeyModal(false);
      }
    },
    [provider]
  );

  const deleteConsumer = useCallback(
    async (consumerName: string) => {
      try {
        setShowIsLoading(true);
        await provider.deleteConsumer(consumerName);
        provider.refresh();
      } catch (err) {
        console.error(err);
        setErrorMessage(
          "An error occurred while deleting the API key. Check the console for more details."
        );
      } finally {
        setShowIsLoading(false);
      }
    },
    [provider]
  );

  const menuItems = useMemo(() => {
    return [
      {
        label: "Delete",
        action: async (consumer: Consumer) => {
          await deleteConsumer(consumer.name);
        },
      },
    ];
  }, [deleteConsumer]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your API keys</CardTitle>
      </CardHeader>
      {errorMessage && (
        <div className="relative overflow-auto bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
          {/* add clear button */}
          <Button
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={() => setErrorMessage(null)}
          >
            Close X
          </Button>
          <p className="font-bold">Error</p>
          <p className="mt-2">{errorMessage}</p>
        </div>
      )}
      <CardContent>
        <ApiKeyManager
          provider={provider}
          menuItems={menuItems}
          showIsLoading={showIsLoading}
          theme={theme === "dark" ? "dark" : "light"}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          disabled={isCreating}
          onClick={() => setShowCreateAPIKeyModal(true)}
          variant={isCreating ? "disabled" : "default"}
        >
          {isCreating ? (
            <>
              <Icons.loadingSpinner />
              Creating...
            </>
          ) : (
            <>
              <CreateAPIKeyModal createConsumer={createConsumer} />
              <>Create new API Key</>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
