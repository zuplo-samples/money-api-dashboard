import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getRequiredEnvVar, getURL } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { useState } from "react";

export const PlanCard = ({
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setErrorMessage(
        `Error creating customer portal session: ${await response.text()}`
      );
      return;
    }

    const { redirect_url } = await response.json();

    return router.replace(redirect_url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your plan</CardTitle>
      </CardHeader>
      {errorMessage && (
        <div className="relative overflow-auto bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">Error</p>
          <p >{errorMessage}</p>
        </div>
      )}
      <CardContent>
        <table
          className={cn(
            "w-full border-separate border-2 rounded-md p-3",
            theme === "dark" ? "border-slate-500" : "bg-slate-50 text-black"
          )}
        >
          <tbody className="justify-between pl-0">
            <tr>
              <td className="font-semibold">Billing cycle</td>
              <td>
                {subscription.plan.interval === "month"
                  ? "Monthly"
                  : "Annually"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Plan</td>
              <td>{subscription.product.name}</td>
            </tr>
            <tr>
              <td className="font-semibold">Price</td>
              <td>
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
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Next payment</td>
              <td>
                {new Date(
                  subscription.current_period_end * 1000
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Subscription type</td>
              <td>
                {subscription.plan.usage_type === "metered"
                  ? `Metered requests`
                  : "Unlimited"}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">Usage this month</td>
              <td>
                {subscription.plan.usage_type === "metered"
                  ? `${usage.total_usage} requests`
                  : "Unlimited"}
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant={"secondary"}
          onClick={createCustomerPortalSession}
          disabled={loadingCustomerPortal}
          className="min-w-[150px] mt-3"
        >
          {loadingCustomerPortal ? "Loading..." : "Manage subscription"}
        </Button>
      </CardFooter>
    </Card>
  );
};
