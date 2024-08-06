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
import { User, Settings, LogOut, UserRoundPen } from "lucide-react";

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

const SideNavbar = () => {
  const pathname = usePathname();
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
                    src="/assets/images/khai.jpg"
                    width={48}
                    height={48}
                    alt="User's profile picture"
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
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Setting</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => logOut()}
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
                      src="/assets/images/khai.jpg"
                      alt="Profile image"
                      width={70}
                      height={70}
                    />
                    <p className="font-semibold">Khai Siu Vai </p>
                  </div>
                </DialogHeader>
                <div className="flex flex-col space-y-4 mt-4 ">
                  <DialogDescription className="flex items-center space-x-4">
                    <span className="font-semibold w-24 text-gray-2">
                      Email:
                    </span>
                    <span className="flex-1 text-gray-4">
                      khaisiuvai@gmail.com
                    </span>
                  </DialogDescription>
                  <DialogDescription className="flex items-center space-x-4">
                    <span className="font-semibold w-24 text-gray-2">
                      Phone:
                    </span>
                    <span className="flex-1 text-gray-4">0914712845</span>
                  </DialogDescription>
                  <DialogDescription className="flex items-center space-x-4">
                    <span className="font-semibold w-24 text-gray-2">
                      Gender:
                    </span>
                    <span className="flex-1 text-gray-4">Gay</span>
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
                            you're done.
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

          <Link href="/direct-message">
            <CustomIcon
              faIcon={faCommentDots}
              fontSize={26}
              isSelected={pathname === "/direct-message" ? true : false}
            />
          </Link>
          <Link href="/group-message">
            <CustomIcon
              faIcon={faUsers}
              fontSize={26}
              isSelected={pathname === "/group-message" ? true : false}
            />
          </Link>
          <Link href="/friends/friend-list">
            <CustomIcon
              faIcon={faContactBook}
              fontSize={26}
              isSelected={pathname.includes("/friends") ? true : false}
            />
          </Link>
          <Link href="/notifications">
            <CustomIcon
              faIcon={faBell}
              fontSize={26}
              isSelected={pathname === "/notifications" ? true : false}
            />
          </Link>
        </div>
        <div>
          <Link href="/settings">
            <CustomIcon
              faIcon={faGear}
              fontSize={26}
              isSelected={pathname === "/settings" ? true : false}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default SideNavbar;
