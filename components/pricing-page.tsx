import { useUser } from "@/lib/hooks/use-user";
import { cn, getRequiredEnvVar, getURL } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import FullScreenLoading from "./full-screen-loading";
import FullScreenError from "./full-screen-error";

type StripeProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  priceId: string;
  currency: string;
};

export const PricingPage = () => {
  const [stripeProducts, setStripeProducts] = useState<StripeProduct[] | null>(
    null
  );
  const router = useRouter();
  const { auth0AccessToken: accessToken } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setIsLoading(false);
        setErrorMessage(`Error fetching products: ${await res.text()}`);
        return;
      }

      const products = await res.json();

      if (products.length === 0) {
        setIsLoading(false);
        setErrorMessage("No products found.");
        return;
      }

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
      setErrorMessage(`Error creating checkout session: ${await res.text()}`);
      setIsLoading(false);
      return;
    }

    const checkoutSession = await res.json();
    return router.replace(checkoutSession.url);
  };

  if (isLoading) {
    return <FullScreenLoading />;
  }

  if (errorMessage) {
    return <FullScreenError message={errorMessage} />;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-20">
      <section>
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Subscribe to your API here.
          </h1>
          <p className="text-muted-foreground max-w-[700px] text-lg  sm:text-xl">
            On checkout an account will be created for your customers on your
            API.
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
      <section>
        <div className="flex justify-center">
          {stripeProducts === null ? (
            <div>Loading products...</div>
          ) : (
            <form
              className={cn(
                stripeProducts.length > 1 && "grid grid-cols-3 gap-10"
              )}
            >
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
                      variant={"default"}
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
    </div>
  );
};
