"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {User,Settings,LogOut,UserRoundPen  } from "lucide-react"

import { usePathname } from "next/navigation";
import Image from "next/image";
import CustomIcon from "@/components/Dashboard/SideNavbar/CustomIcon";
import {
  faCommentDots,
  faUsers,
  faBell,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const SideNavbar = () => {
  const pathname = usePathname();
  return (
    <nav className="min-w-[64px] min-h-screen bg-dark-10">
      <div className="flex flex-col justify-between h-full">
        <div>
        <div className="text-white w-full h-[100px] flex justify-center">
        <Dialog >
        <DropdownMenu>
  <DropdownMenuTrigger className="outline-none">
              <Image
                className="rounded-full m-auto border-2 hover:cursor-pointer"
                src="/assets/images/khai.jpg"
                width={48}
                height={48}
                alt="User's profile picture"
              />
           </DropdownMenuTrigger>
  <DropdownMenuContent  className="origin-top-left left-full ml-20 -mt-20 shadow-lg w-56" 
        align="end">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DialogTrigger asChild className="outline-none">
    <DropdownMenuItem> 
    <User className="mr-2 h-4 w-4" />
    <span>Profile</span></DropdownMenuItem>
    </DialogTrigger>
    <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />
    <span>Setting</span></DropdownMenuItem>
    <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" />
    <span>Sign out</span></DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
<DialogContent>
    <DialogHeader className="flex flex-col space-y-4 ">
      <DialogTitle >User profile</DialogTitle>
      <div className="flex items-center space-x-8 mt-4">
      <Image
                className="rounded-full border-2"
                src="/assets/images/khai.jpg"
                width={70}
                height={70}
              />
              <p className="font-bold">Khai Siu Vai </p>
              </div>
    </DialogHeader>
    <div className="flex flex-col space-y-4 mt-4">
    <DialogDescription className="flex items-center space-x-4">
          <span className="font-semibold w-24">Email:</span>
          <span className="flex-1">khaisiuvai@gmail.com</span>
        </DialogDescription>
        <DialogDescription className="flex items-center space-x-4">
          <span className="font-semibold w-24">Phone:</span>
          <span className="flex-1">0914712845</span>
        </DialogDescription>
        <DialogDescription className="flex items-center space-x-4">
          <span className="font-semibold w-24">Gender:</span>
          <span className="flex-1">Gay</span>
        </DialogDescription>
        <DialogFooter>
        <Button variant="ghost" className="hover:cursor-pointer"><UserRoundPen className="mr-2" /> Change</Button>
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
