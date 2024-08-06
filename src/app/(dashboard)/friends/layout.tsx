import SearchBar from "@/components/Direct-message/SearchBar";
import FriendSidePanel from "@/components/Friends/FriendSidePanel";
import React from "react";

const FriendsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-row size-full">
      <section className="flex flex-col w-[486px] bg-dark-9 max-lg:w-[330px]">
        <div className="h-[98px] w-[full] ">
          <SearchBar placeHolder="Find a friend"/>
          <div className="relative flex w-full border-dark-10 border-[1px] "></div>
        </div>
        <div className="pt-[2px] size-full max-h-[calc(100vh-98px)]">
          <FriendSidePanel />
        </div>
      </section>
      <div className="size-full">{children}</div>
    </section>
  );
};

export default FriendsLayout;
