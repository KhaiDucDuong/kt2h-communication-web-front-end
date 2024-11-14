import { FriendRequestTab } from "@/types/ui";
import { cn } from "@/lib/utils";
import React from "react";

const FriendRequestHeader = (props: {
  selectedTab: FriendRequestTab;
  setSelectedTab: React.Dispatch<React.SetStateAction<FriendRequestTab>>;
}) => {
  return (
    <div className="h-[98px] w-full text-[16px]">
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
            "self-center mr-[12px] bg-green-700 cursor-default transition-colors  px-[6px] py-[2px] rounded-[4px] text-gray-4 ",
            props.selectedTab !== FriendRequestTab.ADD_FRIEND && "hover:bg-green-800 cursor-pointer ",
            props.selectedTab === FriendRequestTab.ADD_FRIEND && "bg-dark-4 text-green-700 hover:none "
          )}
          onClick={() => props.setSelectedTab(FriendRequestTab.ADD_FRIEND)}
        >
          Add Friend
        </div>
      </div>
      <div className="relative flex  border-dark-10 border-[1px] "></div>
    </div>
  );
};

export default FriendRequestHeader;
