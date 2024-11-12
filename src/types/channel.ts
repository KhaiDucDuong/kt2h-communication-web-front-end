import { z } from "zod";
import { UserStatus } from "./user";
import { ContactResponse } from "./response";

export interface ChannelProp extends ChannelRow {
    className?: string;
    handleClick: () => void;
  }

export interface ChannelRow {
    channel_id: string;
    channel_name: string;
    group_id: string;
    is_private: boolean;
    channel_type:string;
  }

  export interface channel {
    channel_id: string;
    channel_name: string;
    group_id: string;
    is_private: boolean;
    channel_type:string;
  }