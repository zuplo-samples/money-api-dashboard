import { Popover } from "@/components/ui/popover";
import { useAuth0 } from "@auth0/auth0-react";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

export default function UserDropdown() {
  const { isLoading, user, logout } = useAuth0();
  const [openPopover, setOpenPopover] = useState(false);

  if (isLoading || !user?.email) return null;

  return (
    <Popover
      content={
        <Button
          variant={"outline"}
          onClick={() =>
            logout({ logoutParams: { returnTo: window?.location?.origin } })
          }
          className="flex items-center space-x-2"
        >
          <LogOut />
          <p>Logout</p>
        </Button>
      }
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
    >
      <Button
        onClick={() => setOpenPopover(!openPopover)}
        variant={"ghost"}
        className="rounded-full"
      >
        <Image
          alt={user?.email}
          src={
            user?.picture ||
            `https://avatars.dicebear.com/api/micah/${user?.email}.svg`
          }
          width={40}
          height={40}
          className="rounded-full"
        />
      </Button>
    </Popover>
  );
}
