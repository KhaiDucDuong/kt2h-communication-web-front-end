import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { UserIcon, Settings, LogOut, UserRoundPen } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { SocketContext, UserSessionContext } from "@/types/context";
import { logOut } from "@/services/AuthService";
import MyProfileModal from "../MyProfile/MyProfileModal";

export enum ShowMyAccountModalType {
  NONE,
  PROFILE,
  SETTING,
}

const MyAccountModal = () => {
  const socketContext = useContext(SocketContext);
  const userSessionContext = useContext(UserSessionContext);
  const [showModalType, setShowModalType] = useState<ShowMyAccountModalType>(
    ShowMyAccountModalType.NONE
  );

  useEffect(() => {
    return () => {
      setShowModalType(ShowMyAccountModalType.NONE);
    };
  }, []);

  const handleLogOut = async () => {
    console.log("****Logging out****");
    if (!socketContext?.stompClient) {
      logOut();
    } else {
      socketContext.stompClient.deactivate().then(() => logOut());
    }
  };

  if (!userSessionContext || !userSessionContext.currentUser)
    return <div>User context is null or current user is undefined</div>;

  return (
    <section className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Image
            className="rounded-full size-[48px] m-auto hover:cursor-pointer"
            src={
              userSessionContext.currentUser.image === null
                ? "/assets/images/profile-pic.jpg"
                : userSessionContext.currentUser.image
            }
            width={48}
            height={48}
            alt={
              userSessionContext.currentUser.first_name + "'s profile picture"
            }
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-dark-9 text-gray-4 origin-top-left left-full ml-20 -mt-20 shadow-2xl w-60 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          align="end"
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setShowModalType(ShowMyAccountModalType.PROFILE)}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setShowModalType(ShowMyAccountModalType.SETTING)}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Setting</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MyProfileModal
        show={showModalType === ShowMyAccountModalType.PROFILE}
        setShow={setShowModalType}
      />
    </section>
  );
};

export default MyAccountModal;
