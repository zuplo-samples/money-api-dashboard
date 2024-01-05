import { CodeSnippet } from "@/components/code-snippet";
import FullScreenLoading from "@/components/full-screen-loading";
import { KeyManager } from "@/components/key-manager/key-manager";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@/lib/hooks/use-user";
import { cn, getRequiredEnvVar, getURL } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useState } from "react";

export default function DashboardPage() {
  const { isLoading, isSubscribed, subscription, usage, auth0AccessToken } =
    useUser();
  const router = useRouter();
  const { theme } = useTheme();
  const zuploUrl = getRequiredEnvVar("NEXT_PUBLIC_API_URL");

  if (isLoading) {
    return <FullScreenLoading />;
  }

  if (!isSubscribed) {
    router.push("/");
    return <FullScreenLoading />;
  }

  if (!subscription || !usage || !auth0AccessToken) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-10">
      <h1 className="text-5xl font-extrabold tracking-tighter">
        To use the API, use the API Key manager below.
      </h1>
      <div className="w-full max-w-3xl space-y-10">
        <KeyManager apiUrl={zuploUrl + "/v1"} accessToken={auth0AccessToken} />
        <PlanCard
          subscription={subscription}
          usage={usage}
          auth0AccessToken={auth0AccessToken}
        />
        <Card
          className={cn(
            "flex flex-col rounded-md overflow-hidden border-1",
            theme === "dark" ? "border-black" : "border"
          )}
        >
          <h2
            className={cn(
              "p-3",
              theme === "dark"
                ? "text-white bg-[#4F566B] border-b-[#4F566B]"
                : "text-black bg-slate-50 border-b"
            )}
          >
            Try the API
          </h2>
          <div
            className={cn(
              "p-3 text-gray-700 space-y-3",
              theme === "dark" ? "text-white bg-[#2A2F45]" : "text-black"
            )}
          >
            Copy the following cURL command to try the API: <br />
            <CodeSnippet
              onClickCopy={() => {
                navigator.clipboard.writeText(
                  `curl '${zuploUrl}/v1/todos' --header 'Authorization: Bearer YOUR_KEY_HERE'`
                );
              }}
            >
              curl &apos;{zuploUrl}/v1/todos&apos; \ <br />
              --header &apos;Authorization: Bearer YOUR_KEY_HERE&apos;
            </CodeSnippet>
            <div className="space-x-3 flex justify-end mt-2">
              <a href={`${zuploUrl}/docs`}>
                <Button variant={"secondary"} className="min-w-[150px] mt-3">
                  Open API documention
                </Button>
              </a>
              <a href={`${zuploUrl}/docs/routes/~dashboard`}>
                <Button variant={"secondary"} className="min-w-[150px] mt-3">
                  Open API analytics
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const PlanCard = ({
  subscription,
  usage,
  auth0AccessToken,
}: {
  subscription: any;
  usage: {
    total_usage: number;
  };
  auth0AccessToken: string;
}) => {
  const [loadingCustomerPortal, setLoadingCustomerPortal] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const zuploUrl = getRequiredEnvVar("NEXT_PUBLIC_API_URL");

  const createCustomerPortalSession = async () => {
    setLoadingCustomerPortal(true);

    const response = await fetch(
      `${zuploUrl}/v1/subscription/create-customer-portal-session?returnUrl=${getURL()}`,
      {
        headers: {
          Authorization: `Bearer ${auth0AccessToken}`,
        },
      }
    );

    if (!response.ok) {
      setLoadingCustomerPortal(false);
      console.error(
        "Error creating customer portal session: ",
        await response.text()
      );
      throw new Error("Error creating customer portal session.");
    }

    const { redirect_url } = await response.json();

    return router.replace(redirect_url);
  };

  return (
    <Card
      className={cn(
        "flex flex-col rounded-md overflow-hidden border-1",
        theme === "dark" ? "border-black" : "border"
      )}
    >
      <h2
        className={cn(
          "p-3",
          theme === "dark"
            ? "text-white bg-[#4F566B] border-b-[#4F566B]"
            : "text-black bg-slate-50 border-b"
        )}
      >
        Your plan
      </h2>
      <div
        className={cn(
          "p-3 text-gray-700 space-y-3",
          theme === "dark" ? "text-white bg-[#2A2F45]" : "text-black"
        )}
      >
        <p>
          <b>{usage.total_usage}</b> requests this month.
        </p>

        <p>You are currently on "{subscription.product.name}" plan.</p>

        <p>
          {subscription.plan.usage_type === "metered" ? (
            <>
              {subscription.plan.currency.toUpperCase()}{" "}
              {subscription.plan.amount / 100}/request
            </>
          ) : (
            <>
              {subscription.plan.currency.toUpperCase()}{" "}
              {subscription.plan.amount / 100}/month
            </>
          )}
        </p>
        <div className="flex justify-end">
          <Button
            variant={"secondary"}
            onClick={createCustomerPortalSession}
            disabled={loadingCustomerPortal}
            className="min-w-[150px] mt-3"
          >
            {loadingCustomerPortal ? "Loading..." : "Manage subscription"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
