"use client";

import React, { useState } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import GroupImgComponent from "./GroupImgComponent";
import { group }  from "@/types/group"
import GroupAddForm from "./GroupAddForm";
interface GroupListProps {
    groups: group[];
    selectedGroup: group | null;
    onSelectGroup: (selectedgroup: group) => void;
  }

const GroupList = (props: GroupListProps) =>{
    const { groups, selectedGroup, onSelectGroup } = props;

    return (
        
        <ScrollArea className="size-full overflow-visible">
        {
          groups?.map((group) => {
            return <GroupImgComponent group_id={group.groupid} group_image={group.groupimage} group_owner={group.ownerid} group_name={group.groupname}
            // noMissedMessages={0}
            // isLastMessageFromUser={false}
            // lastMessage={""} lastSent={undefined} 
            className={selectedGroup?.groupid===group.groupid ? "bg-dark-1 rounded-[8px]" : ""}
            handleClick={() => onSelectGroup(group)}/>
          })
        }
        <ScrollBar className="custom-scrollbar"/>
        <div className="h-[70px] p-[10px]">
        <GroupAddForm />

      {/* <button 
        onClick={() => GroupAddForm()}
        className="w-12 h-12 rounded-full bg-blue-500 text-white flex justify-center items-center shadow-lg hover:bg-blue-600">
        <span className="pointer-events-none select-none" aria-hidden="true">+</span>
      </button> */}
    </div>
      </ScrollArea>
    )
}

export default GroupList