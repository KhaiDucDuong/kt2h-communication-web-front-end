import { z } from "zod";
import { UserStatus } from "./user";
import { ContactResponse } from "./response";

export interface GroupProp extends GroupRow {
    className?: string;
    handleClick: () => void;
  }

export interface GroupRow {
    group_image: string | null;
    group_name: string;
    group_owner: string;
    group_id: string;
  }

  export interface group {
    groupid: string;
    groupname:string,
    ownerid: string;
    groupimage: string;
  }