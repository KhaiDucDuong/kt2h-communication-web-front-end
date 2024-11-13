import { channel }  from "@/types/channel"
import { MessageSquareText, Volume1Icon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import TextChannelList from "./TextChannelList";
import VoiceChannelList from "./VoiceChannelList";
import AddChannelForm from "./AddChannelForm";
import { group } from "@/types/group";
import React, { useEffect, useState } from "react";
interface ChannelPanelProps {
    channels: channel[];
    selectedChannel: channel | null;
    onSelectChannel: (selectedChannel: channel) => void;
    onFetchChannels: () => Promise<void>;
  }
const ChannelPanel = (props:group) =>{
    const [selectedChannel, onSelectChannel] = React.useState<channel | null>(null);
    const [ChannelList,setChannelList] = useState<channel[]>([]);

    const fetchChannelList = async () => {
      let res;
      try {
        res = await fetch(`/dashboard/api/channel?id=${props.group_id}`, {
          method: "GET",
        });
  
        if (res.status !== 200) {
          throw new Error("Failed to fetch group chat list");
        }
  
        const data = await res.json();
        if (data.response.statusCode === 200) {
          setChannelList(data.response.data);
        }
      } catch (error) {
        console.log("Error: " + error);
      }
    };
    useEffect(() => {
      fetchChannelList();
    }, [props.group_id]);
    return(
<section className="w-full">
<div className="text-white font-bold mb-4 bg-dark-9">
        {props.group_name}
        </div>
  <div className="flex justify-between items-center text-gray-300 font-bold mb-1">
    <div className="flex items-center">
    <ChevronDown />
    <p className="ml-2 select-none">Text Channel</p> 
    </div>
    <AddChannelForm onChannelAdded={fetchChannelList} groupId={props.group_id} channelType="TEXT_CHANNEL"/>
    </div>
      <TextChannelList channels={ChannelList.filter(channel => channel.channel_type === "TEXT_CHANNEL")}
      selectedChannel={selectedChannel}
      onSelectChannel={onSelectChannel}
      onFetchChannels={fetchChannelList} />
  <div className="flex justify-between items-center text-gray-300 font-bold mb-1">
  <div className="flex items-center">
  <ChevronDown />
    <p className="ml-2 select-none">Voice Channel</p>
    </div>
      <AddChannelForm onChannelAdded={fetchChannelList} groupId={props.group_id} channelType="VOICE_CHANNEL"/>
  </div>
  <VoiceChannelList channels={ChannelList.filter(channel => channel.channel_type === "VOICE_CHANNEL")}
      selectedChannel={selectedChannel}
      onSelectChannel={onSelectChannel}
      onFetchChannels={fetchChannelList} />

</section>

    )
}

export default ChannelPanel