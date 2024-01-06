import FullScreenError from "@/components/full-screen-error";
import FullScreenLoading from "@/components/full-screen-loading";
import { KeyManagerCard } from "@/components/key-manager/key-manager";
import { PlanCard } from "@/components/plan-card";
import { TryAPICard } from "@/components/try-api-card";
import { useUser } from "@/lib/hooks/use-user";
import { getRequiredEnvVar } from "@/lib/utils";
import { useRouter } from "next/router";

export default function DashboardPage() {
  const {
    isLoading,
    isSubscribed,
    subscription,
    usage,
    auth0AccessToken,
    errorMessage,
  } = useUser();
  const router = useRouter();
  const apiUrl = getRequiredEnvVar("NEXT_PUBLIC_API_URL");

  if (isLoading) {
    return <FullScreenLoading />;
  }

  if (!isSubscribed) {
    router.push("/");
    return <FullScreenLoading />;
  }

  if (!subscription || !usage || !auth0AccessToken) {
    return <FullScreenError message={errorMessage || "Something went wrong"} />;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-10">
      <h1 className="text-5xl font-extrabold tracking-tighter">
        To use the API, use the API Key manager below.
      </h1>
      <div className="w-full max-w-3xl space-y-10">
        <KeyManagerCard
          apiUrl={apiUrl + "/v1"}
          accessToken={auth0AccessToken}
        />
        <TryAPICard />
        <PlanCard
          subscription={subscription}
          usage={usage}
          auth0AccessToken={auth0AccessToken}
        />
      </div>
    </div>
  );
}
