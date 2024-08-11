"use client"
import FriendRequestDisplay from "@/components/Friends/FriendRequests/FriendRequestDisplay";
import FriendRequestHeader from "@/components/Friends/FriendRequests/FriendRequestHeader";
import React, { useState } from "react";

export enum FriendRequestTab {
  INCOMING = "INCOMING",
  OUTGOING = "OUTGOING",
}

const FriendRequestsPage = () => {
  const [selectedTab, setSelectedTab] = useState<FriendRequestTab>(
    FriendRequestTab.INCOMING
  );
  return (
    <section className="flex flex-col size-full bg-dark-4">
      <div className="h-[98px]">
        <FriendRequestHeader selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <FriendRequestDisplay selectedTab={selectedTab}/>
    </section>
  );
};

export default FriendRequestsPage;
