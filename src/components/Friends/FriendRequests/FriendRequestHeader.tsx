import { FriendRequestTab } from "@/app/(dashboard)/friends/friend-requests/page";
import { cn } from "@/lib/utils";
import React from "react";

const FriendRequestHeader = (props: {
  selectedTab: FriendRequestTab;
  setSelectedTab: React.Dispatch<React.SetStateAction<FriendRequestTab>>;
}) => {
  return (
    <div className="h-[98px] w-full">
      <div className="h-full flex col pl-[25px]">
        <div
          className={cn(
            "self-center mr-[12px] cursor-pointer hover:bg-dark-11  px-[6px] py-[2px] rounded-[4px] text-gray-5 ",
            props.selectedTab === FriendRequestTab.INCOMING && "bg-dark-11 text-gray-4"
          )}
          onClick={() => props.setSelectedTab(FriendRequestTab.INCOMING)}
        >
          Incoming requests
        </div>
        <div
          className={cn(
            "self-center mr-[12px] cursor-pointer hover:bg-dark-11  px-[6px] py-[2px] rounded-[4px] text-gray-5 ",
            props.selectedTab === FriendRequestTab.OUTGOING && "bg-dark-11 text-gray-4"
          )}
          onClick={() => props.setSelectedTab(FriendRequestTab.OUTGOING)}
        >
          Out-going requests
        </div>
        <div
          className={cn(
            "self-center mr-[12px] cursor-pointer bg-green-700 hover:bg-green-800 transition-colors  px-[6px] py-[2px] rounded-[4px] text-gray-4 "
          )}
          onClick={() => {}}
        >
          Add Friend
        </div>
      </div>
      <div className="relative flex  border-dark-10 border-[1px] "></div>
    </div>
  );
};

export default FriendRequestHeader;
