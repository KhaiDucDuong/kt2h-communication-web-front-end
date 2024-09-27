"use client";
import SearchBar from "@/components/Direct-message/SearchBar";
import FriendSidePanel from "@/components/Friends/FriendSidePanel";
import { useState } from "react";
import FriendList from "./FriendList/FriendList";
import FriendRequests from "./FriendRequests/FriendRequests";
import Notification from "../Notification/Notification";

export enum FriendTab {
  FRIEND_LIST = "Friend list",
  FRIEND_REQUESTS = "Friend requests",
  GROUP_INVITATIONS = "Group invitations",
}

const Friends = () => {
  const [currentFriendTab, setCurrentFriendTab] = useState<FriendTab>(
    FriendTab.FRIEND_LIST
  );

  return (
    <section className="flex flex-row size-full">
      <section className="flex flex-col w-[486px] bg-dark-9 max-lg:w-[330px]">
        <div className="h-[98px] w-[full] ">
          <div className="h-[98px] flex flex-row">
            <SearchBar placeHolder="Find a friend" />
            <Notification />
          </div>
          <div className="relative flex w-full border-dark-10 border-[1px] "></div>
        </div>
        <div className="pt-[2px] size-full max-h-[calc(100vh-98px)]">
          <FriendSidePanel
            currentTab={currentFriendTab}
            setCurrentTab={setCurrentFriendTab}
          />
        </div>
      </section>
      <div className="size-full">
        {currentFriendTab === FriendTab.FRIEND_LIST && <FriendList />}
        {currentFriendTab === FriendTab.FRIEND_REQUESTS && <FriendRequests />}
        {currentFriendTab === FriendTab.GROUP_INVITATIONS && (
          <div>group invitations</div>
        )}
      </div>
    </section>
  );
};

export default Friends;
