import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState } from "react";

export function CodeSnippet({
  children,
  onClickCopy,
}: {
  children: React.ReactNode;
  onClickCopy: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const onClick = () => {
    onClickCopy();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card
      className={cn(
        "flex justify-between",
        theme === "dark"
          ? "bg-secondary/50 text-white border-none"
          : "bg-slate-50 text-black"
      )}
    >
      <pre
        className={cn(
          "font-mono text-sm p-4",
          theme === "dark" ? " text-white" : " text-black"
        )}
      >
        <code>{children}</code>
      </pre>
      <Button className="m-1" size="sm" variant="ghost" onClick={onClick}>
        {copied ? (
          <CheckIcon className="h-4 w-4 text-green-500 text-bold" />
        ) : (
          <CopyIcon
            className={cn(
              "h-4 w-4",
              theme === "dark" ? "text-white" : "text-gray-500"
            )}
          />
        )}
      </Button>
    </Card>
  );
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      strokeLinejoin="round"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
      ></path>
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      ></path>
    </svg>
  );
}
