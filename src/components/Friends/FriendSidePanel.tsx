'use client'
 
import { usePathname } from 'next/navigation'
import React, { Dispatch, SetStateAction } from 'react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import FriendsSidePanelOption from './FriendsSidePanelOption'
import { Contact2Icon, UserPlus2Icon, Users2Icon } from 'lucide-react'
import { FriendTab } from './Friends'

interface FriendSidePanelProps {
  currentTab: FriendTab;
  setCurrentTab: Dispatch<SetStateAction<FriendTab>>;
}

const FriendSidePanel = (props: FriendSidePanelProps) => {
  const {currentTab, setCurrentTab} = props;
  const pathname = usePathname()
  return (
    <ScrollArea className="size-full">
        <FriendsSidePanelOption tab={FriendTab.FRIEND_LIST} isActive={currentTab===FriendTab.FRIEND_LIST} icon={Contact2Icon} setCurrentTab={setCurrentTab}/>
        <FriendsSidePanelOption tab={FriendTab.FRIEND_REQUESTS} isActive={currentTab===FriendTab.FRIEND_REQUESTS} icon={UserPlus2Icon} setCurrentTab={setCurrentTab}/>
        <FriendsSidePanelOption tab={FriendTab.GROUP_INVITATIONS} isActive={currentTab===FriendTab.GROUP_INVITATIONS} icon={Users2Icon} setCurrentTab={setCurrentTab}/>
      <ScrollBar className="custom-scrollbar"/>
    </ScrollArea>
  )
}

export default FriendSidePanel