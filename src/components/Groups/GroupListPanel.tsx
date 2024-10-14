import { group }  from "@/types/group"

import GroupList from "./GroupList"

interface GroupListPanelProps {
    groups: group[];
    selectedGroup: group | null;
    onSelectGroup: (selectedgroup: group) => void;
  }
const GroupListPanel = (props:GroupListPanelProps) =>{
    const { groups, selectedGroup, onSelectGroup } = props;

    return(
      <section className="flex flex-col w-[11vh] h-[calc(100vh-100px)]  bg-dark-10 max-lg:w-[14vh] ">
      <div className="pt-[2px] px-[7px]">
        <GroupList groups={groups} selectedGroup={selectedGroup} onSelectGroup={onSelectGroup} />
      </div>
    </section>
    )
}

export default GroupListPanel