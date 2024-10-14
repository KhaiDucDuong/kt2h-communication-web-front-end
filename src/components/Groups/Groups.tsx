"use client";

import SearchBar from "@/components/Direct-message/SearchBar"; 
import { useState } from "react";
import Notification from "../Notification/Notification";
import GroupListPanel from "./GroupListPanel";
import { group }  from "@/types/group"
import React from "react";
 
interface GroupsProps {
    groups: group[];
    selectedGroup: group | null;
    onSelectGroup: (selectedgroup: group) => void;
  }
  const GroupTest: group[] = [
    { groupid: "1", groupname: 'Nhom hoc', ownerid: 'Tien' ,groupimage:'/assets/images/profile-pic.jpg'},
    { groupid: "2", groupname: 'Nhom quay', ownerid: 'Hoang',groupimage:'/assets/images/profile-pic.jpg' },
    { groupid: "3", groupname: 'Nhom suy', ownerid: 'Khai' ,groupimage:'/assets/images/profile-pic.jpg'},
    { groupid: "4", groupname: 'Nhom game', ownerid: 'Lan',groupimage:'/assets/images/profile-pic.jpg' },
  ];
const Groups = (props: GroupsProps) => {
    // const { groups, selectedGroup, onSelectGroup } = props;
    const [selectedGroup, onSelectGroup] = React.useState<group | null>(null);
    return (
        <section className="flex flex-row size-full ">
      <section className="flex flex-col w-[486px] bg-dark-9 max-lg:w-[330px]">
        <div className="h-[98px] w-[full] ">
          <div className="h-[98px] flex flex-row">
            <SearchBar placeHolder="Find a group" />
            <Notification />
          </div>
          <div className="w-[30vh] border-dark-9 border-[1px] ">
          <GroupListPanel groups={GroupTest} selectedGroup={selectedGroup} onSelectGroup={onSelectGroup} />
          </div>
        </div>
      </section>
    </section>
    )
}
export default Groups