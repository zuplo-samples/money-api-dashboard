import { ThemeToggle } from "@/components/theme-toggle";
import { Icons } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import UserDropdown from "./user-dropdown";
import { useAuth0 } from "@auth0/auth0-react";
import { buttonVariants } from "./ui/button";

export function SiteHeader() {
  const { isAuthenticated } = useAuth0();

  return (
    <header className="sticky top-0 z-40 w-full mt-5 mb-10 bg-background">
      <div className="flex h-16 items-center space-x-4">
        <div className="flex gap-1">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block">
              {siteConfig.name}
            </span>
          </Link>
          <div>{isAuthenticated ? <UserDropdown /> : <></>}</div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
