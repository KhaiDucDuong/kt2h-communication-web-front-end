import FriendListDisplay from "@/components/Friends/FriendList/FriendListDisplay";
import FriendListDisplayLoading from "@/components/Friends/FriendList/FriendListDisplayLoading";
import FriendListHeader from "@/components/Friends/FriendList/FriendListHeader";
import React, { Suspense } from "react";

const FriendListPage = () => {
  return (
    <section className="flex flex-col size-full bg-dark-4">
      <FriendListHeader />
      <Suspense fallback={<FriendListDisplayLoading />}>
        <FriendListDisplay />
      </Suspense>
    </section>
  );
};

export default FriendListPage;
