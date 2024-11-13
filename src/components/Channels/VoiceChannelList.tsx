"use client";

import React, { useState } from 'react';
import { channel } from "@/types/channel";
import { CircleX, Pencil, Volume1Icon } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '../ui/button';
import { getAccessToken } from '@/services/AuthService';
interface ChannelPanelProps {
  channels: channel[];
  selectedChannel: channel | null;
  onSelectChannel: (selectedChannel: channel) => void;
  onFetchChannels: () => Promise<void>;
}

enum Dialogs {
  Delete = 1,
  Edit = 2,
}

const VoiceChannelList = (props: ChannelPanelProps) => {
  const { channels, selectedChannel, onSelectChannel, onFetchChannels } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<Dialogs | null>(null);
  const [currentChannel, setCurrentChannel] = useState<channel | null>(null);
  const [channelName, setchannelName] = useState("");
  const [isPrivate, setIsPrivate] = useState(currentChannel?.is_private);
  const handleToggle = () => {
    setIsPrivate(!isPrivate);
  };
  const openDialogHandler = (dialog: Dialogs, channel: channel) => {
    setDialogType(dialog);
    setCurrentChannel(channel);
    setOpenDialog(true);
    setIsPrivate(channel.is_private);

  };
  async function handleDeleteChannel(event: React.FormEvent) {
    const accessToken = await getAccessToken(true);
    event.preventDefault();
    const response = await fetch(`/dashboard/api/channel?id=${currentChannel?.channel_id}`, {
      method: "DELETE", 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
    }
  )
  console.log(response);
  if (response.ok) {
    await props.onFetchChannels(); 
    setOpenDialog(false);
    }
  }
  async function handleEditChannel(event: React.FormEvent) {
    const accessToken = await getAccessToken(true);
    event.preventDefault();
    const Channeldata = {
      channel_id: currentChannel?.channel_id,
      channel_name: channelName,
      is_private: isPrivate
  };
    const response = await fetch('/dashboard/api/channel', {
      method: "PUT", 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    },
      body: JSON.stringify(Channeldata),
    }
  )
  console.log(response);
  if (response.ok) {
    await props.onFetchChannels(); 
    setOpenDialog(false);
    }
  }
  return (
    <>
      {channels?.map((channel) => (
        <div key={channel.channel_id} className="flex mb-4 mt-4 ml-4 select-none">
          <ContextMenu>
            <ContextMenuTrigger>
            <div
          key={channel.channel_id}
          onClick={() => onSelectChannel(channel)}
          className={`flex select-none ${
            selectedChannel?.channel_id === channel.channel_id ? 'text-white' : 'text-gray-300'
          }`}
        >
          <Volume1Icon className="mr-2"/>
          {channel.channel_name}
        </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-dark-10 text-gray-4 shadow-2xl w-60 ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
              <ContextMenuItem onClick={() => openDialogHandler(Dialogs.Delete, channel)}>
                <CircleX className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => openDialogHandler(Dialogs.Edit, channel)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      ))}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-dark-9 text-gray-2 shadow-2xl ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0">
          {dialogType === Dialogs.Delete && (
            <>
              <DialogHeader className="flex flex-col space-y-8">
                <DialogTitle>Delete Channel</DialogTitle>
              </DialogHeader>
              <DialogDescription className="flex items-center space-x-4">
                <p className="text-gray-2">
                  Are you sure you want to delete <span className="font-semibold text-white">{currentChannel?.channel_name}</span>?
                </p>
              </DialogDescription>
              <DialogFooter>
                <form onSubmit={(event) => { event.preventDefault(); handleDeleteChannel(event); }}>
                  <Button variant="ghost" type="submit">
                    Yes, I am sure
                  </Button>
                </form>
              </DialogFooter>
            </>
          )}
          {dialogType === Dialogs.Edit && (
            <>
             <DialogHeader>
          <DialogTitle>Edit channel</DialogTitle>
          <DialogDescription className ="text-white">
            Click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => { event.preventDefault(); handleEditChannel(event); }}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 ">
            <span className="w-20 whitespace-nowrap select-none">
              Channel Name
            </span>
            <input
              required id="Channelname"
              defaultValue={currentChannel?.channel_name}
              onChange={(e) => setchannelName(e.target.value)}
              className="col-span-3 bg-dark-6 ring-0 border-0"
            />
          </div>
          <div className="flex space-x-2 justify-end items-end mb-2">
                    <Switch id="private-channel" checked={isPrivate}
                            onCheckedChange={handleToggle} 
                            className="bg-gray-300 data-[state=checked]:bg-green-500" /> 
                    <p>Private Channel</p>
                  </div>
        </div>
        <DialogFooter>
          <Button type="submit" className ="bg-dark-6  select-none">Edit channel</Button>
        </DialogFooter>
        </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default VoiceChannelList;