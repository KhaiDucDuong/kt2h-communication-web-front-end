"use client";

import { usePathname } from "next/navigation";
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
import { SocketContext, UserSessionContext } from "@/types/context";
import MyAccountModal from "./MyAccountModal";

interface SideNavbarProps {
  currentTab: DashboardTab;
  setCurrentTab: Dispatch<SetStateAction<DashboardTab>>;
}

const SideNavbar = (props: SideNavbarProps) => {
  const pathname = usePathname();

  return (
    <nav className="min-w-[64px] min-h-screen bg-dark-10">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="text-white w-full h-[100px] flex justify-center">
            <MyAccountModal />
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
          {/* <div>
            <CustomIcon
              faIcon={faBell}
              fontSize={26}
              isSelected={pathname === "/notifications" ? true : false}
            />
          </div> */}
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
