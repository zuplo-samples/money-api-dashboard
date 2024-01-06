import { CodeSnippet } from "@/components/code-snippet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getRequiredEnvVar } from "@/lib/utils";

export const TryAPICard = () => {
  const apiUrl = getRequiredEnvVar("NEXT_PUBLIC_API_URL");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Try the API</CardTitle>
        <CardDescription>
          Copy the following cURL command to try the API
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CodeSnippet
          onClickCopy={() => {
            navigator.clipboard.writeText(
              `curl '${apiUrl}/v1/todos' --header 'Authorization: Bearer YOUR_KEY_HERE'`
            );
          }}
        >
          curl &apos;{apiUrl}/v1/todos&apos; \ <br />
          --header &apos;Authorization: Bearer YOUR_KEY_HERE&apos;
        </CodeSnippet>
      </CardContent>
      <CardFooter className="flex justify-end space-x-5">
        <a href={`${apiUrl}/docs`}>
          <Button variant={"secondary"} className="min-w-[150px] mt-3">
            Open API documention
          </Button>
        </a>
        <a href={`${apiUrl}/docs/routes/~dashboard`}>
          <Button variant={"secondary"} className="min-w-[150px] mt-3">
            Open API analytics
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};
