"use client";

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
    <nav className="w-[64px] min-h-screen bg-dark-10">
      <div className="flex flex-col justify-between h-full">
        <div>
          <Link href="/profile">
            <div className="text-white w-full h-[100px] flex justify-center">
              <Image
                className="rounded-full m-auto border-2 hover:cursor-pointer"
                src="/assets/images/profile-pic.jpg"
                width={48}
                height={48}
                alt="User's profile picture"
              />
            </div>
          </Link>

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
