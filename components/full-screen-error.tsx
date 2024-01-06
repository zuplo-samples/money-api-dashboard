import Link from "next/link";

export default function FullScreenError({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-left justify-center grow gap-5">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl pb-6">
        {"Something went wrong:"}
      </h1>
      <h2 className="font-semibold leading-tight tracking-tighter">
        {message}
      </h2>
      <p className="text-lg font-extrabold leading-tight tracking-tighter sm:text-lg md:text-xl lg:text-2xl">
        Click{" "}
        <Link className="text-pink-500" href="/">
          here
        </Link>{" "}
        to go back to the homepage.
      </p>
    </div>
  );
}
