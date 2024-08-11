import FriendListDisplay from "@/components/Friends/FriendList/FriendListDisplay";
import FriendListDisplayLoading from "@/components/Friends/FriendList/FriendListDisplayLoading";
import FriendListHeader from "@/components/Friends/FriendList/FriendListHeader";
import React, { Suspense } from "react";

const FriendListPage = () => {
  return (
    <section className="flex flex-col size-full bg-dark-4">
      <div className="h-[98px]"><FriendListHeader /></div>
      <FriendListDisplay />
    </section>
  );
};

export default FriendListPage;
