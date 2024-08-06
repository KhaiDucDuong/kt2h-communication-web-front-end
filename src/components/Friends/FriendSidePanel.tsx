'use client'
 
import { usePathname } from 'next/navigation'
import React from 'react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import FriendsSidePanelOption from './FriendsSidePanelOption'
import { Contact2Icon, UserPlus2Icon, Users2Icon } from 'lucide-react'

const FriendSidePanel = () => {
  const pathname = usePathname()
  return (
    <ScrollArea className="size-full">
        <FriendsSidePanelOption name="Friend list" url="/friends/friend-list" isActive={pathname==="/friends/friend-list"} icon={Contact2Icon} />
        <FriendsSidePanelOption name="Friend requests" url="/friends/friend-requests" isActive={pathname==="/friends/friend-requests"} icon={UserPlus2Icon} />
        <FriendsSidePanelOption name="Group invitations" url="/friends/group-invitations" isActive={pathname==="/friends/group-invitations"} icon={Users2Icon} />
      <ScrollBar className="custom-scrollbar"/>
    </ScrollArea>
  )
}

export default FriendSidePanel