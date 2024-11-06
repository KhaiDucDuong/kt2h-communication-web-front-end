"use client";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import InvitationNotificationList from "./InvitationNotificationList";

enum NotifcationTab {
  FOR_YOU,
  UNREAD,
  MENTION,
}

const Notification = () => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<NotifcationTab>(
    NotifcationTab.FOR_YOU
  );

  return (
    <section className="min-w-fit self-center mr-[16px]">
      <Popover>
        <PopoverTrigger
          onClick={() => {
            setIsOpened(!isOpened);
          }}
        >
          <FontAwesomeIcon
            icon={faInbox}
            fontSize={24}
            className={cn(
              "text-gray-1 hover:text-gray-2 ",
              isOpened && "text-gray-2 "
            )}
          />
        </PopoverTrigger>
        <PopoverContent className="bg-dark-6 border-dark-6 p-0 w-fit">
          <div className="m-[16px]">
            <FontAwesomeIcon
              icon={faInbox}
              fontSize={20}
              className="text-gray-2 mr-[10px]"
            />
            <span className="text-gray-2 text-[20px]">Inbox</span>
          </div>
          <div className="flex flex-row">
            <div
              className={cn(
                "px-[16px] pb-[16px] text-gray-1 hover:text-gray-2 cursor-pointer hover:border-b-2 border-blue-2 ",
                selectedTab === NotifcationTab.FOR_YOU &&
                  "text-gray-2 border-blue-1 border-b-2"
              )}
              onClick={() => {
                if (selectedTab !== NotifcationTab.FOR_YOU)
                  setSelectedTab(NotifcationTab.FOR_YOU);
              }}
            >
              For You
            </div>
            <div
              className={cn(
                "px-[16px] pb-[16px] text-gray-1 hover:text-gray-2 cursor-pointer hover:border-b-2 border-blue-2 ",
                selectedTab === NotifcationTab.UNREAD &&
                  "text-gray-2 border-blue-1 border-b-2"
              )}
              onClick={() => {
                if (selectedTab !== NotifcationTab.UNREAD)
                  setSelectedTab(NotifcationTab.UNREAD);
              }}
            >
              Unread
            </div>
            <div
              className={cn(
                "px-[16px] pb-[16px] text-gray-1 hover:text-gray-2 cursor-pointer hover:border-b-2 border-blue-2 ",
                selectedTab === NotifcationTab.MENTION &&
                  "text-gray-2 border-blue-1 border-b-2"
              )}
              onClick={() => {
                if (selectedTab !== NotifcationTab.MENTION)
                  setSelectedTab(NotifcationTab.MENTION);
              }}
            >
              Mentions
            </div>
          </div>
          <ScrollArea className="w-[472px] ">
            {selectedTab === NotifcationTab.FOR_YOU && (
              <InvitationNotificationList />
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </section>
  );
};

export default Notification;
