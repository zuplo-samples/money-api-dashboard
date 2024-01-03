import { useUser } from "@/lib/hooks/use-is-subscribed";
import { getRequiredEnvVar, getURL } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type StripeProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  priceId: string;
  currency: string;
};

export const StripePricingTable = () => {
  const [stripeProducts, setStripeProducts] = useState<StripeProduct[] | null>(
    null
  );
  const router = useRouter();
  const { auth0AccessToken: accessToken } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!accessToken) {
        return;
      }

      const res = await fetch(
        getRequiredEnvVar("NEXT_PUBLIC_API_URL") + "/v1/subscription/products",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Error fetching products: ", await res.text());
        throw new Error("Error fetching products.");
      }

      const products = await res.json();
      setStripeProducts(products);
    };
    fetchProducts();
  }, [accessToken]);

  const getAndRedirectToCheckout = async (priceId: string) => {
    setIsLoading(true);

    const res = await fetch(
      `${getRequiredEnvVar(
        "NEXT_PUBLIC_API_URL"
      )}/v1/subscription/create-checkout?priceId=${priceId}&redirectUrl=${getURL()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      // TODO: Handle error
      console.error("Error creating checkout session: ", await res.text());
      setIsLoading(false);
      throw new Error("Error creating checkout session.");
    }

    const checkoutSession = await res.json();
    return router.replace(checkoutSession.url);
  };

  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Subscribe to your API here.
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            Zuplo generates a{" "}
            <Link
              className="text-blue-500"
              href="https://zuplo.com/docs/articles/developer-portal"
            >
              Developer Portal
            </Link>{" "}
            where your customers can explore your API's documentation and create
            API Keys using Zuplo's{" "}
            <Link
              className="text-blue-500"
              href="https://zuplo.com/docs/articles/api-key-management"
            >
              API Key Management
            </Link>
            .
          </p>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            On checkout an account will be created for your customers on your
            API's own Developer Portal.
          </p>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            You can use{" "}
            <Link
              className="text-blue-500"
              target="_blank"
              href="https://stripe.com/docs/testing#cards"
            >
              fake credit card numbers
            </Link>{" "}
            to test the Stripe integration and use a ToDo API deployed with
            Zuplo.
          </p>
        </div>
      </section>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex justify-center">
          {stripeProducts === null ? (
            <div>Loading products...</div>
          ) : (
            <form>
              {stripeProducts.map((product) => {
                return (
                  <div
                    className="flex max-w-xs flex-col space-y-3 rounded-xl border border-gray-500 p-4 shadow-lg"
                    key={product.id}
                  >
                    <span className="text-xl">{product.name}</span>
                    <span className="w-2/3 text-sm text-gray-500">
                      {product.description}
                    </span>
                    <div className="flex flex-row space-x-2">
                      <span className="text-2xl">
                        {product.currency.toUpperCase()} {product.price}
                      </span>
                      <span>
                        per request / <br /> per month
                      </span>
                    </div>
                    <Button
                      variant={isLoading ? "disabled" : "default"}
                      disabled={isLoading}
                      onClick={async (e) => {
                        e.preventDefault();
                        await getAndRedirectToCheckout(product.priceId);
                      }}
                    >
                      Subscribe
                    </Button>
                  </div>
                );
              })}
            </form>
          )}
        </div>
      </section>
    </>
  );
};
