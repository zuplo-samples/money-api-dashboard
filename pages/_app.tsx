import "@/styles/globals.css";
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { getRequiredEnvVar } from "@/lib/utils";
import { Auth0Provider } from "@auth0/auth0-react";
import type { AppProps } from "next/app";
import { Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  let redirectUri;
  if (typeof window !== "undefined") {
    redirectUri = window.location.origin;
  }

  const domain = getRequiredEnvVar("NEXT_PUBLIC_AUTH0_DOMAIN");
  const clientId = getRequiredEnvVar("NEXT_PUBLIC_AUTH0_CLIENT_ID");
  const audience = getRequiredEnvVar("NEXT_PUBLIC_AUTH0_AUDIENCE");

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience,
        scope: "openid profile email",
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main
          className={`relative flex mx-auto max-w-xl md:max-w-2xl lg:max-w-5xl min-h-screen flex-col ${fontSans.className}`}
        >
          <SiteHeader />
          <Component {...pageProps} />
          <footer className="mt-10"/>
        </main>
        <TailwindIndicator />
      </ThemeProvider>
    </Auth0Provider>
  );
}
