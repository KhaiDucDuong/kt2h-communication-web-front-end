import { group }  from "@/types/group"

import GroupList from "./GroupList"

interface GroupListPanelProps {
    groups: group[];
    selectedGroup: group | null;
    onSelectGroup: (selectedgroup: group) => void;
    onFetchGroups: () => Promise<void>;
  }
const GroupListPanel = (props:GroupListPanelProps) =>{
    const { groups, selectedGroup, onSelectGroup,onFetchGroups } = props;

    return(
      <section className="flex flex-col max-w-fit h-[calc(100vh-100px)]  bg-dark-10 max-lg:w-[14vh] ">
      <div className="pt-[2px] px-[7px]">
        <GroupList groups={groups} selectedGroup={selectedGroup} onSelectGroup={onSelectGroup} onFetchGroups={onFetchGroups}/>
      </div>
    </section>
    )
}

export default GroupListPanel