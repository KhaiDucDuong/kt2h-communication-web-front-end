import { Button } from "@/components/ui/button"
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
interface ChannelAddFormProps {
    onChannelAdded: () => Promise<void>;
    groupId: string;
    channelType: string;
  }

export function AddChannelForm(props:ChannelAddFormProps) {
    const [open, setOpen] = useState(false);
    const [channelType, setChannelType] = useState(`${props.channelType}`);
    const [channelName, setchannelName] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [Groupid, setGroupid] = useState(props.groupId)
    const handleToggle = () => {
      setIsPrivate(!isPrivate);
    };

    async function handleCreateChannel(event: React.FormEvent) {
      event.preventDefault();
      const Channeldata = {
        channel_name: channelName,
        channel_type: channelType,
        group_id: props.groupId,
        is_private: isPrivate
      };
      console.log(Channeldata)
      const response = await fetch('/dashboard/api/channel', {
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
      },
        body: JSON.stringify(Channeldata),
      }
    )
    console.log(response);
    if (response.ok) {
      await props.onChannelAdded(); 
      setOpen(false);
      }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
    <button className="mr-4 bg-transparent border-none hover:text-white">+</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-dark-9 text-white ring-0 border-0 select-none">
        <DialogHeader>
          <DialogTitle>Create new channel</DialogTitle>
          <DialogDescription className ="text-white">
            Click create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateChannel}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 ">
            <span className="w-20 whitespace-nowrap select-none">
              Channel Name
            </span>
            <input
              required id="Channelname"
              onChange={(e) => setchannelName(e.target.value)}
              className="col-span-3 bg-dark-6 ring-0 border-0"
            />
          </div>
          <div className="flex items-center space-x-7">
              <label htmlFor="channel-type">
            Channel Type
          </label>
                <Select value={channelType} onValueChange={setChannelType}>
                  <SelectTrigger className="w-[180px] bg-dark-9 border-0 select-none">
                    <SelectValue placeholder="Channel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="TEXT_CHANNEL">Text Channel</SelectItem>
                      <SelectItem value="VOICE_CHANNEL">Voice Channel</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
          </div>
          <div className="flex space-x-2 justify-end items-end mb-2">
                    <Switch id="private-channel" checked={isPrivate}
                            onCheckedChange={handleToggle} 
                            className="bg-gray-300 data-[state=checked]:bg-green-500" /> 
                    <p>Private Channel</p>
                  </div>
        </div>
        <DialogFooter>
          <Button type="submit" className ="bg-dark-6  select-none">Create channel</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    )
}

export default AddChannelForm
