"use client";

import SearchBar from "@/components/Direct-message/SearchBar"; 
import Notification from "../Notification/Notification";
import GroupListPanel from "./GroupListPanel";
import { group }  from "@/types/group"
import { User } from "@/types/user";import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/services/AuthService";
interface GroupsProps {
  currentUser: User;
}
  

const Groups = (props:GroupsProps) => {

    const [selectedGroup, onSelectGroup] = React.useState<group | null>(null);
    const [GroupList,setGroupList] = useState<group[]>([]);
    async function fetchGroupList() {
      let res;
      try {
        res = await fetch(`/dashboard/api/groupchat?id=${props.currentUser.user_id}`, {
          method: "GET",
        });
        
         if(res.status !== 200) {
          throw new Error("Failed to groupchat list");
        }
  
        const data = await res.json();
        if (data.response.statusCode === 200) {
          setGroupList(data.response.data);
        }
        console.log("Response :" + JSON.stringify(data));
      } catch (error) {
        console.log("Error: " + error);
      }
  
    }
    useEffect(() => {
      fetchGroupList();
    }, []);
    return (
        <section className="flex flex-row size-full ">
      <section className="flex flex-col w-[486px] bg-dark-9 max-lg:w-[330px]">
        <div className="h-[98px] w-[full] ">
          <div className="h-[98px] flex flex-row">
            <SearchBar placeHolder="Find a group" />
            <Notification />
          </div>
          <div className="w-[30vh] border-dark-9 border-[1px] ">
          <GroupListPanel groups={GroupList} selectedGroup={selectedGroup} onSelectGroup={onSelectGroup} />
          </div>
        </div>
      </section>
    </section>
    )
}
export default Groups