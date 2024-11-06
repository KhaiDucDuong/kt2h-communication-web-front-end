"use client";

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

import { usePathname } from "next/navigation";
import Image from "next/image";
import CustomIcon from "@/components/Dashboard/SideNavbar/CustomIcon";
import {
  faCommentDots,
  faUsers,
  faBell,
  faGear,
  faContactBook,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { logOut } from "@/services/AuthService";
import { User } from "@/types/user";
import { Dispatch, SetStateAction, useContext } from "react";
import { DashboardTab } from "@/types/ui";
import { SocketContext } from "@/types/context";

interface SideNavbarProps {
  currentUser: User;
  currentTab: DashboardTab;
  setCurrentTab: Dispatch<SetStateAction<DashboardTab>>;
}

const SideNavbar = (props: SideNavbarProps) => {
  const pathname = usePathname();
  const socketContext = useContext(SocketContext);

  const handleLogOut = async () => {
    if (!socketContext?.stompClient) {
      logOut();
    } else {
      socketContext.stompClient.deactivate().then(() => logOut());
    }
  };

  return (
    <nav className="min-w-[64px] min-h-screen bg-dark-10">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="text-white w-full h-[100px] flex justify-center">
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Image
                    className="rounded-full m-auto hover:cursor-pointer"
                    src={
                      props.currentUser.image === null
                        ? "/assets/images/profile-pic.jpg"
                        : props.currentUser.image
                    }
                    width={48}
                    height={48}
                    alt={props.currentUser.first_name + "'s profile picture"}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-dark-9 text-gray-4 origin-top-left left-full ml-20 -mt-20 shadow-2xl w-60 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                  align="end"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild className="outline-none">
                    <DropdownMenuItem className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Setting</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="bg-dark-9 text-gray-2 shadow-2xl  ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
                <DialogHeader className="flex flex-col space-y-8">
                  <DialogTitle>User profile</DialogTitle>
                  <div className="flex items-center space-x-10 mt-4">
                    <Image
                      className="rounded-full "
                      src={
                        props.currentUser.image === null
                          ? "/assets/images/profile-pic.jpg"
                          : props.currentUser.image
                      }
                      alt={props.currentUser.first_name + "'s profile picture"}
                      width={70}
                      height={70}
                    />
                    <p className="font-semibold">
                      {props.currentUser.last_name +
                        " " +
                        props.currentUser.first_name}
                    </p>
                  </div>
                </DialogHeader>
                <div className="flex flex-col space-y-4 mt-4 ">
                  <DialogDescription className="flex items-center space-x-4">
                    <span className="font-semibold w-24 text-gray-2">
                      Email:
                    </span>
                    <span className="flex-1 text-gray-4">
                      {props.currentUser.email}
                    </span>
                  </DialogDescription>
                  <DialogDescription className="flex items-center space-x-4">
                    <span className="font-semibold w-24 text-gray-2">
                      Phone:
                    </span>
                    <span className="flex-1 text-gray-4">
                      {props.currentUser.phone || ""}
                    </span>
                  </DialogDescription>
                  <DialogDescription className="flex items-center space-x-4">
                    <span className="font-semibold w-24 text-gray-2">
                      Gender:
                    </span>
                    <span className="flex-1 text-gray-4">Male</span>
                  </DialogDescription>
                  <DialogFooter>
                    <Dialog>
                      <DialogTrigger asChild className="outline-none">
                        <Button
                          variant="ghost"
                          className="hover:cursor-pointer focus-visible:ring-offset-0 focus-visible:ring-0"
                        >
                          <UserRoundPen className="mr-2" /> Change
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] bg-dark-8 text-gray-2 shadow-2xl  ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
                        <DialogHeader>
                          <DialogTitle>Edit profile</DialogTitle>
                          <DialogDescription className="text-gray-2">
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 mt-2">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-left">
                              Username
                            </label>
                            <input
                              id="name"
                              defaultValue="Pedro Duarte"
                              className="col-span-3  bg-dark-6 text-gray-4 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="text-left">
                              Email
                            </label>
                            <input
                              id="email"
                              defaultValue="@peduarte"
                              className="col-span-3 bg-dark-6 text-gray-4 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="phone" className="text-left">
                              Phone
                            </label>
                            <input
                              id="phone"
                              defaultValue="0914712845"
                              className="col-span-3 bg-dark-6 text-gray-4 outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="gender" className="text-left">
                              Gender
                            </label>
                            <input
                              id="gender"
                              defaultValue="Gay"
                              className="col-span-3 bg-dark-6 text-gray-4 outline-none"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="ghost" type="submit">
                            Save changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div
            onClick={() => {
              props.setCurrentTab(DashboardTab.DIRECT_MESSAGE);
            }}
          >
            <CustomIcon
              faIcon={faCommentDots}
              fontSize={26}
              isSelected={props.currentTab === DashboardTab.DIRECT_MESSAGE}
            />
          </div>
          <div
            onClick={() => {
              props.setCurrentTab(DashboardTab.GROUP_CHAT);
            }}
          >
            <CustomIcon
              faIcon={faUsers}
              fontSize={26}
              isSelected={props.currentTab === DashboardTab.GROUP_CHAT}
            />
          </div>
          <div
            onClick={() => {
              props.setCurrentTab(DashboardTab.FRIENDS);
            }}
          >
            <CustomIcon
              faIcon={faContactBook}
              fontSize={26}
              isSelected={props.currentTab === DashboardTab.FRIENDS}
            />
          </div>
          <div>
            <CustomIcon
              faIcon={faBell}
              fontSize={26}
              isSelected={pathname === "/notifications" ? true : false}
            />
          </div>
        </div>
        <div>
          <div
            onClick={() => {
              props.setCurrentTab(DashboardTab.SETTINGS);
            }}
          >
            <CustomIcon
              faIcon={faGear}
              fontSize={26}
              isSelected={props.currentTab === DashboardTab.SETTINGS}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideNavbar;
